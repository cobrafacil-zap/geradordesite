'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, EmptyState, Spinner, ConfirmDialog } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@/components/dashboard/sidebar';

interface ProjectRow {
  id: string;
  name: string;
  template_id: string | null;
  status: string;
  updated_at: string;
  created_at: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const toast = useToast();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ProjectRow | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }

  async function duplicate(id: string) {
    const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      toast.success('Projeto duplicado');
      router.push(`/projects/${data.project.id}/edit`);
    } else {
      toast.error('Falha ao duplicar');
    }
  }

  async function remove() {
    if (!toDelete) return;
    setDeleting(toDelete.id);
    const res = await fetch(`/api/projects/${toDelete.id}`, { method: 'DELETE' });
    if (res.ok) {
      setProjects((p) => p.filter((x) => x.id !== toDelete.id));
      toast.success('Projeto excluído');
    } else {
      toast.error('Falha ao excluir');
    }
    setDeleting(null);
    setToDelete(null);
  }

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="px-8 py-8 max-w-7xl">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg mb-1">Projetos</h1>
          <p className="text-fg-muted">Crie, edite e exporte sites profissionais.</p>
        </div>
        <Link href="/projects/new" className="btn-primary flex items-center gap-2">
          <Icon name="plus" size={16} /> Novo Projeto
        </Link>
      </header>

      {/* Search */}
      {projects.length > 0 && (
        <div className="mb-6 relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-dim">
            <Icon name="search" size={16} />
          </span>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar projeto..."
            className="w-full bg-bg-elev border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        projects.length === 0 ? (
          <Card hover={false}>
            <EmptyState
              icon={<Icon name="folder" size={48} />}
              title="Nenhum projeto ainda"
              description="Crie seu primeiro site profissional em minutos usando nossos 30 templates."
              action={
                <Link href="/projects/new" className="btn-primary inline-flex items-center gap-2">
                  <Icon name="plus" size={16} /> Criar primeiro projeto
                </Link>
              }
            />
          </Card>
        ) : (
          <Card hover={false}>
            <EmptyState
              title="Nenhum projeto encontrado"
              description={`Nenhum resultado para "${filter}".`}
            />
          </Card>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-fg truncate">{p.name}</h3>
                  <p className="text-xs text-fg-muted mt-0.5">
                    Atualizado {new Date(p.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant={p.status === 'ready' ? 'success' : 'warning'}>
                  {p.status === 'ready' ? 'Pronto' : 'Rascunho'}
                </Badge>
              </div>
              <div className="text-xs text-fg-dim mb-4 line-clamp-2">
                {p.template_id ? `Modelo: ${p.template_id}` : 'Sem modelo base'}
              </div>
              <div className="flex gap-2">
                <Link href={`/projects/${p.id}/edit`} className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs py-2">
                  <Icon name="edit" size={14} /> Editar
                </Link>
                <Link href={`/projects/${p.id}/present`} className="btn-secondary flex items-center justify-center text-xs py-2 px-2.5" title="Apresentar">
                  <Icon name="play" size={14} />
                </Link>
                <button
                  onClick={() => duplicate(p.id)}
                  className="btn-secondary flex items-center justify-center text-xs py-2 px-2.5"
                  title="Duplicar"
                >
                  <Icon name="duplicate" size={14} />
                </button>
                <button
                  onClick={() => setToDelete(p)}
                  className="btn-secondary flex items-center justify-center text-xs py-2 px-2.5 hover:border-danger/40 hover:text-danger"
                  title="Excluir"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir projeto?"
        message={`Tem certeza que deseja excluir "${toDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel={deleting ? 'Excluindo...' : 'Excluir'}
        danger
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
