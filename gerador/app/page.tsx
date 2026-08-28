import { redirect } from 'next/navigation';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    if (!isSupabaseConfigured()) {
      // Modo dev / produção sem Supabase configurado → mostra setup status
      redirect('/setup');
    }
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/login');
    redirect('/dashboard');
  } catch (err: any) {
    // Se redirect() falhar (raro), força dashboard como destino
    console.error('HomePage error:', err);
    redirect('/projects');
  }
}
