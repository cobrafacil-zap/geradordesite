'use client';

import { Card, Input, Button, Badge } from '@/components/ui';
import { Icon } from '@/components/dashboard/sidebar';

export default function SettingsPage() {
  const env = typeof window !== 'undefined' ? window.location.origin : '';
  return (
    <div className="px-8 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-fg mb-1">Configurações</h1>
        <p className="text-fg-muted">Preferências do Gerador.</p>
      </header>

      <div className="space-y-4">
        <Card hover={false}>
          <h3 className="font-semibold text-fg mb-4 flex items-center gap-2">
            <Icon name="cog" size={16} /> Conta
          </h3>
          <div className="space-y-3">
            <Input label="Nome" defaultValue="Nicolas" />
            <Input label="Email" defaultValue="dev@local" disabled />
          </div>
        </Card>

        <Card hover={false}>
          <h3 className="font-semibold text-fg mb-4">Integrações</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-bg-elev2 rounded-lg">
              <div>
                <div className="text-sm font-medium text-fg">Supabase</div>
                <div className="text-xs text-fg-muted">Backend do Gerador</div>
              </div>
              <Badge variant="warning">Verificar .env</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-bg-elev2 rounded-lg">
              <div>
                <div className="text-sm font-medium text-fg">OpenAI</div>
                <div className="text-xs text-fg-muted">Geração de estrutura com IA</div>
              </div>
              <Badge variant="warning">Verificar .env</Badge>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <h3 className="font-semibold text-fg mb-4">Banco padrão dos sites gerados</h3>
          <div className="flex gap-2">
            <label className="flex-1 p-3 border border-border rounded-lg cursor-pointer hover:border-accent">
              <input type="radio" name="db" defaultChecked className="mr-2" />
              <span className="text-sm font-medium text-fg">SQLite (recomendado)</span>
              <p className="text-xs text-fg-muted mt-1">Zero infra externa. Funciona em qualquer hospedagem Node.</p>
            </label>
            <label className="flex-1 p-3 border border-border rounded-lg cursor-pointer hover:border-accent">
              <input type="radio" name="db" className="mr-2" />
              <span className="text-sm font-medium text-fg">Postgres</span>
              <p className="text-xs text-fg-muted mt-1">Para Vercel ou produção de alta escala.</p>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
