import { redirect } from 'next/navigation';
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase';

export default async function HomePage() {
  // Em dev (sem Supabase), leva direto ao dashboard
  if (!isSupabaseConfigured()) {
    redirect('/projects');
  }
  try {
    const supabase = createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/login');
  } catch {
    redirect('/login');
  }
}
