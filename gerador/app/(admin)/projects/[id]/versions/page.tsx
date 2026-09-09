'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, Spinner, Button, EmptyState, Badge } from '@/components/ui';
import { Icon } from '@/components/dashboard/sidebar';
import { useToast } from '@/components/ui/toast';

interface Version {
  id: string;
  label: string;
  created_at: string;
}

export default function VersionsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const projectId = params.id;
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`);
      const data = await res.json();
      setVersions(data.versions || []);
    } finally {
      setLoading(false);
    }
  }

  async function createCheckpoint() {
    const label = window.prompt('Nome da versão:', 'checkpoint ' + new Date().toLocaleString('pt-BR'));
    if (label === null) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label || undefined }),
      });
      if (!res.ok) {
        toast.error('Falha ao criar versão');
        return;
      }
      toast.success('Versão criada');
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function restore(versionId: string) {
    if (!confirm('Restaurar esta versão? O conteúdo atual será salvo como nova versão antes da restauração.')) return;
    const res = await fetch(`/api/projects/${projectId}/versions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionId }),
    });
    if (res.ok) {
      toast.success('Versão restaurada');
      router.push(`/projects/${projectId}/edit`);
    } else {
      toast.error('Falha ao restaurar');
    }
  }

  return (
    <div className="px-8 py-8 max-w-3xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link href={`/projects/${projectId}/edit`} className="text-xs text-fg-muted hover:text-fg flex items-center gap-1 mb-2">
            <Icon name="arrow-left" size={12} /> Voltar ao editor
          </Link>
          <h1 className="text-3xl font-bold text-fg mb-1">Versões</h1>
          <p className="text-fg-muted">Histórico do projeto. Crie checkpoints e restaure quando precisar.</p>
        </div>
        <Button onClick={createCheckpoint} loading={creating}>
          <Icon name="plus" size={14} /> Checkpoint
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : versions.length === 0 ? (
        <Card hover={false}>
          <EmptyState
            icon={<Icon name="history" size={48} />}
            title="Nenhuma versão registrada"
            description="O autosave atualiza a versão atual a cada 1s. Crie checkpoints manuais para salvar marcos importantes."
            action={
              <Button onClick={createCheckpoint} loading={creating}>
                <Icon name="plus" size={14} /> Criar primeiro checkpoint
              </Button>
            }
          />
        </Card>
      ) : (
        <ol className="space-y-2 relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
          {versions.map((v, idx) => (
            <li key={v.id}>
              <Card className="!p-4 flex items-center gap-3 ml-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  idx === 0 ? 'bg-accent border-accent text-white' : 'bg-bg-elev border-border text-fg-muted'
                }`}>
                  {idx === 0 ? '★' : '✓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-fg truncate">{v.label}</div>
                    {idx === 0 && <Badge variant="accent">atual</Badge>}
                  </div>
                  <div className="text-xs text-fg-muted mt-0.5">
                    {new Date(v.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-2">
                  {idx > 0 && (
                    <Button variant="secondary" size="sm" onClick={() => restore(v.id)}>
                      <Icon name="history" size={14} /> Restaurar
                    </Button>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
