/**
 * Modelos exibidos na LP pública /lp.
 * Espelha `app/(admin)/models/page.tsx` (categoria landing-pages) — sem a categoria.
 * Cada `whatsappMessage` vira o `?text=` pré-preenchido do CTA "Quero esse modelo".
 */
export type PublicModel = {
  slug: string;
  name: string;
  tag: string;
  emoji: string;
  color: string;
  /** Mensagem pré-preenchida para o WhatsApp quando o visitante clica no card. */
  whatsappMessage: string;
};

export const PUBLIC_MODELS: PublicModel[] = [
  {
    slug: 'lp-lead-magnet',
    name: 'Captura de Lead',
    tag: 'Para e-books, webinars, materiais ricos',
    emoji: '📩',
    color: '#7c3aed',
    whatsappMessage: 'Olá! Quero um site no modelo "Captura de Lead" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'lp-produto-unico',
    name: 'Produto Único',
    tag: 'Para vender 1 produto ou serviço com preço',
    emoji: '🎯',
    color: '#f97316',
    whatsappMessage: 'Olá! Quero um site no modelo "Produto Único" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'lp-waitlist',
    name: 'Lista de Espera',
    tag: 'Para lançamento de produto/serviço',
    emoji: '🚀',
    color: '#fb923c',
    whatsappMessage: 'Olá! Quero um site no modelo "Lista de Espera" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'lp-agendamento',
    name: 'Agendamento',
    tag: 'Para clínicas, consultórios, serviços',
    emoji: '📅',
    color: '#16a34a',
    whatsappMessage: 'Olá! Quero um site no modelo "Agendamento" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'lp-evento',
    name: 'Evento',
    tag: 'Para conferência, workshop, meetup',
    emoji: '🎪',
    color: '#a855f7',
    whatsappMessage: 'Olá! Quero um site no modelo "Evento" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
];
