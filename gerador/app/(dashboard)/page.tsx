/**
 * Dashboard — landing do Gerador.
 * Saudação dinâmica + stats + projetos recentes + atalhos.
 */
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { Icon } from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default async function DashboardPage() {
  const greeting = getGreeting();
  const now = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stats = [
    { label: 'Projetos ativos', value: '0', delta: 'comece criando um', icon: 'folder', accent: 'from-accent to-accent-glow' },
    { label: 'Clientes', value: '0', delta: 'cadastre seu primeiro', icon: 'users', accent: 'from-blue-500 to-cyan-500' },
    { label: 'Sites gerados', value: '0', delta: 'prontos para exportar', icon: 'sparkles', accent: 'from-purple-500 to-pink-500' },
    { label: 'Modelos disponíveis', value: '30', delta: '4 categorias', icon: 'grid', accent: 'from-emerald-500 to-teal-500' },
  ];

  const quickActions = [
    { href: '/projects/new', label: 'Criar novo projeto', desc: 'Wizard guiado de 8 etapas', icon: 'plus', color: 'text-accent' },
    { href: '/models', label: 'Explorar modelos', desc: '30 templates com identidade própria', icon: 'grid', color: 'text-blue-400' },
    { href: '/projects', label: 'Ver projetos', desc: 'Continue de onde parou', icon: 'folder', color: 'text-emerald-400' },
    { href: '/clients', label: 'Gerenciar clientes', desc: 'Base de contatos', icon: 'users', color: 'text-amber-400' },
  ];

  return (
    <div className="px-8 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-xs uppercase tracking-wider text-fg-dim mb-1">{now}</p>
            <h1 className="text-3xl font-bold text-fg">{greeting}, Nicolas.</h1>
          </div>
          <Link href="/projects/new" className="btn-primary flex items-center gap-2">
            <Icon name="plus" size={16} /> Novo Projeto
          </Link>
        </div>
        <p className="text-fg-muted mt-2">
          Bem-vindo de volta. Continue criando sites profissionais para seus clientes.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.accent} opacity-90 flex items-center justify-center text-white`}>
                <Icon name={s.icon} size={18} />
              </div>
              <Badge variant="default">{s.delta}</Badge>
            </div>
            <div className="text-3xl font-bold text-fg mb-1">{s.value}</div>
            <div className="text-xs text-fg-muted">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-fg mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href} className="card-base p-4 hover:border-accent/40 transition-colors group">
              <div className={`mb-3 ${a.color}`}>
                <Icon name={a.icon} size={20} />
              </div>
              <div className="text-sm font-medium text-fg group-hover:text-accent transition-colors">{a.label}</div>
              <div className="text-xs text-fg-muted mt-1">{a.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pipeline preview */}
      <section>
        <h2 className="text-lg font-semibold text-fg mb-4">Como funciona</h2>
        <Card>
          <ol className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {[
              { n: 1, label: 'Briefing', desc: 'Cliente + segmento' },
              { n: 2, label: 'Modelo', desc: '30 templates' },
              { n: 3, label: 'Conteúdo', desc: 'IA gera estrutura' },
              { n: 4, label: 'Tema', desc: 'Cores + fontes' },
              { n: 5, label: 'Imagens', desc: 'Upload ou URL' },
              { n: 6, label: 'Gerar', desc: 'Pipeline real' },
              { n: 7, label: 'Exportar', desc: 'ZIP Next.js' },
            ].map((step) => (
              <li key={step.n} className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-semibold flex items-center justify-center">
                  {step.n}
                </div>
                <div className="text-xs font-medium text-fg">{step.label}</div>
                <div className="text-[10px] text-fg-dim mt-0.5">{step.desc}</div>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}
