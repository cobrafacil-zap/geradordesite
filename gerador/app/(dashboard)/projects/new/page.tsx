'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Textarea, Card, Badge, Spinner, Select } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@/components/dashboard/sidebar';

const STEPS = [
  { id: 1, label: 'Cliente' },
  { id: 2, label: 'Segmento' },
  { id: 3, label: 'Modelo' },
  { id: 4, label: 'Conteúdo' },
  { id: 5, label: 'Identidade visual' },
  { id: 6, label: 'Imagens' },
  { id: 7, label: 'Referências' },
  { id: 8, label: 'Gerar' },
];

const SEGMENTS = [
  { id: 'institucional', name: 'Institucional', emoji: '🏢', desc: 'Empresas, indústrias, escritórios' },
  { id: 'servicos', name: 'Serviços', emoji: '🛠️', desc: 'Clínicas, oficinas, agências' },
  { id: 'comercio', name: 'Comércio', emoji: '🛒', desc: 'Lojas, restaurantes, padarias' },
  { id: 'profissionais', name: 'Profissionais', emoji: '👔', desc: 'Advogados, contadores, consultores' },
];

interface DraftProject {
  name: string;
  clientName: string;
  segment: string;
  templateId: string;
  templateName: string;
  tradeName: string;
  slogan: string;
  about: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  primaryColor: string;
  style: string;
  heroImageUrl: string;
  references: string;
}

const DEFAULT_DRAFT: DraftProject = {
  name: '',
  clientName: '',
  segment: 'institucional',
  templateId: 'empresa-corporativa',
  templateName: 'Empresa Corporativa',
  tradeName: '',
  slogan: '',
  about: '',
  whatsapp: '',
  email: '',
  city: '',
  state: '',
  primaryColor: '#7c5cff',
  style: 'moderno',
  heroImageUrl: '',
  references: '',
};

export default function NewProjectPage() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<DraftProject>(DEFAULT_DRAFT);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof DraftProject>(key: K, value: DraftProject[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function generate() {
    setError(null);
    setGenerating(true);
    try {
      // Cria projeto
      const payload = {
        name: draft.name || draft.tradeName || draft.clientName,
        templateId: draft.templateId,
        tradeName: draft.tradeName,
        segment: draft.segment,
      };
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao criar projeto');
      const projectId = data.project?.id;
      if (!projectId) throw new Error('projeto criado sem id');
      // Redireciona para o editor
      router.push(`/projects/${projectId}/edit?autostart=1`);
    } catch (e: any) {
      setError(e?.message || 'Erro');
      setGenerating(false);
    }
  }

  const canAdvance = (() => {
    switch (step) {
      case 1: return draft.clientName.trim().length > 0;
      case 2: return !!draft.segment;
      case 3: return !!draft.templateId;
      case 4: return draft.tradeName.trim().length > 0;
      case 5: return !!draft.primaryColor;
      case 6: return true; // opcional
      case 7: return true; // opcional
      default: return true;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <div className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="btn-ghost p-2">
            <Icon name="arrow-left" size={16} />
          </Link>
          <div>
            <div className="text-sm font-semibold text-fg">Novo Projeto</div>
            <div className="text-xs text-fg-muted">Passo {step} de {STEPS.length}</div>
          </div>
        </div>
        <Link href="/projects" className="text-xs text-fg-muted hover:text-fg">
          Cancelar
        </Link>
      </div>

      {/* Stepper */}
      <div className="px-8 py-5 border-b border-border bg-bg-elev/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                    step > s.id
                      ? 'bg-accent border-accent text-white'
                      : step === s.id
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-bg-elev border-border text-fg-dim'
                  }`}
                >
                  {step > s.id ? <Icon name="check" size={14} /> : s.id}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                  step >= s.id ? 'text-fg' : 'text-fg-dim'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${step > s.id ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-8 py-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Card hover={false}>
            {step === 1 && (
              <Step1
                clientName={draft.clientName}
                projectName={draft.name}
                onClient={(v: string) => update('clientName', v)}
                onProject={(v: string) => update('name', v)}
              />
            )}
            {step === 2 && (
              <Step2
                segment={draft.segment}
                onSegment={(v: string) => {
                  update('segment', v);
                  // Sugere template default por segmento
                  const defaults: Record<string, string> = {
                    institucional: 'empresa-corporativa',
                    servicos: 'clinica-medica',
                    comercio: 'restaurante',
                    profissionais: 'advogado',
                  };
                  if (defaults[v]) update('templateId', defaults[v]);
                }}
              />
            )}
            {step === 3 && (
              <Step3
                segment={draft.segment}
                templateId={draft.templateId}
                onPick={(id: string, name: string) => {
                  update('templateId', id);
                  update('templateName', name);
                }}
              />
            )}
            {step === 4 && (
              <Step4 draft={draft} onChange={update} />
            )}
            {step === 5 && (
              <Step5 draft={draft} onChange={update} />
            )}
            {step === 6 && (
              <Step6 draft={draft} onChange={update} />
            )}
            {step === 7 && (
              <Step7 draft={draft} onChange={update} />
            )}
            {step === 8 && (
              <Step8 draft={draft} />
            )}

            {error && (
              <div className="mt-6 text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg p-3">
                {error}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-border px-8 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          disabled={step === 1 || generating}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          <Icon name="arrow-left" size={14} /> Voltar
        </Button>

        {step < STEPS.length ? (
          <Button
            disabled={!canAdvance}
            onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
          >
            Continuar <Icon name="arrow-right" size={14} />
          </Button>
        ) : (
          <Button
            onClick={generate}
            loading={generating}
            size="lg"
            icon={<Icon name="sparkles" size={16} />}
          >
            {generating ? 'Criando projeto...' : 'Gerar projeto'}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── STEP 1: Cliente ─────────────────────────────────────────── */
function Step1({ clientName, projectName, onClient, onProject }: any) {
  return (
    <div className="space-y-4">
      <Header title="Para quem é o site?" subtitle="Identifique o cliente. Você pode reutilizar clientes em vários projetos." />
      <Input
        label="Nome do cliente"
        value={clientName}
        onChange={(e) => onClient(e.target.value)}
        placeholder="Ex: Aurélio & Bastos Advocacia"
        autoFocus
      />
      <Input
        label="Nome do projeto (opcional)"
        value={projectName}
        onChange={(e) => onProject(e.target.value)}
        placeholder="Será inferido se vazio"
        hint="Use um nome interno para localizar no dashboard."
      />
    </div>
  );
}

/* ── STEP 2: Segmento ────────────────────────────────────────── */
function Step2({ segment, onSegment }: any) {
  return (
    <div className="space-y-4">
      <Header title="Qual é o segmento?" subtitle="Vamos filtrar os modelos mais adequados." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSegment(s.id)}
            className={`text-left p-5 rounded-lg border transition-colors ${
              segment === s.id
                ? 'bg-accent-soft border-accent'
                : 'bg-bg-elev border-border hover:border-border-strong'
            }`}
          >
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div className="text-sm font-semibold text-fg mb-1">{s.name}</div>
            <div className="text-xs text-fg-muted">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── STEP 3: Modelo ──────────────────────────────────────────── */
function Step3({ segment, templateId, onPick }: any) {
  const templates = TEMPLATES_BY_SEGMENT[segment] || [];
  return (
    <div className="space-y-4">
      <Header title="Escolha um modelo" subtitle={`${templates.length} modelos no segmento selecionado.`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {templates.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => onPick(t.slug, t.name)}
            className={`text-left rounded-lg border overflow-hidden transition-colors ${
              templateId === t.slug
                ? 'border-accent ring-2 ring-accent/30'
                : 'border-border hover:border-border-strong'
            }`}
          >
            <div
              className="aspect-[4/3] relative"
              style={{ background: `linear-gradient(135deg, ${t.color}22 0%, ${t.color}66 100%)` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl">
                  {t.emoji}
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold text-fg">{t.name}</div>
              <div className="text-xs text-fg-muted mt-0.5">{t.tag}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── STEP 4: Conteúdo ────────────────────────────────────────── */
function Step4({ draft, onChange }: any) {
  return (
    <div className="space-y-4">
      <Header title="Conteúdo básico" subtitle="Opcionalmente, a IA pode preencher o resto depois." />
      <Input label="Nome fantasia" value={draft.tradeName} onChange={(e) => onChange('tradeName', e.target.value)} placeholder="Como o negócio aparece" />
      <Input label="Slogan" value={draft.slogan} onChange={(e) => onChange('slogan', e.target.value)} placeholder="Frase curta que define o negócio" />
      <Textarea label="Sobre (2-3 linhas)" value={draft.about} onChange={(e) => onChange('about', e.target.value)} placeholder="Conte brevemente o que faz e para quem" rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="WhatsApp" value={draft.whatsapp} onChange={(e) => onChange('whatsapp', e.target.value)} placeholder="5511999999999" />
        <Input label="Email" value={draft.email} onChange={(e) => onChange('email', e.target.value)} placeholder="contato@empresa.com" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input label="Cidade" value={draft.city} onChange={(e) => onChange('city', e.target.value)} placeholder="São Paulo" />
        <Input label="UF" value={draft.state} onChange={(e) => onChange('state', e.target.value)} placeholder="SP" />
      </div>
    </div>
  );
}

/* ── STEP 5: Identidade visual ───────────────────────────────── */
function Step5({ draft, onChange }: any) {
  const presets = [
    { name: 'Moderno', primary: '#7c5cff', secondary: '#5b8bff' },
    { name: 'Corporativo', primary: '#1e40af', secondary: '#3b82f6' },
    { name: 'Calmo', primary: '#0d9488', secondary: '#06b6d4' },
    { name: 'Quente', primary: '#dc2626', secondary: '#f97316' },
    { name: 'Luxo', primary: '#1f1f1f', secondary: '#d4af37' },
    { name: 'Natural', primary: '#16a34a', secondary: '#84cc16' },
  ];
  return (
    <div className="space-y-4">
      <Header title="Identidade visual" subtitle="Cor primária e estilo. Refinaremos depois no editor." />
      <div>
        <span className="block text-xs font-medium text-fg-muted mb-2">Presets</span>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                onChange('style', p.name.toLowerCase());
                onChange('primaryColor', p.primary);
              }}
              className={`p-3 rounded-lg border text-left ${
                draft.primaryColor === p.primary ? 'border-accent ring-1 ring-accent/40' : 'border-border'
              }`}
              style={{ background: `linear-gradient(135deg, ${p.primary} 0%, ${p.secondary} 100%)` }}
            >
              <div className="text-xs font-semibold text-white drop-shadow">{p.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block text-xs font-medium text-fg-muted mb-1.5">Cor primária</span>
          <div className="flex gap-2">
            <input
              type="color"
              value={draft.primaryColor}
              onChange={(e) => onChange('primaryColor', e.target.value)}
              className="w-12 h-10 rounded border border-border cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={draft.primaryColor}
              onChange={(e) => onChange('primaryColor', e.target.value)}
              className="flex-1 bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
        <Select label="Estilo" value={draft.style} onChange={(e) => onChange('style', e.target.value)}>
          <option value="moderno">Moderno</option>
          <option value="corporativo">Corporativo</option>
          <option value="criativo">Criativo</option>
          <option value="premium">Premium</option>
          <option value="minimalista">Minimalista</option>
        </Select>
      </div>
    </div>
  );
}

/* ── STEP 6: Imagens ─────────────────────────────────────────── */
function Step6({ draft, onChange }: any) {
  return (
    <div className="space-y-4">
      <Header title="Imagem principal (hero)" subtitle="Cole uma URL ou deixe para usar placeholder. Você poderá trocar depois." />
      <Input
        label="URL da imagem hero"
        value={draft.heroImageUrl}
        onChange={(e) => onChange('heroImageUrl', e.target.value)}
        placeholder="https://images.unsplash.com/..."
      />
      <div className="text-xs text-fg-muted p-3 bg-bg-elev rounded-lg border border-border">
        💡 Dica: use <a className="text-accent" href="https://unsplash.com" target="_blank">Unsplash</a> ou <a className="text-accent" href="https://pexels.com" target="_blank">Pexels</a> para fotos gratuitas. Você poderá fazer upload depois.
      </div>
    </div>
  );
}

/* ── STEP 7: Referências ─────────────────────────────────────── */
function Step7({ draft, onChange }: any) {
  return (
    <div className="space-y-4">
      <Header title="Referências (opcional)" subtitle="Sites que você gosta. A IA pode usar como inspiração." />
      <Textarea
        value={draft.references}
        onChange={(e) => onChange('references', e.target.value)}
        placeholder="Cole URLs separados por vírgula: https://site1.com, https://site2.com"
        rows={5}
      />
      <div className="text-xs text-fg-muted">
        A IA analisará paleta, tipografia e estrutura de páginas similares.
      </div>
    </div>
  );
}

/* ── STEP 8: Confirmação ─────────────────────────────────────── */
function Step8({ draft }: any) {
  const summary = [
    ['Cliente', draft.clientName],
    ['Nome do projeto', draft.name || draft.tradeName],
    ['Segmento', SEGMENTS.find(s => s.id === draft.segment)?.name || draft.segment],
    ['Modelo', draft.templateName],
    ['Nome fantasia', draft.tradeName],
    ['Slogan', draft.slogan || '—'],
    ['WhatsApp', draft.whatsapp || '—'],
    ['Cor primária', draft.primaryColor],
    ['Estilo', draft.style],
  ];
  return (
    <div className="space-y-4">
      <Header title="Tudo pronto!" subtitle="Revise os dados e clique em Gerar Projeto." />
      <div className="space-y-1 rounded-lg border border-border overflow-hidden">
        {summary.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5 bg-bg-elev border-b border-border last:border-0 text-sm">
            <span className="text-fg-muted">{k}</span>
            <span className="text-fg font-medium text-right truncate ml-4 max-w-[60%]">{v || '—'}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-fg-muted p-3 bg-accent/5 border border-accent/20 rounded-lg">
        ✨ Na próxima tela, vamos gerar o site. Isso leva entre 30s e 2min dependendo do tamanho.
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-fg">{title}</h2>
      {subtitle && <p className="text-sm text-fg-muted mt-1">{subtitle}</p>}
    </div>
  );
}

/* ── Template registry lite (espelha lib/generator/templates) ─ */
const TEMPLATES_BY_SEGMENT: Record<string, Array<{ slug: string; name: string; tag: string; emoji: string; color: string }>> = {
  institucional: [
    { slug: 'empresa-corporativa', name: 'Empresa Corporativa', tag: 'B2B tradicional', emoji: '🏛️', color: '#1e40af' },
    { slug: 'empresa-moderna', name: 'Empresa Moderna', tag: 'Tech / SaaS', emoji: '⚡', color: '#7c5cff' },
    { slug: 'empresa-premium', name: 'Empresa Premium', tag: 'Luxo / Boutique', emoji: '💎', color: '#1f1f1f' },
    { slug: 'industria', name: 'Indústria', tag: 'Manufatura', emoji: '🏭', color: '#475569' },
    { slug: 'construtora', name: 'Construtora', tag: 'Obras e imóveis', emoji: '🏗️', color: '#b45309' },
    { slug: 'startup', name: 'Startup', tag: 'Inovação', emoji: '🚀', color: '#db2777' },
    { slug: 'empresa-local', name: 'Empresa Local', tag: 'Regional', emoji: '📍', color: '#0d9488' },
    { slug: 'escritorio-advocacia', name: 'Escritório de Advocacia', tag: 'Jurídico B2B', emoji: '⚖️', color: '#581c87' },
  ],
  servicos: [
    { slug: 'clinica-medica', name: 'Clínica Médica', tag: 'Saúde', emoji: '⚕️', color: '#0891b2' },
    { slug: 'odontologia', name: 'Odontologia', tag: 'Saúde bucal', emoji: '🦷', color: '#06b6d4' },
    { slug: 'estetica', name: 'Estética & Beleza', tag: 'Beleza', emoji: '💄', color: '#ec4899' },
    { slug: 'eletricista', name: 'Eletricista', tag: 'Reparos', emoji: '⚡', color: '#eab308' },
    { slug: 'encanador', name: 'Encanador', tag: 'Reparos', emoji: '🔧', color: '#2563eb' },
    { slug: 'mecanica', name: 'Mecânica / Auto Center', tag: 'Automotivo', emoji: '🔩', color: '#dc2626' },
    { slug: 'assistencia-tecnica', name: 'Assistência Técnica', tag: 'Tech', emoji: '🛠️', color: '#0ea5e9' },
    { slug: 'agencia-marketing', name: 'Agência de Marketing', tag: 'Serviços criativos', emoji: '📊', color: '#a855f7' },
    { slug: 'limpeza', name: 'Limpeza', tag: 'Doméstico / corporativo', emoji: '🧹', color: '#10b981' },
    { slug: 'imobiliaria', name: 'Imobiliária', tag: 'Venda / aluguel', emoji: '🏘️', color: '#0891b2' },
  ],
  comercio: [
    { slug: 'loja', name: 'Loja / Catálogo', tag: 'Varejo', emoji: '🛍️', color: '#f97316' },
    { slug: 'restaurante', name: 'Restaurante', tag: 'Gastronomia', emoji: '🍽️', color: '#dc2626' },
    { slug: 'pizzaria', name: 'Pizzaria', tag: 'Gastronomia', emoji: '🍕', color: '#ea580c' },
    { slug: 'padaria', name: 'Padaria', tag: 'Padaria / confeitaria', emoji: '🥖', color: '#a16207' },
    { slug: 'academia', name: 'Academia', tag: 'Fitness', emoji: '💪', color: '#16a34a' },
    { slug: 'pet-shop', name: 'Pet Shop', tag: 'Animais', emoji: '🐾', color: '#f59e0b' },
    { slug: 'fotografo', name: 'Fotógrafo', tag: 'Portfolio', emoji: '📸', color: '#1e293b' },
  ],
  profissionais: [
    { slug: 'advogado', name: 'Advogado Autônomo', tag: 'Jurídico', emoji: '👨‍⚖️', color: '#581c87' },
    { slug: 'contador', name: 'Contador', tag: 'Contábil', emoji: '📒', color: '#1d4ed8' },
    { slug: 'corretor', name: 'Corretor de Imóveis', tag: 'Imobiliário', emoji: '🔑', color: '#0891b2' },
    { slug: 'personal-trainer', name: 'Personal Trainer', tag: 'Fitness', emoji: '🏋️', color: '#16a34a' },
    { slug: 'consultor', name: 'Consultor / Autônomo', tag: 'Consultoria', emoji: '🎯', color: '#7c3aed' },
  ],
};
