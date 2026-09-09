/**
 * Layout do painel admin (Sistema A).
 * Verifica auth via Supabase. Se não houver sessão válida E Supabase
 * estiver configurado, retorna 404 (notFound()) em vez de redirecionar pra
 * /login — isso evita "denunciar" que existe um painel em /admin.
 *
 * Em dev (Supabase não configurado) → libera direto com userName=userEmail
 * mockados, pra não atrapalhar o desenvolvimento.
 */
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = isSupabaseConfigured();
  let userName = 'Nicolas';
  let userEmail = 'dev@local';
  let authed = false;

  if (supabaseConfigured) {
    try {
      const supabase = createServerSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        authed = true;
        userName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User';
        userEmail = user.email || 'dev@local';
      }
    } catch (err) {
      // Supabase configurado mas falhou (rede, key errada, etc) — cai em dev mode
      console.error('Supabase auth falhou, usando dev mode:', err);
    }
  } else {
    // Sem Supabase configurado → modo dev: deixa entrar
    authed = true;
  }

  if (!authed) {
    // Visitante anônimo bateu em /admin sem saber o caminho.
    // 404 em vez de redirect — não revela que o painel existe.
    notFound();
  }

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
