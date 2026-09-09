import { redirect } from 'next/navigation';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    if (!isSupabaseConfigured()) {
      // Modo dev / produção sem Supabase configurado → vai pra LP pública
      redirect('/lp');
    }
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/lp');
    redirect('/admin/dashboard');
  } catch (err: any) {
    // Se redirect() falhar (raro), força LP como destino público
    console.error('HomePage error:', err);
    redirect('/lp');
  }
}
