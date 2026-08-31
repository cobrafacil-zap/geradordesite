'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Textarea, Card, Badge, Spinner, Select, ConfirmDialog } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@/components/dashboard/sidebar';

type TabId = 'content' | 'sections' | 'theme' | 'seo' | 'ai';

interface Version {
  schema: any;
  meta?: { id?: string; projectName?: string };
}

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'content', label: 'Conteúdo', icon: 'edit' },
  { id: 'sections', label: 'Seções', icon: 'layers' },
  { id: 'theme', label: 'Tema', icon: 'palette' },
  { id: 'seo', label: 'SEO', icon: 'search' },
  { id: 'ai', label: 'IA', icon: 'sparkles' },
];

export default function EditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const toast = useToast();
  const projectId = params.id;
  const autostart = searchParams.get('autostart') === '1';

  const [schema, setSchema] = useState<any | null>(null);
  const [original, setOriginal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>('content');
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genSteps, setGenSteps] = useState<Array<{ id: string; label: string; status: string; message?: string }>>([]);
  const [toClose, setToClose] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewKey, setPreviewKey] = useState(0);
  // Guarda que startGeneration só roda uma vez por sessão de página,
  // mesmo se loadProject for chamado várias vezes (autostart loop)
  const startedRef = useRef(false);

  // Carrega projeto + schema
  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function loadProject() {
    setLoading(true);
    try {
      // Tenta algumas vezes — projeto pode ter acabado de ser criado e o
      // current_version_id ainda não ter sido propagado (race em POST /api/projects).
      const MAX_ATTEMPTS = 5;
      let res: Response | null = null;
      let data: any = null;
      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        res = await fetch(`/api/projects/${projectId}`);
        data = await res.json();
        if (res.ok && data.project?.project_versions?.schema_json) break;
        if (res.status === 404) break; // projeto não existe, não adianta tentar
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
      }
      // Modo dev sem Supabase → carrega schema de localStorage
      if (!res || !res.ok || data?.error) {
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(`gerador:project:${projectId}`);
          if (cached) {
            try {
              const s = JSON.parse(cached);
              setSchema(s);
              setOriginal(JSON.stringify(s));
              if (autostart && !startedRef.current) {
            startedRef.current = true;
            startGeneration();
          }
              return;
            } catch {}
          }
        }
        setSchema(null);
        return;
      }
      if (data.project?.project_versions?.schema_json) {
        const s = data.project.project_versions.schema_json;
        setSchema(s);
        setOriginal(JSON.stringify(s));
        if (typeof window !== 'undefined') {
          localStorage.setItem(`gerador:project:${projectId}`, JSON.stringify(s));
        }
        if (autostart && !startedRef.current) {
            startedRef.current = true;
            startGeneration();
          }
      } else {
        setSchema(null);
      }
    } catch (e) {
      console.error(e);
      // Fallback localStorage
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`gerador:project:${projectId}`);
        if (cached) {
          try {
            const s = JSON.parse(cached);
            setSchema(s);
            setOriginal(JSON.stringify(s));
            return;
          } catch {}
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // Autosave debounced 1s
  const autosave = useCallback((s: any) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSave(s), 1000);
  }, []);

  function updateSchema(mutator: (s: any) => void) {
    if (!schema) return;
    // Garante estrutura mínima — evita que mutações quebrem em undefined
    const next = structuredClone(schema);
    if (!next.site) next.site = { name: '' };
    if (!next.theme) next.theme = { colors: {}, fonts: { heading: 'Inter', body: 'Inter' } };
    if (!next.theme.colors) next.theme.colors = {};
    if (!next.theme.fonts) next.theme.fonts = { heading: 'Inter', body: 'Inter' };
    if (!next.settings) next.settings = { social: {} };
    if (!next.settings.social) next.settings.social = {};
    if (!next.pages) next.pages = [];
    if (!next.pages[selectedPageIdx]) next.pages[selectedPageIdx] = { slug: '/', name: 'Início', title: '', description: '', sections: [] };
    if (!next.pages[selectedPageIdx].sections) next.pages[selectedPageIdx].sections = [];
    mutator(next);
    setSchema(next);
    autosave(next);
  }

  async function doSave(s: any) {
    setSaving(true);
    try {
      // 1) Sempre salva em localStorage como fallback (funciona mesmo sem Supabase)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`gerador:project:${projectId}`, JSON.stringify(s));
        } catch {}
      }
      // 2) Tenta persistir no Supabase. Só recarrega o iframe APÓS o 200 OK
      //    para garantir que o DB tem o schema novo antes do preview buscar.
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schema: s }),
        });
        if (res.ok) {
          setSavedAt(new Date());
          // Incrementa previewKey DEPOIS do save — assim o iframe só
          // recarrega com a nova URL quando o DB já tem o schema novo.
          setPreviewKey((k) => k + 1);
          // Força reload duro do iframe também — backup caso o cache do
          // navegador segure o iframe apesar do key ter mudado.
          try {
            const ifr = iframeRef.current;
            if (ifr && ifr.contentWindow) {
              ifr.contentWindow.location.reload();
            }
          } catch {}
        }
      } catch {}
    } finally {
      setSaving(false);
    }
  }

  async function startGeneration() {
    setGenerating(true);
    setGenSteps([
      { id: 'analyze', label: 'Analisando as informações do projeto…', status: 'pending' },
      { id: 'ai_structure', label: 'Gerando estrutura com IA…', status: 'pending' },
      { id: 'validate_content', label: 'Validando consistência do conteúdo…', status: 'pending' },
      { id: 'resolve_assets', label: 'Resolvendo imagens e assets…', status: 'pending' },
      { id: 'build_files', label: 'Montando arquivos do site…', status: 'pending' },
      { id: 'validate_project', label: 'Validando o projeto final…', status: 'pending' },
      { id: 'package', label: 'Empacotando o projeto…', status: 'pending' },
    ]);
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbAdapter: 'sqlite' }),
      });
      if (!res.body) {
        setGenerating(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split('\n\n');
        buf = events.pop() || '';
        for (const ev of events) {
          const lines = ev.split('\n').filter(Boolean);
          let event = 'message';
          let data = '';
          for (const line of lines) {
            if (line.startsWith('event:')) event = line.slice(6).trim();
            else if (line.startsWith('data:')) data += line.slice(5).trim();
          }
          if (!data) continue;
          try {
            const parsed = JSON.parse(data);
            if (event === 'step') {
              setGenSteps((cur) => cur.map((s) => s.id === parsed.id ? { ...s, ...parsed } : s));
            } else if (event === 'done') {
              // marca tudo done
              setGenSteps((cur) => cur.map((s) => ({ ...s, status: 'done' })));
            } else if (event === 'error') {
              setGenSteps((cur) => cur.map((s, i) => i === cur.length - 1 ? { ...s, status: 'error', message: parsed.message } : s));
            }
          } catch {}
        }
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setGenerating(false);
      // Recarrega schema gerado (sem disparar novo startGeneration)
      startedRef.current = true;
      await loadProject();
    }
  }

  async function duplicate() {
    const res = await fetch(`/api/projects/${projectId}/duplicate`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      toast.success('Projeto duplicado');
      router.push(`/projects/${data.project.id}/edit`);
    } else {
      toast.error('Falha ao duplicar');
    }
  }

  async function exportZip() {
    toast.info('Preparando ZIP...');
    try {
      const res = await fetch(`/api/export/${projectId}`);
      if (!res.ok) {
        toast.error('Falha ao exportar');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schema?.site?.name || 'site'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download iniciado', `${(blob.size / 1024).toFixed(0)} KB`);
    } catch (e: any) {
      toast.error('Erro no download', e?.message);
    }
  }

  async function saveAndExit() {
    if (schema) await doSave(schema);
    toast.success('Projeto salvo');
    router.push('/projects');
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center"><Spinner size={32} /></div>
    );
  }

  if (!schema) {
    return (
      <div className="p-8 max-w-xl">
        <Card hover={false}>
          <h2 className="text-base font-semibold text-fg mb-1">Projeto sem schema</h2>
          <p className="text-sm text-fg-muted mb-4">
            Este projeto foi criado, mas a versão inicial ainda não foi gerada.
            Isso pode acontecer se a sessão expirou no meio do processo ou se a
            vinculação automática falhou. Tente recarregar a página em alguns
            segundos; se persistir, apague este projeto e crie outro.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary text-sm"
            >
              Recarregar
            </button>
            <Link href="/projects" className="btn-secondary text-sm">Voltar ao dashboard</Link>
          </div>
        </Card>
      </div>
    );
  }

  const currentPage = schema.pages?.[selectedPageIdx];

  return (
    <div className="h-screen flex flex-col bg-bg">
      {/* Topbar */}
      <header className="border-b border-border bg-bg-elev/60 backdrop-blur px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/projects" className="text-fg-muted hover:text-fg">
            <Icon name="arrow-left" size={16} />
          </Link>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-fg truncate">{schema.site?.name || 'Projeto'}</div>
            <div className="text-[11px] text-fg-dim flex items-center gap-2">
              {saving ? (<><Spinner size={10} /> salvando...</>) : savedAt ? `salvo ${savedAt.toLocaleTimeString('pt-BR')}` : 'sem alterações'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/projects/${projectId}/versions`}>
            <Button variant="ghost" size="sm">
              <Icon name="history" size={14} /> Versões
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={duplicate}>
            <Icon name="duplicate" size={14} /> Duplicar
          </Button>
          <Link href={`/projects/${projectId}/present`} target="_blank">
            <Button variant="secondary" size="sm">
              <Icon name="play" size={14} /> Apresentar
            </Button>
          </Link>
          <Button size="sm" onClick={exportZip}>
            <Icon name="download" size={14} /> Exportar ZIP
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setToClose(true)}>
            <Icon name="x" size={14} />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-border px-4 flex items-center gap-1 bg-bg-elev/30">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-accent text-fg' : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </nav>

      {/* Split */}
      <div className="flex-1 grid grid-cols-[380px_1fr] overflow-hidden">
        {/* Editor panel */}
        <aside className="border-r border-border overflow-y-auto p-5 bg-bg-elev/20">
          {tab === 'content' && currentPage && (
            <ContentTab schema={schema} pageIdx={selectedPageIdx} onChange={updateSchema} />
          )}
          {tab === 'sections' && currentPage && (
            <SectionsTab schema={schema} pageIdx={selectedPageIdx} onChange={updateSchema} />
          )}
          {tab === 'theme' && (
            <ThemeTab schema={schema} onChange={updateSchema} />
          )}
          {tab === 'seo' && currentPage && (
            <SeoTab schema={schema} pageIdx={selectedPageIdx} onChange={updateSchema} />
          )}
          {tab === 'ai' && (
            <AITab schema={schema} onApply={(s: any) => { setSchema(s); autosave(s); setPreviewKey((k) => k + 1); }} />
          )}
        </aside>

        {/* Preview */}
        <div className="flex flex-col overflow-hidden">
          {generating && (
            <GenerationPanel steps={genSteps} onClose={() => setGenerating(false)} />
          )}
          {!generating && (
            <div className="flex-1 grid grid-rows-[auto_1fr] bg-bg-elev/40">
              <div className="border-b border-border px-4 py-2 flex items-center justify-between bg-bg-elev/60">
                <div className="flex items-center gap-3">
                  <select
                    value={selectedPageIdx}
                    onChange={(e) => setSelectedPageIdx(Number(e.target.value))}
                    className="bg-bg border border-border rounded px-2 py-1 text-xs text-fg"
                  >
                    {schema.pages?.map((p: any, i: number) => (
                      <option key={p.slug} value={i}>/{p.slug}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewKey((k) => k + 1)} className="btn-ghost text-xs flex items-center gap-1.5" title="Atualizar preview">
                    <Icon name="eye" size={12} /> Atualizar
                  </button>
                  <a href={`/api/preview/${projectId}`} target="_blank" className="btn-ghost text-xs">Abrir em nova aba ↗</a>
                </div>
              </div>
              <iframe
                key={`${previewKey}-${selectedPageIdx}`}
                ref={iframeRef}
                src={`/api/preview/${projectId}?v=${previewKey}&pageIdx=${selectedPageIdx}&ts=${previewKey}`}
                className="w-full h-full bg-white"
                title="Preview do site"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={toClose}
        title="Salvar e voltar?"
        message="Suas alterações serão salvas e você voltará ao dashboard."
        confirmLabel="Salvar e voltar"
        onConfirm={saveAndExit}
        onCancel={() => setToClose(false)}
      />
    </div>
  );
}

/* ── TAB: Conteúdo ───────────────────────────────────────────── */
function ContentTab({ schema, pageIdx, onChange }: any) {
  const page = schema.pages?.[pageIdx] || { slug: '/', title: '', description: '' };
  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-fg">Identidade</h3>
      <Input label="Nome do site" value={schema.site?.name || ''} onChange={(e) => onChange((s: any) => { s.site.name = e.target.value; })} />
      <Textarea label="Descrição" value={schema.site?.description || schema.site?.slogan || ''} onChange={(e) => onChange((s: any) => { s.site.description = e.target.value; })} rows={2} />

      <h3 className="font-semibold text-fg pt-2">Página: /{page.slug}</h3>
      <Input label="Título (H1)" value={page.title || ''} onChange={(e) => onChange((s: any) => { s.pages[pageIdx].title = e.target.value; })} />
      <Textarea label="Meta descrição" value={page.description || ''} onChange={(e) => onChange((s: any) => { s.pages[pageIdx].description = e.target.value; })} rows={2} />

      <h3 className="font-semibold text-fg pt-2">Contato</h3>
      <Input label="WhatsApp" value={schema.settings?.whatsapp || ''} onChange={(e) => onChange((s: any) => { s.settings.whatsapp = e.target.value.replace(/\D/g, ''); })} hint="Formato: 5511999999999" />
      <Input label="Telefone" value={schema.settings?.phone || ''} onChange={(e) => onChange((s: any) => { s.settings.phone = e.target.value; })} />
      <Input label="Email" value={schema.settings?.email || ''} onChange={(e) => onChange((s: any) => { s.settings.email = e.target.value; })} />
      <Input label="Endereço" value={schema.settings?.address || ''} onChange={(e) => onChange((s: any) => { s.settings.address = e.target.value; })} />
    </div>
  );
}

/* ── TAB: Seções ─────────────────────────────────────────────── */
function SectionsTab({ schema, pageIdx, onChange }: any) {
  const page = schema.pages[pageIdx];
  const sections = page.sections || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function move(idx: number, dir: -1 | 1) {
    onChange((s: any) => {
      const arr = s.pages[pageIdx].sections;
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
    });
  }
  function remove(idx: number) {
    onChange((s: any) => { s.pages[pageIdx].sections.splice(idx, 1); });
    setOpenIdx(null);
  }
  function add(kind: string) {
    onChange((s: any) => {
      const newIdx = s.pages[pageIdx].sections.length;
      s.pages[pageIdx].sections.push({
        component: kind,
        variant: 'default',
        content: defaultContent(kind),
      });
      setOpenIdx(newIdx);
    });
  }
  function setContent(idx: number, key: string, value: any) {
    onChange((s: any) => { s.pages[pageIdx].sections[idx].content[key] = value; });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-fg mb-1">Seções de /{page.slug}</h3>
        <p className="text-xs text-fg-muted mb-3">{sections.length} seções · clique para editar conteúdo</p>
        <div className="space-y-2">
          {sections.map((sec: any, i: number) => (
            <Card key={i} className="!p-3" hover={false}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="flex-1 min-w-0 text-left flex items-center gap-2"
                >
                  <span className="text-fg-dim text-xs">{openIdx === i ? '▼' : '▶'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-fg">{sec.component}</div>
                    <div className="text-[11px] text-fg-dim truncate">
                      {Object.keys(sec.content || {}).slice(0, 3).join(' · ')}
                    </div>
                  </div>
                </button>
                <button onClick={() => move(i, -1)} className="btn-ghost p-1 text-xs" title="Mover para cima">↑</button>
                <button onClick={() => move(i, 1)} className="btn-ghost p-1 text-xs" title="Mover para baixo">↓</button>
                <button onClick={() => remove(i)} className="btn-ghost p-1 text-xs hover:text-danger" title="Remover">×</button>
              </div>
              {openIdx === i && (
                <div className="mt-3 pt-3 border-t border-border space-y-3 animate-fadeIn">
                  <SectionEditor section={sec} onChange={(k, v) => setContent(i, k, v)} />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-fg mb-3">Adicionar seção</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Hero', 'HeroSimple', 'Services', 'About', 'Differentials', 'Stats', 'Testimonials', 'Team', 'FAQ', 'Contact', 'CTA', 'Gallery', 'Products', 'Cases', 'BlogList'].map((k) => (
            <button key={k} onClick={() => add(k)} className="btn-secondary text-xs py-2">
              + {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Editor inline de uma seção — gera campos baseado no schema do content */
function SectionEditor({ section, onChange }: { section: any; onChange: (key: string, value: any) => void }) {
  const c = section.content || {};
  const items = c.items as Array<Record<string, any>> | undefined;

  function updateItem(idx: number, key: string, value: any) {
    const next = [...(items || [])];
    next[idx] = { ...next[idx], [key]: value };
    onChange('items', next);
  }

  function addItem() {
    const next = [...(items || []), { name: 'Novo item', desc: '' }];
    onChange('items', next);
  }

  function removeItem(idx: number) {
    const next = [...(items || [])];
    next.splice(idx, 1);
    onChange('items', next);
  }

  const scalarKeys = Object.keys(c).filter((k) => k !== 'items' && typeof c[k] !== 'object');

  return (
    <>
      {scalarKeys.map((k) => (
        c[k] && String(c[k]).length > 60 ? (
          <Textarea
            key={k}
            label={k}
            value={c[k] || ''}
            onChange={(e) => onChange(k, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            key={k}
            label={k}
            value={c[k] || ''}
            onChange={(e) => onChange(k, e.target.value)}
          />
        )
      ))}
      {items && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="block text-xs font-medium text-fg-muted">items ({items.length})</span>
            <Button size="sm" variant="secondary" onClick={addItem}>
              <Icon name="plus" size={12} /> Item
            </Button>
          </div>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="p-2.5 bg-bg-elev2 rounded-lg border border-border space-y-2">
                <Input
                  label={idx === 0 ? 'Nome' : undefined}
                  placeholder="Nome"
                  value={it.name || ''}
                  onChange={(e) => updateItem(idx, 'name', e.target.value)}
                />
                <Textarea
                  placeholder="Descrição"
                  rows={2}
                  value={it.desc || it.text || it.title || ''}
                  onChange={(e) => updateItem(idx, it.desc !== undefined ? 'desc' : it.text !== undefined ? 'text' : 'title', e.target.value)}
                />
                <div className="flex justify-end">
                  <button onClick={() => removeItem(idx)} className="text-xs text-danger hover:underline">remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function defaultContent(kind: string): any {
  const map: Record<string, any> = {
    Hero: { title: 'Título principal', subtitle: 'Subtítulo explicativo', ctaLabel: 'Fale conosco', ctaHref: '#contato' },
    HeroSimple: { title: 'Página' },
    Services: { title: 'Nossos serviços', items: [{ name: 'Serviço 1', desc: 'Descrição', icon: '✦' }] },
    About: { title: 'Sobre nós', text: 'Conte a história do negócio.' },
    Differentials: { items: [{ name: 'Diferencial 1', desc: 'Descrição' }] },
    Stats: { items: [{ value: '10+', label: 'anos no mercado' }] },
    Testimonials: { title: 'Depoimentos', items: [{ name: 'Cliente', text: '...' }] },
    Team: { title: 'Equipe', items: [{ name: 'Nome', role: 'Cargo' }] },
    FAQ: { title: 'Perguntas frequentes', items: [{ q: 'Pergunta?', a: 'Resposta.' }] },
    Contact: { title: 'Contato' },
    CTA: { title: 'Pronto para começar?', ctaLabel: 'Fale conosco' },
    Gallery: { items: [{ src: '', alt: '' }] },
    Products: { title: 'Produtos', items: [{ name: 'Produto', price: 'R$ 0' }] },
    Cases: { title: 'Cases', items: [{ title: 'Projeto', desc: '...' }] },
    BlogList: { title: 'Blog', items: [{ title: 'Post', excerpt: '...' }] },
  };
  return map[kind] || {};
}

/* ── TAB: Tema ───────────────────────────────────────────────── */
function ThemeTab({ schema, onChange }: any) {
  const theme = schema.theme || { colors: {}, fonts: { heading: 'Inter', body: 'Inter' } };
  const colors = theme.colors || {};
  const fonts = theme.fonts || { heading: 'Inter', body: 'Inter' };
  const isDark = theme.style === 'dark-premium';
  function setColor(k: string, v: string) {
    onChange((s: any) => {
      if (!s.theme) s.theme = { colors: {}, fonts: { heading: 'Inter', body: 'Inter' } };
      if (!s.theme.colors) s.theme.colors = {};
      s.theme.colors[k] = v;
    });
  }
  function setFont(k: string, v: string) {
    onChange((s: any) => {
      if (!s.theme) s.theme = { colors: {}, fonts: { heading: 'Inter', body: 'Inter' } };
      if (!s.theme.fonts) s.theme.fonts = { heading: 'Inter', body: 'Inter' };
      s.theme.fonts[k] = v;
    });
  }
  function setMode(mode: 'light' | 'dark') {
    onChange((s: any) => {
      if (!s.theme) s.theme = { colors: {}, fonts: { heading: 'Inter', body: 'Inter' } };
      if (!s.theme.colors) s.theme.colors = {};
      s.theme.style = mode === 'dark' ? 'dark-premium' : 'moderno';
      // Sobrescreve SEMPRE as cores de fundo/texto/borda ao trocar de modo —
      // antes usávamos "||" que preservava a paleta existente, então clicar
      // em Escuro num site Claro não mudava nada visualmente.
      if (mode === 'dark') {
        s.theme.colors.background = '#0f172a';
        s.theme.colors.text = '#f5fafd';
        s.theme.colors.textMuted = 'rgba(245,250,253,0.7)';
        s.theme.colors.border = 'rgba(255,255,255,0.12)';
        s.theme.colors.surface = '#111118';
      } else {
        s.theme.colors.background = '#ffffff';
        s.theme.colors.text = '#0f172a';
        s.theme.colors.textMuted = '#64748b';
        s.theme.colors.border = '#e5e7eb';
        s.theme.colors.surface = '#f8fafc';
      }
    });
  }
  return (
    <div className="space-y-5">
      {/* Toggle Claro / Escuro */}
      <div>
        <h3 className="font-semibold text-fg mb-2">Modo do site</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('light')}
            className={`px-3 py-3 rounded-lg border text-sm font-medium transition ${!isDark ? 'border-accent bg-accent/10 text-fg' : 'border-border bg-bg-elev text-fg-muted hover:text-fg'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">☀️</span>
              <span>Claro</span>
            </div>
            <div className="mt-1 flex h-3 rounded overflow-hidden">
              <div className="flex-1 bg-white border-r border-border"></div>
              <div className="flex-1 bg-slate-200"></div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`px-3 py-3 rounded-lg border text-sm font-medium transition ${isDark ? 'border-accent bg-accent/10 text-fg' : 'border-border bg-bg-elev text-fg-muted hover:text-fg'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🌙</span>
              <span>Escuro</span>
            </div>
            <div className="mt-1 flex h-3 rounded overflow-hidden">
              <div className="flex-1 bg-slate-900 border-r border-border"></div>
              <div className="flex-1 bg-slate-700"></div>
            </div>
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-fg pt-2">Cores</h3>
      {[
        { k: 'primary', label: 'Primária' },
        { k: 'secondary', label: 'Secundária' },
        { k: 'accent', label: 'Accent' },
        { k: 'background', label: 'Fundo' },
        { k: 'surface', label: 'Superfície' },
        { k: 'text', label: 'Texto' },
      ].map((c) => (
        <div key={c.k}>
          <span className="block text-xs font-medium text-fg-muted mb-1.5">{c.label}</span>
          <div className="flex gap-2">
            <input type="color" value={colors[c.k] || '#000000'} onChange={(e) => setColor(c.k, e.target.value)} className="w-12 h-10 rounded border border-border cursor-pointer bg-transparent" />
            <input type="text" value={colors[c.k] || ''} onChange={(e) => setColor(c.k, e.target.value)} className="flex-1 bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm font-mono" />
          </div>
        </div>
      ))}
      <h3 className="font-semibold text-fg pt-2">Tipografia</h3>
      <Select label="Heading" value={fonts.heading || 'Inter'} onChange={(e) => setFont('heading', e.target.value)}>
        {['Inter', 'Playfair Display', 'DM Serif Display', 'Space Grotesk', 'IBM Plex Serif', 'Manrope'].map((f) => <option key={f} value={f}>{f}</option>)}
      </Select>
      <Select label="Body" value={fonts.body || 'Inter'} onChange={(e) => setFont('body', e.target.value)}>
        {['Inter', 'IBM Plex Sans', 'Manrope', 'Source Sans 3'].map((f) => <option key={f} value={f}>{f}</option>)}
      </Select>
    </div>
  );
}

/* ── TAB: SEO ────────────────────────────────────────────────── */
function SeoTab({ schema, pageIdx, onChange }: any) {
  const page = schema.pages[pageIdx];
  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-fg">SEO da página</h3>
      <Input label="Slug (URL)" value={page.slug || ''} onChange={(e) => onChange((s: any) => { s.pages[pageIdx].slug = e.target.value; })} />
      <Input label="Title tag" value={page.title || ''} onChange={(e) => onChange((s: any) => { s.pages[pageIdx].title = e.target.value; })} hint="Recomendado: 50-60 caracteres" />
      <Textarea label="Meta description" value={page.description || ''} onChange={(e) => onChange((s: any) => { s.pages[pageIdx].description = e.target.value; })} rows={2} hint="Recomendado: 140-160 caracteres" />

      <h3 className="font-semibold text-fg pt-4">SEO global</h3>
      <Input label="URL do site" value={schema.seo?.siteUrl || ''} onChange={(e) => onChange((s: any) => { s.seo = s.seo || {}; s.seo.siteUrl = e.target.value; })} />
      <Input label="Descrição padrão" value={schema.seo?.defaultDescription || ''} onChange={(e) => onChange((s: any) => { s.seo = s.seo || {}; s.seo.defaultDescription = e.target.value; })} />
      <Input label="OG image URL" value={schema.seo?.ogImage || ''} onChange={(e) => onChange((s: any) => { s.seo = s.seo || {}; s.seo.ogImage = e.target.value; })} />
    </div>
  );
}

/* ── TAB: IA ─────────────────────────────────────────────────── */
function AITab({ schema, onApply }: any) {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);

  async function send() {
    if (!command.trim()) return;
    const msg = command;
    setHistory((h) => [...h, { role: 'user', text: msg }]);
    setCommand('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSchema: schema, command: msg }),
      });
      const data = await res.json();
      if (data.ok && data.site) {
        onApply(data.site);
        setHistory((h) => [...h, { role: 'ai', text: '✓ Aplicado: ' + msg }]);
      } else {
        setHistory((h) => [...h, { role: 'ai', text: '✗ Falha: ' + (data.error || data.detail || 'desconhecido') }]);
      }
    } catch (e: any) {
      setHistory((h) => [...h, { role: 'ai', text: '✗ Erro: ' + (e?.message || '') }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-fg">Editor com IA</h3>
      <p className="text-xs text-fg-muted">Descreva o que deseja alterar. A IA retornará o site atualizado.</p>
      <Textarea value={command} onChange={(e) => setCommand(e.target.value)} placeholder='Ex: "Mude o slogan para algo mais moderno" ou "Adicione uma seção de FAQ"' rows={4} />
      <Button onClick={send} loading={loading} disabled={!command.trim()} className="w-full">
        <Icon name="sparkles" size={14} /> Aplicar com IA
      </Button>

      {history.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border">
          {history.map((h, i) => (
            <div key={i} className={`text-xs p-2.5 rounded-lg ${h.role === 'user' ? 'bg-accent/10 text-fg' : 'bg-bg-elev text-fg-muted'}`}>
              {h.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Painel de geração em tempo real ─────────────────────────── */
function GenerationPanel({ steps, onClose }: { steps: any[]; onClose: () => void }) {
  const allDone = steps.every((s) => s.status === 'done');
  return (
    <div className="flex-1 bg-bg-elev/40 flex items-center justify-center p-6">
      <Card hover={false} className="max-w-xl w-full">
        <h2 className="text-lg font-semibold text-fg mb-1">Gerando seu site</h2>
        <p className="text-sm text-fg-muted mb-5">Acompanhe cada etapa abaixo.</p>
        <ol className="space-y-2.5">
          {steps.map((s) => (
            <li key={s.id} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold ${
                s.status === 'done' ? 'bg-success text-white' :
                s.status === 'running' ? 'bg-accent text-white' :
                s.status === 'error' ? 'bg-danger text-white' :
                'bg-bg-elev2 text-fg-dim border border-border'
              }`}>
                {s.status === 'done' ? '✓' :
                 s.status === 'running' ? <Spinner size={12} /> :
                 s.status === 'error' ? '!' : '·'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-fg">{s.label}</div>
                {s.message && <div className="text-[11px] text-fg-muted mt-0.5">{s.message}</div>}
              </div>
            </li>
          ))}
        </ol>
        {allDone && (
          <div className="mt-5 flex gap-2">
            <Button onClick={onClose} className="flex-1">Ver preview</Button>
            <Link href="/projects" className="btn-secondary">Voltar ao dashboard</Link>
          </div>
        )}
      </Card>
    </div>
  );
}
