'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';

type Briefing = {
  id: string;
  token: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  client_name: string | null;
  description: string | null;
  services: string | null;
  whatsapp: string | null;
  instagram: string | null;
  colors: string | null;
  reference_url: string | null;
  extra_info: string | null;
  logo_url: string | null;
  photos: string[];
  paid_at: string | null;
  project_id: string | null;
};

const QUESTIONS = [
  { key: 'client_name', label: '1. Nome da empresa', placeholder: 'Ex: Pizzaria do Zé', required: true, type: 'text' as const },
  { key: 'description', label: '2. O que sua empresa faz?', placeholder: 'Conta em 1-2 frases o que vocês vendem ou oferecem.', required: true, type: 'textarea' as const },
  { key: 'services', label: '3. Quais serviços/produtos deseja destacar?', placeholder: 'Lista os principais. Ex: pizza margherita, pizza calabresa, refrigerante…', required: true, type: 'textarea' as const },
  { key: 'whatsapp', label: '4. WhatsApp (com DDD)', placeholder: '43 99682-0296', required: true, type: 'text' as const, inputMode: 'tel' as const },
  { key: 'instagram', label: '5. Instagram (opcional)', placeholder: '@suaempresa', type: 'text' as const },
  { key: 'colors', label: '6. Quais cores deseja no site?', placeholder: 'Ex: vermelho e branco. Ou: cores da logo (#ff0000).', required: true, type: 'text' as const },
  { key: 'reference_url', label: '7. Tem algum site como referência? (opcional)', placeholder: 'https://exemplo.com.br', type: 'text' as const },
  { key: 'extra_info', label: '8. Alguma informação importante que precisa aparecer no site?', placeholder: 'Horário, endereço, diferenciais, formas de pagamento…', type: 'textarea' as const },
];

export function BriefingForm({ token, initial, devMode }: { token: string; initial: Briefing; devMode: boolean }) {
  const [data, setData] = useState<Record<string, string>>({
    client_name: initial.client_name || '',
    description: initial.description || '',
    services: initial.services || '',
    whatsapp: initial.whatsapp || '',
    instagram: initial.instagram || '',
    colors: initial.colors || '',
    reference_url: initial.reference_url || '',
    extra_info: initial.extra_info || '',
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logo_url);
  const [photos, setPhotos] = useState<string[]>(initial.photos || []);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function update(key: string, val: string) {
    setData((prev) => ({ ...prev, [key]: val }));
  }

  async function saveDraft() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/briefings/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, logo_url: logoUrl, photos }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Falha ao salvar');
      toast.success('Rascunho salvo');
    } catch (e: any) {
      setError(e.message);
      toast.error('Falha ao salvar', e.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(file: File, field: 'logo' | 'photos') {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('field', field);
    const res = await fetch(`/api/briefings/${token}/upload`, { method: 'POST', body: fd });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || 'Falha no upload');
    return j.url as string;
  }

  async function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadFile(f, 'logo');
      setLogoUrl(url);
      toast.success('Logomarca enviada');
    } catch (err: any) {
      toast.error('Falha no upload', err.message);
    }
  }

  async function onPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > 10) {
      toast.error('Máx 10 fotos');
      return;
    }
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, 'photos')));
      setPhotos((prev) => [...prev, ...urls]);
      toast.success(`${files.length} foto(s) enviada(s)`);
    } catch (err: any) {
      toast.error('Falha no upload', err.message);
    }
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handlePay() {
    setError(null);
    // Valida campos obrigatórios
    for (const q of QUESTIONS) {
      if (q.required && !data[q.key]?.trim()) {
        setError(`Preencha: ${q.label}`);
        return;
      }
    }
    setPaying(true);
    try {
      // Salva briefing antes de pagar (pra garantir que temos tudo)
      await fetch(`/api/briefings/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, logo_url: logoUrl, photos }),
      });

      // Pede preference do MP
      const res = await fetch(`/api/briefings/${token}/pay`, { method: 'POST' });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || j.message || 'Falha ao iniciar pagamento');
      if (j.initPoint) {
        window.location.href = j.initPoint;
      } else {
        throw new Error('Resposta sem initPoint');
      }
    } catch (e: any) {
      setError(e.message);
      toast.error('Não foi possível iniciar o pagamento', e.message);
      setPaying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">S</div>
          <div>
            <div className="text-sm font-semibold">Social Marketing <span className="text-violet-400">BR</span></div>
            <div className="text-[10px] text-slate-500">Briefing para criação do seu site</div>
          </div>
          {devMode && (
            <span className="ml-auto text-[10px] px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">DEV MODE</span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Vamos criar o seu site 🚀</h1>
          <p className="text-slate-400 text-sm md:text-base">
            Responda as 8 perguntas abaixo. Em até 48h após o pagamento, seu site fica pronto.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); handlePay(); }}
          className="space-y-6"
        >
          {QUESTIONS.map((q) => (
            <div key={q.key}>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">
                {q.label}
                {q.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {q.type === 'textarea' ? (
                <textarea
                  value={data[q.key] || ''}
                  onChange={(e) => update(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full bg-slate-900/70 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors resize-y"
                />
              ) : (
                <input
                  type={q.type}
                  inputMode={q.inputMode as any}
                  value={data[q.key] || ''}
                  onChange={(e) => update(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full bg-slate-900/70 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors"
                />
              )}
            </div>
          ))}

          {/* Upload de logomarca */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">📎 Logomarca (opcional)</label>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                  <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-800/50 border border-dashed border-slate-700 flex items-center justify-center text-2xl text-slate-500">🖼️</div>
              )}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-medium cursor-pointer transition-colors">
                {logoUrl ? 'Trocar' : 'Enviar logo'}
                <input type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Upload de fotos */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">📸 Fotos do seu negócio (opcional, até 10)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
              {photos.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700 group">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 hover:bg-red-500 text-white text-xs flex items-center justify-center"
                    title="Remover"
                  >×</button>
                </div>
              ))}
              {photos.length < 10 && (
                <label className="aspect-square rounded-lg bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-violet-500 cursor-pointer flex flex-col items-center justify-center text-slate-500 hover:text-violet-400 transition-colors">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px] mt-1">Foto</span>
                  <input type="file" accept="image/*" multiple onChange={onPhotosChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={saveDraft}
              disabled={saving || paying}
              className="text-sm text-slate-400 hover:text-slate-200 underline disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar rascunho'}
            </button>
            <button
              type="submit"
              disabled={paying}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-base font-semibold transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paying ? 'Redirecionando…' : '💬 Pagar e enviar briefing'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Você será redirecionado pro Mercado Pago. Pagamento processado de forma segura.
            <br />
            Após o pagamento, seu site fica pronto em até 48h.
          </p>
        </form>
      </main>
    </div>
  );
}
