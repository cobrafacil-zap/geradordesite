/**
 * Layout do dashboard (Sistema A).
 * Verifica auth via Supabase, redireciona para /login se preciso.
 * Tolerante a falhas: cai em modo dev se Supabase indisponível.
 */
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = isSupabaseConfigured();
  let userName = 'Nicolas';
  let userEmail = 'dev@local';
  let mustLogin = false;

  if (supabaseConfigured) {
    try {
      const supabase = createServerSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        mustLogin = true;
      } else {
        userName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User';
        userEmail = user.email || 'dev@local';
      }
    } catch (err) {
      // Supabase configurado mas falhou (rede, key errada, etc) — cai em dev mode
      console.error('Supabase auth falhou, usando dev mode:', err);
    }
  }

  if (mustLogin) redirect('/login');

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
