'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, Button, Spinner, ConfirmDialog, Input, EmptyState } from '@/components/ui';
import { Icon } from '@/components/dashboard/sidebar';
import { useToast } from '@/components/ui/toast';

interface Asset {
  id: string;
  name: string;
  url: string;
  size: number;
  mime: string;
  createdAt: string;
}

const SAMPLE_UNSPLASH = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
];

export default function MediaPage() {
  const toast = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<Asset | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (e: any) {
      toast.error('Erro ao carregar biblioteca', e?.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    let ok = 0;
    let fail = 0;
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      try {
        const res = await fetch('/api/assets/upload', { method: 'POST', body: form });
        if (res.ok) {
          ok++;
        } else {
          fail++;
          const data = await res.json().catch(() => ({}));
          toast.error(`Falha: ${file.name}`, data.error);
        }
      } catch (e: any) {
        fail++;
        toast.error(`Erro: ${file.name}`, e?.message);
      }
    }
    setUploading(false);
    if (ok > 0) toast.success(`${ok} arquivo(s) enviado(s)`, fail > 0 ? `${fail} falharam` : undefined);
    await load();
  }

  async function addByUrl() {
    if (!urlInput.trim()) return;
    try {
      // Tenta validar que é uma URL acessível
      new URL(urlInput);
    } catch {
      toast.error('URL inválida');
      return;
    }
    // Em dev mode, registra como asset local
    const newAsset: Asset = {
      id: 'url-' + Date.now(),
      name: urlInput.split('/').pop() || 'imagem',
      url: urlInput,
      size: 0,
      mime: 'image/*',
      createdAt: new Date().toISOString(),
    };
    setAssets((cur) => [newAsset, ...cur]);
    setUrlInput('');
    toast.success('Imagem adicionada');
  }

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      const res = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: toDelete.name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error('Falha ao deletar', data.error);
        return;
      }
      setAssets((cur) => cur.filter((a) => a.id !== toDelete.id));
      toast.success('Imagem removida');
    } finally {
      setToDelete(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  const filtered = assets.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-8 py-8 max-w-7xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-fg mb-1">Biblioteca de Mídia</h1>
        <p className="text-fg-muted">Imagens reutilizáveis entre projetos. Faça upload ou adicione por URL.</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Grid principal */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Input
              type="text"
              placeholder="Buscar imagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <span className="text-xs text-fg-dim ml-auto">{filtered.length} {filtered.length === 1 ? 'imagem' : 'imagens'}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size={28} /></div>
          ) : filtered.length === 0 ? (
            <Card hover={false}>
              <EmptyState
                icon={<Icon name="image" size={48} />}
                title="Nenhuma imagem ainda"
                description="Faça upload de arquivos ou cole URLs para começar."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((a) => (
                <AssetCard
                  key={a.id}
                  asset={a}
                  onCopy={() => copyUrl(a.url)}
                  onDelete={() => setToDelete(a)}
                />
              ))}
            </div>
          )}

          {/* Sample gallery */}
          {!loading && filtered.length === 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-fg mb-3">Sugestões Unsplash (clique para usar)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_UNSPLASH.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      toast.success('URL copiada', 'Cole no campo "Adicionar por URL" para salvar.');
                    }}
                    className="aspect-square rounded-lg overflow-hidden border border-border hover:border-accent transition-colors"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar de upload */}
        <aside className="space-y-4">
          <Card hover={false}>
            <h3 className="font-semibold text-fg mb-3">Upload</h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-border-strong'
              }`}
            >
              <div className="text-fg-muted">
                {uploading ? <Spinner size={24} /> : <Icon name="plus" size={28} />}
              </div>
              <div className="text-sm font-medium text-fg mt-2">
                {uploading ? 'Enviando...' : 'Arraste imagens aqui'}
              </div>
              <div className="text-xs text-fg-muted mt-1">
                ou clique para selecionar · PNG, JPG, WebP, SVG · máx 8MB
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              />
            </div>
          </Card>

          <Card hover={false}>
            <h3 className="font-semibold text-fg mb-3">Adicionar por URL</h3>
            <Input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => e.key === 'Enter' && addByUrl()}
            />
            <Button onClick={addByUrl} disabled={!urlInput.trim()} size="sm" className="w-full mt-2">
              <Icon name="plus" size={14} /> Adicionar
            </Button>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Remover imagem?"
        message={`Tem certeza que deseja remover "${toDelete?.name}"?`}
        confirmLabel="Remover"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function AssetCard({ asset, onCopy, onDelete }: { asset: Asset; onCopy: () => void; onDelete: () => void }) {
  return (
    <div className="group relative card-base overflow-hidden !p-0">
      <div className="aspect-square bg-bg-elev2">
        <img
          src={asset.url}
          alt={asset.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
        <button
          onClick={onCopy}
          className="bg-bg-elev/90 hover:bg-bg-elev text-fg text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1"
          title="Copiar URL"
        >
          <Icon name="duplicate" size={12} /> URL
        </button>
        <button
          onClick={onDelete}
          className="bg-danger/90 hover:bg-danger text-white text-xs px-2.5 py-1.5 rounded-md"
          title="Remover"
        >
          <Icon name="trash" size={12} />
        </button>
      </div>
      <div className="px-2 py-1.5 text-[10px] text-fg-dim truncate border-t border-border" title={asset.name}>
        {asset.name}
      </div>
    </div>
  );
}
