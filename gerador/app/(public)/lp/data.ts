/**
 * Modelos exibidos na LP pública /lp.
 *
 * Mix proposital entre grupos (institucional, serviços, comércio, landing-pages)
 * pra mostrar variedade visual na vitrine. O visitante precisa ver que
 * "tem um monte de modelo diferente", não 5 LP's iguais.
 *
 * Cada `whatsappMessage` vira o `?text=` pré-preenchido do CTA.
 * `previewHeadline` aparece no preview do card ANTES do iframe carregar —
 * gradiente distinto, ícone grande, headline simulada. Cria expectativa
 * de "site de verdade" sem precisar de screenshot.
 */
export type PublicModel = {
  slug: string;
  name: string;
  tag: string;
  emoji: string;
  color: string;
  /** Headline simulada no preview do card (estilo da vitrine). */
  previewHeadline: string;
  whatsappMessage: string;
};

/**
 * IMPORTANT: slugs aqui PRECISAM existir em lib/generator/templates/content/group-*.ts,
 * senão o iframe de preview retorna HTML do pack fallback e fica genérico.
 * Conferidos em group-1..6 (slugs reais): empresa-corporativa, empresa-moderna,
 * empresa-premium, industria, construtora, empresa-local, escritorio-advocacia,
 * clinica-medica, assistencia-tecnica, agencia-marketing, limpeza, imobiliaria,
 * loja, restaurante, pet-shop, lp-* (5 do group-7).
 */
export const PUBLIC_MODELS: PublicModel[] = [
  // ── Kinds distintos pra visual bem diferente entre os 10 ──
  // Sortidos: cada um cai em um 'kind' diferente do buildHomeSections()
  // (corporate, premium, saas, lawyer, clinic, restaurant, realestate, shop, landing).
  {
    slug: 'empresa-corporativa',
    name: 'Empresa Corporativa',
    tag: 'Institucional · B2B',
    emoji: '🏢',
    color: '#1e3a8a',
    previewHeadline: 'Soluções que\nescalam seu negócio',
    whatsappMessage: 'Olá! Quero um site no modelo "Empresa Corporativa" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'empresa-premium',
    name: 'Empresa Premium',
    tag: 'Boutique · Luxo',
    emoji: '💎',
    color: '#1f1f1f',
    previewHeadline: 'Excelência em\ncada detalhe',
    whatsappMessage: 'Olá! Quero um site no modelo "Empresa Premium" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'empresa-moderna',
    name: 'Empresa Moderna',
    tag: 'Startups · Tech',
    emoji: '🚀',
    color: '#0ea5e9',
    previewHeadline: 'Inovação que\nmove o mercado',
    whatsappMessage: 'Olá! Quero um site no modelo "Empresa Moderna" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'escritorio-advocacia',
    name: 'Advocacia',
    tag: 'Escritório · Jurídico',
    emoji: '⚖️',
    color: '#581c87',
    previewHeadline: 'Defendemos seus\ndireitos com ética',
    whatsappMessage: 'Olá! Quero um site no modelo "Advocacia" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'clinica-medica',
    name: 'Clínica Médica',
    tag: 'Saúde · Consultas',
    emoji: '⚕️',
    color: '#0891b2',
    previewHeadline: 'Cuidando da sua\nsaúde com excelência',
    whatsappMessage: 'Olá! Quero um site no modelo "Clínica Médica" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'restaurante',
    name: 'Restaurante',
    tag: 'Cardápio · Delivery',
    emoji: '🍽️',
    color: '#dc2626',
    previewHeadline: 'O melhor sabor\nda cidade',
    whatsappMessage: 'Olá! Quero um site no modelo "Restaurante" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'imobiliaria',
    name: 'Imobiliária',
    tag: 'Venda · Aluguel',
    emoji: '🏘️',
    color: '#0d9488',
    previewHeadline: 'Seu novo lar\nestá aqui',
    whatsappMessage: 'Olá! Quero um site no modelo "Imobiliária" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'loja',
    name: 'Loja',
    tag: 'E-commerce · Catálogo',
    emoji: '🛍️',
    color: '#f97316',
    previewHeadline: 'Compre com\npraticidade',
    whatsappMessage: 'Olá! Quero um site no modelo "Loja" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'agencia-marketing',
    name: 'Agência de Marketing',
    tag: 'Marketing · Publicidade',
    emoji: '📊',
    color: '#db2777',
    previewHeadline: 'Resultados que\nviralizam',
    whatsappMessage: 'Olá! Quero um site no modelo "Agência de Marketing" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
  {
    slug: 'lp-produto-unico',
    name: 'Produto Único',
    tag: 'Venda direta · Preço',
    emoji: '🎯',
    color: '#7c2d12',
    previewHeadline: 'Compre agora\nem 12x sem juros',
    whatsappMessage: 'Olá! Quero um site no modelo "Produto Único" (R$ 197, pronto em 48h). Pode me passar mais detalhes?',
  },
];

/** Total de modelos disponíveis (não só os exibidos na vitrine). */
export const TOTAL_MODELS = 30;

/** Mensagem pré-preenchida para "Quero ver todos os modelos". */
export const MSG_VER_TODOS = 'Olá! Vi os modelos no site da Social Marketing BR e quero ver a lista completa de modelos disponíveis.';
