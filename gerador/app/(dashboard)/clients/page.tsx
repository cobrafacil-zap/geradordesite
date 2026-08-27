'use client';

import { Card, EmptyState, Button } from '@/components/ui';
import { Icon } from '@/components/dashboard/sidebar';
import Link from 'next/link';

export default function ClientsPage() {
  return (
    <div className="px-8 py-8 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-fg mb-1">Clientes</h1>
        <p className="text-fg-muted">Base de clientes. Cada projeto pertence a um cliente.</p>
      </header>
      <Card hover={false}>
        <EmptyState
          icon={<Icon name="users" size={48} />}
          title="Em breve"
          description="A gestão de clientes será integrada ao criar projetos. Por enquanto, o nome do cliente é capturado no wizard."
          action={
            <Link href="/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Icon name="plus" size={16} /> Novo Projeto
            </Link>
          }
        />
      </Card>
    </div>
  );
}
