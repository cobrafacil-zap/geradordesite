/**
 * API: GET /api/export/[id]
 * Gera o ZIP real do projeto e retorna como download.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { buildAllFiles } from '@/lib/generator/file-builder';
import { buildZipBuffer } from '@/lib/generator/zip';
import { SiteSchema as siteZod } from '@/lib/generator/site-schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = isSupabaseConfigured() ? createServerSupabase() : null;
  if (!supabase) {
    return NextResponse.json({ error: 'supabase não configurado' }, { status: 503 });
  }

  const projectId = params.id;
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name, current_version_id')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: 'projeto não encontrado' }, { status: 404 });
  }

  if (!project.current_version_id) {
    return NextResponse.json({ error: 'projeto sem versão — gere primeiro' }, { status: 400 });
  }

  const { data: version } = await supabase
    .from('project_versions')
    .select('schema_json, theme_json, assets_json, label')
    .eq('id', project.current_version_id)
    .single();

  if (!version?.schema_json) {
    return NextResponse.json({ error: 'versão sem schema' }, { status: 400 });
  }

  // Validar com Zod (garante que não vamos exportar lixo)
  const parsed = siteZod.safeParse(version.schema_json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'schema inválido', issues: parsed.error.issues }, { status: 422 });
  }

  const site = parsed.data;
  const assets = (version.assets_json as any[]) || [];
  const dbAdapter: 'sqlite' | 'postgres' =
    (req.nextUrl.searchParams.get('db') as 'sqlite' | 'postgres') || 'sqlite';

  const files = buildAllFiles({
    projectName: project.name,
    site,
    assets,
    dbAdapter,
  });

  const buffer = await buildZipBuffer(files, { root: slugify(project.name) });

  return new NextResponse(buffer as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slugify(project.name)}.zip"`,
      'Content-Length': String(buffer.length),
    },
  });
}

function slugify(s: string): string {
  return String(s || 'site').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'site';
}