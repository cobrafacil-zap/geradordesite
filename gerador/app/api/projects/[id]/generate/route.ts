/**
 * API: POST /api/projects/[id]/generate
 *
 * Dispara o pipeline de geração real do site.
 * Retorna Server-Sent Events com progresso por etapa (Node.js Fluid Compute).
 */
import { NextRequest } from 'next/server';
import { runPipeline, type StepInfo } from '@/lib/generator/pipeline';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSchema as siteZod } from '@/lib/generator/site-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  const body = await req.json().catch(() => ({}));
  const dbAdapter = (body.dbAdapter || 'sqlite') as 'sqlite' | 'postgres';

  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ error: 'supabase não configurado' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createServerSupabase();
  const { data: project } = await supabase
    .from('projects')
    .select('id, name, current_version_id')
    .eq('id', projectId)
    .single();

  if (!project) {
    return new Response(JSON.stringify({ error: 'projeto não encontrado' }), {
      status: 404, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!project.current_version_id) {
    return new Response(JSON.stringify({ error: 'projeto sem versão' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: version } = await supabase
    .from('project_versions')
    .select('schema_json, assets_json')
    .eq('id', project.current_version_id)
    .single();

  if (!version?.schema_json) {
    return new Response(JSON.stringify({ error: 'versão sem schema' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validar schema antes mesmo de iniciar o pipeline
  const parsed = siteZod.safeParse(version.schema_json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'schema inválido', issues: parsed.error.issues }), {
      status: 422, headers: { 'Content-Type': 'application/json' },
    });
  }

  // SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('start', { projectId, projectName: project.name });

      try {
        const result = await runPipeline({
          projectName: project.name,
          schema: parsed.data,
          assets: (version.assets_json as any[]) || [],
          dbAdapter,
        });

        // Enviar cada step
        for (const step of result.steps) {
          send('step', step satisfies StepInfo);
        }

        if (!result.ok) {
          send('error', { message: result.error, failedStep: result.failedStep });
          controller.close();
          return;
        }

        send('done', {
          fileCount: Object.keys(result.files!).length,
          zipSize: result.zip!.length,
        });
        controller.close();
      } catch (e: any) {
        send('error', { message: e?.message || 'erro desconhecido' });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}