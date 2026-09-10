/**
 * /admin/briefings — lista de briefings do owner.
 *
 * Mostra status (pending, paid, expired), valor, data e link pro projeto
 * (quando o briefing foi pago e gerou um project).
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type BriefingRow = {
  id: string;
  token: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  client_name: string | null;
  whatsapp: string | null;
  amount_cents: number | null;
  paid_at: string | null;
  created_at: string;
  project_id: string | null;
};

function formatBRL(cents: number | null): string {
  if (cents == null) return '—';
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status }: { status: BriefingRow['status'] }) {
  const map = {
    pending: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Aguardando' },
    paid: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'Pago' },
    expired: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', label: 'Expirado' },
    cancelled: { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Cancelado' },
  };
  const s = map[status] || map.pending;
  return <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>;
}

export default function BriefingsPage() {
  const [rows, setRows] = useState<BriefingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [devMode, setDevMode] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/briefings/list' : `/api/briefings/list?status=${filter}`;
      const res = await fetch(url);
      const j = await res.json();
      if (j.devMode) setDevMode(true);
      setRows(j.briefings || []);
    } catch {/* noop */} finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Briefings</h1>
          <p className="text-sm text-fg-muted mt-1">Links de briefing + pagamento que você criou para clientes</p>
        </div>
        <Link href="/admin/projects/new" className="btn-secondary text-sm">
          + Novo briefing
        </Link>
      </div>

      {devMode && (
        <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          DEV MODE: Supabase não configurado. Crie um briefing pelo wizard de novo projeto — o link aparece aqui, mas o pagamento é simulado.
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-4">
        {(['all', 'pending', 'paid'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-accent text-white'
                : 'bg-bg-elev text-fg-muted hover:bg-bg-elev2 border border-border'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'pending' ? 'Aguardando' : 'Pagos'}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="rounded-2xl border border-border bg-bg-elev/40 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-fg-muted">Carregando…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm text-fg-muted mb-4">
              {filter === 'all'
                ? 'Você ainda não criou nenhum briefing.'
                : filter === 'pending'
                ? 'Nenhum briefing aguardando pagamento.'
                : 'Nenhum briefing pago ainda.'}
            </p>
            <Link href="/admin/projects/new" className="text-violet-400 text-sm hover:underline">
              Criar primeiro briefing →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-bg-elev/80 border-b border-border">
              <tr className="text-left text-xs text-fg-muted uppercase tracking-wider">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criado</th>
                <th className="px-4 py-3">Pago em</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-bg-elev/60">
                  <td className="px-4 py-3 font-medium text-fg">{b.client_name || <span className="text-fg-muted italic">aguardando</span>}</td>
                  <td className="px-4 py-3 text-fg-muted">{b.whatsapp || '—'}</td>
                  <td className="px-4 py-3 text-fg-muted">{formatBRL(b.amount_cents)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-fg-muted text-xs">{formatDate(b.created_at)}</td>
                  <td className="px-4 py-3 text-fg-muted text-xs">{formatDate(b.paid_at)}</td>
                  <td className="px-4 py-3 text-right">
                    {b.project_id ? (
                      <Link
                        href={`/admin/projects/${b.project_id}/edit`}
                        className="text-violet-400 hover:underline text-xs"
                      >
                        Abrir projeto →
                      </Link>
                    ) : (
                      <a
                        href={`/checkout/${b.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-muted hover:text-fg text-xs"
                        title="Abrir o link público do briefing"
                      >
                        🔗 Link
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
