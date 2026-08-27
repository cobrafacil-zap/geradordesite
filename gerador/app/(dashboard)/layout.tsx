/**
 * Layout do dashboard (Sistema A).
 * Verifica auth via Supabase, redireciona para /login se preciso.
 */
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = isSupabaseConfigured();
  let userName: string | undefined;
  let userEmail: string | undefined;

  if (supabaseConfigured) {
    try {
      const supabase = createServerSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) redirect('/login');
      userName = (user.user_metadata?.full_name as string) || user.email?.split('@')[0];
      userEmail = user.email;
    } catch {
      userName = 'Nicolas';
      userEmail = 'dev@local';
    }
  } else {
    userName = 'Nicolas';
    userEmail = 'dev@local';
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
