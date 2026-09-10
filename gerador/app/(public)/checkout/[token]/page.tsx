/**
 * /checkout/[token] — página pública de briefing + pagamento.
 *
 * Sem auth. O cliente preenche 8 perguntas + faz upload de logo/fotos +
 * clica em "Pagar R$ 0,90" → redireciona pro Checkout Pro do Mercado Pago.
 *
 * Após o pagamento, o MP dispara webhook que cria o project no admin.
 *
 * Server component: busca o briefing inicial (status: pending) e passa
 * pro BriefingForm (client). Se já foi pago, mostra ThankYou.
 */
import { notFound } from 'next/navigation';
import { createAdminSupabase, isSupabaseAdminConfigured } from '@/lib/supabase';
import { BriefingForm } from './_components/BriefingForm';
import { ThankYou } from './_components/ThankYou';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Briefing + Pagamento — Social Marketing BR' };

type Briefing = {
  id: string;
  token: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  client_name: string | null;
  description: string | null;
  services: string | null;
  whatsapp: string | null;
  instagram: string | null;
  colors: string | null;
  reference_url: string | null;
  extra_info: string | null;
  logo_url: string | null;
  photos: string[];
  paid_at: string | null;
  project_id: string | null;
};

export default async function CheckoutPage({ params, searchParams }: { params: { token: string }; searchParams: { status?: string } }) {
  const { token } = params;
  const returnStatus = searchParams.status; // 'approved' | 'rejected' | 'pending' | 'simulated'

  let briefing: Briefing | null = null;
  let devMode = !isSupabaseAdminConfigured();

  if (devMode) {
    briefing = {
      id: `dev-${token}`,
      token,
      status: 'pending',
      client_name: null, description: null, services: null,
      whatsapp: null, instagram: null, colors: null,
      reference_url: null, extra_info: null,
      logo_url: null, photos: [],
      paid_at: null, project_id: null,
    };
  } else {
    const supabase = createAdminSupabase();
    const { data } = await supabase
      .from('briefings')
      .select('id, token, status, client_name, description, services, whatsapp, instagram, colors, reference_url, extra_info, logo_url, photos, paid_at, project_id')
      .eq('token', token)
      .maybeSingle();
    if (!data) notFound();
    briefing = data as Briefing;
  }

  // Se veio do MP com status=approved e ainda não tá marcado como paid → mostra ThankYou
  if (returnStatus === 'approved' || returnStatus === 'simulated' || briefing.status === 'paid') {
    return <ThankYou token={token} paidAt={briefing.paid_at} projectId={briefing.project_id} devMode={devMode} />;
  }

  if (briefing.status === 'expired' || briefing.status === 'cancelled') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold mb-2">Link expirado</h1>
          <p className="text-slate-400 mb-6">Esse link de briefing não está mais disponível. Fale com a gente no WhatsApp pra receber um novo.</p>
          <a
            href="https://wa.me/5543996820296?text=Ol%C3%A1%2C%20meu%20link%20de%20briefing%20expirou%2C%20pode%20me%20mandar%20outro%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors"
          >
            💬 Falar no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return <BriefingForm token={token} initial={briefing} devMode={devMode} />;
}
