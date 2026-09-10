/**
 * Converte um briefing pago em um Project + project_version no Supabase.
 *
 * Chamado pelo webhook do Mercado Pago (em /api/webhooks/mercadopago)
 * quando o status de pagamento muda pra 'approved'.
 *
 * Idempotente: se já existe `briefings.project_id`, não duplica.
 *
 * Estratégia:
 *  1) Encontra ou cria `clients` (por whatsapp) com nome/segmento.
 *  2) Cria `projects` com status 'draft', template_id a definir pelo admin.
 *  3) Cria `project_versions` com o briefing dentro de `schema_json.briefing`.
 *     O admin vai gerar conteúdo com IA depois (aba IA do editor).
 *  4) Atualiza `briefings.project_id`.
 *
 * Em modo dev (sem Supabase) → apenas loga e retorna um id fake,
 * pra permitir testar o fluxo end-to-end sem banco.
 */
import { createAdminSupabase, isSupabaseAdminConfigured } from './supabase';
import type { BriefingInput } from './briefing-schema';

export type ConvertBriefingResult = {
  clientId: string;
  projectId: string;
  versionId: string;
  isNew: boolean;
  devMode: boolean;
};

const TEMPLATE_PLACEHOLDER = 'lp-lead-magnet'; // admin pode trocar no editor

export async function briefingToProject(
  briefingId: string,
  briefing: BriefingInput & { token: string },
): Promise<ConvertBriefingResult> {
  // Dev mode: sem Supabase, retorna ids fake
  if (!isSupabaseAdminConfigured()) {
    const fakeId = `dev-${Date.now().toString(36)}`;
    console.log('[briefing-to-project] dev mode: skipping DB write for briefing', briefingId);
    return {
      clientId: `dev-client-${fakeId}`,
      projectId: `dev-project-${fakeId}`,
      versionId: `dev-version-${fakeId}`,
      isNew: true,
      devMode: true,
    };
  }

  const supabase = createAdminSupabase();

  // 1) Idempotência: se já tem project_id, retorna
  const { data: existing } = await supabase
    .from('briefings')
    .select('project_id, client_id')
    .eq('id', briefingId)
    .single();

  if (existing?.project_id) {
    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, current_version_id')
      .eq('id', existing.project_id)
      .single();
    if (proj) {
      return {
        clientId: existing.client_id || proj.client_id || '',
        projectId: proj.id,
        versionId: proj.current_version_id || '',
        isNew: false,
        devMode: false,
      };
    }
  }

  // 2) Find-or-create client
  const whatsappDigits = (briefing.whatsapp || '').replace(/\D/g, '');
  let clientId: string | null = existing?.client_id || null;

  if (!clientId && whatsappDigits) {
    // tenta achar pelo whatsapp
    const { data: found } = await supabase
      .from('clients')
      .select('id')
      .eq('whatsapp', briefing.whatsapp || '')
      .maybeSingle();
    clientId = found?.id || null;
  }

  if (!clientId) {
    const { data: newClient, error: clientErr } = await supabase
      .from('clients')
      .insert({
        name: briefing.client_name || 'Cliente sem nome',
        whatsapp: briefing.whatsapp || null,
        email: null,
        notes: briefing.description || null,
      })
      .select('id')
      .single();
    if (clientErr) throw new Error(`Falha ao criar client: ${clientErr.message}`);
    clientId = newClient.id;
  }

  // 3) Cria project
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      name: briefing.client_name || 'Site novo',
      template_id: TEMPLATE_PLACEHOLDER,
      status: 'draft',
    })
    .select('id')
    .single();
  if (projErr) throw new Error(`Falha ao criar project: ${projErr.message}`);

  // 4) Cria project_version com o briefing dentro de schema_json
  const schema = {
    briefing: {
      ...briefing,
      // serializa pra garantir que não tem undefined
      photos: briefing.photos || [],
    },
    pages: [],
    theme: { colors: {}, fonts: { heading: 'Inter', body: 'Inter' } },
    navigation: [],
    seo: { title: briefing.client_name || '', description: '' },
    settings: {
      whatsapp: briefing.whatsapp || '',
      instagram: briefing.instagram || '',
    },
  };

  const { data: version, error: verErr } = await supabase
    .from('project_versions')
    .insert({
      project_id: project.id,
      label: 'Briefing inicial',
      schema,
      theme: schema.theme,
      assets: { logo: briefing.logo_url || null, photos: briefing.photos || [] },
    })
    .select('id')
    .single();
  if (verErr) throw new Error(`Falha ao criar version: ${verErr.message}`);

  // 5) Atualiza projects.current_version_id e briefings.project_id
  await supabase
    .from('projects')
    .update({ current_version_id: version.id })
    .eq('id', project.id);

  await supabase
    .from('briefings')
    .update({ project_id: project.id, client_id: clientId })
    .eq('id', briefingId);

  return {
    clientId: clientId!,
    projectId: project.id,
    versionId: version.id,
    isNew: true,
    devMode: false,
  };
}
