/**
 * Layouts de seções por tipo de negócio.
 *
 * Cada "kind" tem 2-3 VARIAÇÕES (a, b, c) escolhidas deterministicamente
 * pelo slug. Cada variação tem:
 *  - estilo de hero distinto (split / fullbleed / centered / dark-premium /
 *    magazine / card-informativo)
 *  - ordem de seções diferente
 *  - seções únicas do segmento (Chef, Brands, Process, Schedule, etc.)
 *
 * Isso garante que 30 templates não pareçam iguais nem mesmo dentro do
 * mesmo segmento.
 */
import type { ContentPack } from './content/registry';

type AnySection = Record<string, any>;

// ─────────────────────────────────────────────────────────────
// Helpers de seção
// ─────────────────────────────────────────────────────────────

const header = (pack: ContentPack): AnySection => ({
  component: 'Header',
  variant: 'sticky-dark',
  content: { whatsapp: pack.whatsapp },
});

const footer = (): AnySection => ({
  component: 'Footer',
  variant: 'simple',
  content: { floatingWa: true },
});

const heroSplit = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'A',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image, imageAlt: pack.hero.imageAlt },
});

const heroFullbleed = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'B',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image, imageAlt: pack.hero.imageAlt },
});

const heroCentered = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'C',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

const heroDarkPremium = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'D',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

const heroMagazine = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'C',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

const heroAlert = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'G',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

// Hero H — badge gigante + imagem em moldura circular (uso amplo).
const heroBadge = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'H',
  content: {
    badge: pack.hero.eyebrow,
    title: pack.hero.title,
    subtitle: pack.hero.subtitle,
    cta: pack.hero.ctaLabel,
    ctaSecondary: '',
    image: pack.hero.image,
  },
});

// Hero I — split assimétrico 60/40, imagem colada na borda direita.
const heroAsymmetric = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'I',
  content: {
    eyebrow: pack.hero.eyebrow,
    title: pack.hero.title,
    subtitle: pack.hero.subtitle,
    ctaLabel: pack.hero.ctaLabel,
    ctaHref: pack.hero.ctaHref,
    image: pack.hero.image,
  },
});

// Hero E — service grid (ícones + texto sem imagem).
const heroServiceGrid = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'E',
  content: {
    eyebrow: pack.hero.eyebrow,
    title: pack.hero.title,
    subtitle: pack.hero.subtitle,
    ctaLabel: pack.hero.ctaLabel,
    ctaHref: pack.hero.ctaHref,
  },
});

// Hero F — vitrine de cards.
const heroVitrine = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'F',
  content: {
    eyebrow: pack.hero.eyebrow,
    title: pack.hero.title,
    subtitle: pack.hero.subtitle,
    ctaLabel: pack.hero.ctaLabel,
    ctaHref: pack.hero.ctaHref,
    cards: (pack.services || []).slice(0, 3).map((s) => ({ title: s.name, desc: s.desc })),
  },
});

// Hero J — sticky-form: copy à esquerda + formulário de captura à direita.
// Usado pelas landing pages de conversão (lp-*).
const heroStickyForm = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'J',
  content: {
    eyebrow: pack.hero.eyebrow,
    title: pack.hero.title,
    subtitle: pack.hero.subtitle,
    ctaLabel: pack.hero.ctaLabel,
    ctaHref: pack.hero.ctaHref,
    formTitle: 'Garanta sua vaga',
    formPlaceholder: 'seu@email.com',
    formButton: pack.hero.ctaLabel,
    privacyNote: 'Sem spam. Cancele quando quiser.',
    stats: pack.stats || [],
  },
});

const about = (pack: ContentPack, title = 'Sobre nós'): AnySection => ({
  component: 'About', variant: 'simple',
  content: { title, text: pack.aboutText },
});

const services = (pack: ContentPack, title = 'Serviços'): AnySection => ({
  component: 'Services', variant: 'grid',
  content: { title, items: pack.services },
});

const differentials = (pack: ContentPack, title = 'Por que nos escolher'): AnySection => ({
  component: 'Differentials', variant: 'default',
  content: { title, items: pack.differentials },
});

const stats = (pack: ContentPack, title = 'Nossos números'): AnySection => ({
  component: 'Stats', variant: 'default',
  content: { title, items: pack.stats },
});

const testimonials = (pack: ContentPack, title = 'Depoimentos'): AnySection => ({
  component: 'Testimonials', variant: 'default',
  content: { title, items: pack.testimonials },
});

const faq = (pack: ContentPack, title = 'Perguntas frequentes'): AnySection => ({
  component: 'FAQ', variant: 'default',
  content: { title, items: pack.faq },
});

const cta = (pack: ContentPack): AnySection => ({
  component: 'CTA', variant: 'centered',
  content: { title: pack.ctaTitle, ctaLabel: pack.ctaLabel, ctaHref: '#contato' },
});

const contact = (pack: ContentPack): AnySection => ({
  component: 'Contact', variant: 'simple',
  content: { title: 'Fale conosco', whatsapp: pack.whatsapp, email: pack.email, address: pack.address },
});

const menu = (pack: ContentPack, title = 'Cardápio'): AnySection => {
  if (pack.menuCategories && pack.menuCategories.length) {
    return { component: 'MenuFull', variant: 'categorized', content: { title, categories: pack.menuCategories } };
  }
  return { component: 'MenuPreview', variant: 'simple', content: { title, items: pack.menu || [] } };
};

const reservation = (pack: ContentPack, title = 'Reserve sua mesa'): AnySection => ({
  component: 'Reservation', variant: 'simple',
  content: { title, ctaLabel: pack.ctaLabel },
});

const properties = (pack: ContentPack, title = 'Imóveis em destaque'): AnySection => ({
  component: 'Properties', variant: 'grid',
  content: { title, items: pack.products || [] },
});

const products = (pack: ContentPack, title = 'Em destaque'): AnySection => ({
  component: 'Products', variant: 'grid',
  content: { title, items: pack.products || [] },
});

const gallery = (pack: ContentPack, title = 'Galeria'): AnySection => ({
  component: 'Gallery', variant: 'grid',
  content: { title, items: pack.gallery || [] },
});

const cases = (pack: ContentPack, title = 'Cases'): AnySection => {
  const items = (pack as any).cases || [];
  return { component: 'Cases', variant: 'default', content: { title, items } };
};

const team = (pack: ContentPack, title = 'Time'): AnySection => ({
  component: 'Team', variant: 'default',
  content: { title, items: pack.team || [] },
});

// Seções únicas por segmento — REMOVIDAS. Como o renderer só conhece os
// componentes listados em `lib/generator/render/registry.ts` (About, CTA,
// Catalog, Footer, Header, Hero, HeroSimple, Services, Specialties,
// Differentials, Team, Testimonials, FAQ, Contact, Map, History, Stats,
// Gallery, Products, Cases, Properties, MenuPreview, MenuFull, Reservation,
// Legal), qualquer component "fantasma" vira `null` no render e fica
// um espaço em branco invisível. Por isso abaixo os helpers antes
// "únicos" são reescritos como `Services` com `items` apropriado, mantendo
// o conteúdo semântico que faz sentido pro segmento.

const chef = (pack: ContentPack, title = 'Quem cozinha'): AnySection => ({
  component: 'Team', variant: 'default',
  content: { title, items: pack.team || [] },
});

const brands = (pack: ContentPack, title = 'Trabalhamos com'): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title, items: [
    { icon: '🏢', name: 'Toyota' },
    { icon: '🏭', name: 'Bosch' },
    { icon: '⚙️', name: 'Siemens' },
    { icon: '⛏️', name: 'Vale' },
    { icon: '🛢️', name: 'Petrobras' },
    { icon: '✈️', name: 'Embraer' },
    { icon: '🏦', name: 'Itaú' },
    { icon: '💄', name: 'Natura' },
  ] },
});

const conventions = (pack: ContentPack, title = 'Convênios atendidos'): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title, items: [
    { icon: '🏥', name: 'SulAmérica' },
    { icon: '🏥', name: 'Amil' },
    { icon: '🏥', name: 'Bradesco Saúde' },
    { icon: '🏥', name: 'Unimed' },
    { icon: '🏥', name: 'Hapvida' },
    { icon: '🏥', name: 'NotreDame' },
  ] },
});

const schedule = (pack: ContentPack): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title: 'Horários de atendimento', items: [
    { icon: '📅', name: 'Segunda', desc: 'Fechado' },
    { icon: '📅', name: 'Ter–Sex', desc: '12h–15h · 19h–23h' },
    { icon: '📅', name: 'Sábado', desc: '12h–00h' },
    { icon: '📅', name: 'Domingo', desc: '12h–22h' },
  ] },
});

const instruments = (pack: ContentPack, title = 'Equipamentos'): AnySection => ({
  component: 'Services', variant: 'grid',
  content: { title, items: [
    { icon: '📷', name: 'Sony A7R V', desc: 'Full-frame' },
    { icon: '📷', name: 'Canon R5', desc: 'Híbrido' },
    { icon: '🚁', name: 'DJI Mavic 3 Pro', desc: 'Drone' },
    { icon: '💡', name: 'Aputure 600D', desc: 'Iluminação' },
    { icon: '🎚️', name: 'Gimbal RS3', desc: 'Estabilizador' },
    { icon: '⚡', name: 'Godox AD400', desc: 'Flash' },
    { icon: '🔍', name: 'Sigma Art 35mm', desc: 'Lente' },
    { icon: '💻', name: 'MacBook Pro M3', desc: 'Edição' },
  ] },
});

const method = (pack: ContentPack, title = 'Nosso método'): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title, items: [
    { icon: '1️⃣', name: 'Diagnóstico', desc: 'Entendemos seu cenário em uma conversa de 60 minutos.' },
    { icon: '2️⃣', name: 'Plano', desc: 'Documentamos escopo, prazos e investimento em contrato.' },
    { icon: '3️⃣', name: 'Execução', desc: 'Sprints quinzenais com reuniões de alinhamento.' },
    { icon: '4️⃣', name: 'Entrega', desc: 'Homologação, treinamento e suporte continuado.' },
  ] },
});

const processAdv = (pack: ContentPack, title = 'Como atuamos'): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title, items: [
    { icon: '⚖️', name: 'Consulta inicial', desc: 'Análise gratuita do caso, sem compromisso.' },
    { icon: '📋', name: 'Estratégia', desc: 'Plano jurídico com prazos, riscos e chances de êxito.' },
    { icon: '📑', name: 'Protocolo', desc: 'Petições, audiências e sustentações orais.' },
    { icon: '🏛️', name: 'Resultado', desc: 'Acompanhamento até trânsito em julgado.' },
  ] },
});

const press = (pack: ContentPack, title = 'Quem falou de nós'): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title, items: [
    { icon: '📰', name: 'Valor Econômico' },
    { icon: '📰', name: 'Folha de S.Paulo' },
    { icon: '📰', name: 'Época' },
    { icon: '📰', name: 'Exame' },
    { icon: '📰', name: 'IstoÉ' },
    { icon: '📰', name: 'Veja' },
  ] },
});

const logos = (pack: ContentPack, title = 'Quem confia na gente'): AnySection => ({
  component: 'Services', variant: 'list',
  content: { title, items: [
    { icon: '🛒', name: 'Magazine Luiza' },
    { icon: '💳', name: 'Stone' },
    { icon: '🏦', name: 'Nubank' },
    { icon: '🍔', name: 'iFood' },
    { icon: '🍺', name: 'Ambev' },
    { icon: '💄', name: 'Natura' },
  ] },
});

const marquee = (pack: ContentPack): AnySection => ({
  component: 'Stats', variant: 'inline',
  content: { title: '', items: [
    { value: '★ 4.9', label: 'no Google' },
    { value: '18 anos', label: 'no mercado' },
    { value: '22', label: 'profissionais' },
    { value: '8.000', label: 'clientes atendidos' },
    { value: '1h', label: 'resposta' },
  ] },
});

const highlights = (pack: ContentPack): AnySection => ({
  component: 'Differentials', variant: 'highlight',
  content: { title: 'Por que somos diferentes', subtitle: 'Não é só marketing — são compromissos verificáveis', items: pack.differentials.map((d, i) => ({
    name: d.name,
    desc: d.desc,
    icon: ['✓', '★', '◆', '●', '▲', '■'][i % 6],
  })) },
});

const map = (pack: ContentPack): AnySection => ({
  component: 'Map', variant: 'simple',
  content: { title: 'Onde estamos', address: pack.address },
});

// ─────────────────────────────────────────────────────────────
// Seed/hash determinístico a partir do slug
// ─────────────────────────────────────────────────────────────

function seedOf(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Escolhe variação 0/1/2 a partir do slug. */
function pickVariation(slug: string, total = 3): number {
  return seedOf(slug) % total;
}

/**
 * Escolhe a variante do hero (A–J) a partir do slug.
 * Mapeia 10 visuais distintos:
 *  A = split clássico,  B = bg image,     C = magazine,
 *  D = dark premium,   E = service grid,  F = vitrine de cards,
 *  G = gallery,        H = badge+circular, I = 60/40 assimétrico,
 *  J = sticky-form (LP)
 */
function pickHeroVariant(slug: string): 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J' {
  const variants: Array<'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'> = ['A','B','C','D','E','F','G','H','I','J'];
  return variants[seedOf(slug) % variants.length];
}

// ─────────────────────────────────────────────────────────────
// LAYOUTS — cada segmento tem 3 variações
// ─────────────────────────────────────────────────────────────

export function buildHomeSections(pack: ContentPack): AnySection[] {
  // Primeiro: layout dedicado por slug (cada modelo realmente único).
  const custom = uniqueLayoutForSlug(pack.slug, pack);
  if (custom) return custom;

  const kind = pickKind(pack.slug);
  const v = pickVariation(pack.slug);

  switch (kind) {
    // ═════════════════════════════════════════════════════════
    // RESTAURANTE (restaurante, pizzaria, padaria)
    // ═════════════════════════════════════════════════════════
    case 'restaurant': {
      if (v === 0) {
        return [
          header(pack),
          heroFullbleed(pack),   // imagem cobrindo tudo
          menu(pack, 'Nosso cardápio'),
          about(pack, 'A casa'),
          chef(pack, 'Quem cozinha'),
          reservation(pack, 'Reserve sua mesa'),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack)] : []),
          contact(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroCentered(pack),    // título centralizado em fundo claro
          marquee(pack),
          menu(pack, 'Cardápio completo'),
          about(pack, 'Quem somos'),
          schedule(pack),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
          reservation(pack, 'Reserve sua mesa'),
          contact(pack),
          footer(),
        ];
      }
      // v === 2: pizzaria/alta gastronomia — hero escuro premium
      return [
        header(pack),
        heroDarkPremium(pack),
        menu(pack, 'Menu degustação'),
        chef(pack, 'Chef e cozinha'),
        about(pack, 'A casa'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        reservation(pack, 'Reserve sua mesa'),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        press(pack),
        contact(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // IMOBILIÁRIA (imobiliaria, construtora)
    // ═════════════════════════════════════════════════════════
    case 'realestate': {
      if (v === 0) {
        return [
          header(pack),
          heroMagazine(pack),     // imagem esquerda, texto direita
          properties(pack, 'Imóveis em destaque'),
          differentials(pack, 'Por que nos escolher'),
          about(pack, 'Quem somos'),
          map(pack),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack, 'Dúvidas frequentes')] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroSplit(pack),
          properties(pack, 'Lançamentos'),
          method(pack, 'Como comprar'),
          about(pack, 'Nossa história'),
          ...(pack.stats ? [stats(pack, 'Em números')] : []),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
          map(pack),
          cta(pack),
          footer(),
        ];
      }
      // v === 2: construtora
      return [
        header(pack),
        heroFullbleed(pack),
        properties(pack, 'Empreendimentos'),
        brands(pack),
        about(pack, 'Quem somos'),
        ...(pack.stats ? [stats(pack)] : []),
        processAdv(pack, 'Como construir com a gente'),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // INDÚSTRIA
    // ═════════════════════════════════════════════════════════
    case 'industry': {
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          stats(pack, 'Capacidade técnica'),
          brands(pack, 'Clientes que atendemos'),
          services(pack, 'O que fabricamos'),
          about(pack, 'Quem somos'),
          differentials(pack, 'Nossos diferenciais'),
          press(pack),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroDarkPremium(pack),
          stats(pack, 'Capacidade e certificações'),
          services(pack, 'Capabilidades'),
          method(pack, 'Nosso processo produtivo'),
          about(pack, 'Quem somos'),
          brands(pack),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroMagazine(pack),
        services(pack, 'O que fabricamos'),
        stats(pack),
        differentials(pack, 'Por que nos escolher'),
        about(pack, 'Quem somos'),
        processAdv(pack, 'Como é um projeto conosco'),
        brands(pack),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // CLÍNICA / ODONTO / ESTÉTICA
    // ═════════════════════════════════════════════════════════
    case 'clinic': {
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          services(pack, 'Nossas especialidades'),
          conventions(pack),
          ...(pack.team ? [team(pack, 'Corpo clínico')] : []),
          about(pack, 'Sobre a clínica'),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroCentered(pack),
          services(pack, 'Especialidades'),
          ...(pack.stats ? [stats(pack, 'Em números')] : []),
          schedule(pack),
          conventions(pack),
          about(pack, 'Sobre nós'),
          ...(pack.team ? [team(pack, 'Time')] : []),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem pacientes')] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroMagazine(pack),
        services(pack, 'Especialidades'),
        ...(pack.team ? [team(pack, 'Corpo clínico')] : []),
        conventions(pack),
        about(pack, 'Sobre a clínica'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        method(pack, 'Como funciona uma consulta'),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // EMERGENCIAIS 24h (eletricista, encanador, mecânica)
    // ═════════════════════════════════════════════════════════
    case 'emergency': {
      if (v === 0) {
        return [
          header(pack),
          heroAlert(pack),        // card branco sobre fundo accent
          marquee(pack),
          differentials(pack, 'Por que nos chamar'),
          services(pack, 'O que resolvemos'),
          ...(pack.stats ? [stats(pack, 'Em números')] : []),
          about(pack, 'Sobre nós'),
          ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroSplit(pack),
          differentials(pack, 'Compromissos reais'),
          services(pack, 'O que fazemos'),
          schedule(pack),
          about(pack, 'Quem somos'),
          ...(pack.stats ? [stats(pack, 'Em números')] : []),
          brands(pack, 'Atendemos'),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroFullbleed(pack),
        services(pack, 'O que resolvemos'),
        highlights(pack),
        about(pack, 'Sobre nós'),
        processAdv(pack, 'Como funciona o atendimento'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.faq ? [faq(pack)] : []),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // SOFTWARE / AGÊNCIA / STARTUP
    // ═════════════════════════════════════════════════════════
    case 'saas': {
      if (v === 0) {
        return [
          header(pack),
          heroCentered(pack),    // SaaS/branding forte no centro
          stats(pack, 'Em números'),
          services(pack, 'O que entregamos'),
          cases(pack, 'Cases recentes'),
          logos(pack),
          about(pack, 'Sobre nós'),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroSplit(pack),
          services(pack, 'Nossas soluções'),
          ...(pack.stats ? [stats(pack, 'Em números')] : []),
          method(pack, 'Como entregamos'),
          cases(pack, 'Cases'),
          brands(pack, 'Confiam na gente'),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroDarkPremium(pack),
        services(pack, 'O que entregamos'),
        stats(pack),
        cases(pack, 'Cases recentes'),
        logos(pack),
        about(pack, 'Quem somos'),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // ADVOCACIA
    // ═════════════════════════════════════════════════════════
    case 'lawyer': {
      if (v === 0) {
        return [
          header(pack),
          heroDarkPremium(pack),
          services(pack, 'Áreas de atuação'),
          ...(pack.stats ? [stats(pack)] : []),
          about(pack, 'Sobre o escritório'),
          processAdv(pack, 'Como atuamos'),
          ...(pack.testimonials ? [testimonials(pack, 'Casos publicados')] : []),
          differentials(pack, 'Por que nos contratar'),
          ...(pack.faq ? [faq(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroSplit(pack),
          services(pack, 'Áreas de atuação'),
          press(pack),
          about(pack, 'Sobre o escritório'),
          ...(pack.team ? [team(pack, 'Advogados')] : []),
          ...(pack.stats ? [stats(pack)] : []),
          processAdv(pack),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroMagazine(pack),
        services(pack, 'Onde atuamos'),
        about(pack, 'Sobre o escritório'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack, 'Casos publicados')] : []),
        press(pack),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // FOTÓGRAFO
    // ═════════════════════════════════════════════════════════
    case 'photographer': {
      if (v === 0) {
        return [
          header(pack),
          heroFullbleed(pack),
          gallery(pack, 'Trabalhos recentes'),
          instruments(pack),
          services(pack, 'O que faço'),
          about(pack, 'Sobre mim'),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroMagazine(pack),
          gallery(pack, 'Portfolio'),
          services(pack, 'Coberturas'),
          about(pack, 'Sobre mim'),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
          press(pack, 'Onde meu trabalho apareceu'),
          cta(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroDarkPremium(pack),
        gallery(pack, 'Trabalhos recentes'),
        services(pack, 'O que faço'),
        instruments(pack),
        about(pack, 'Sobre mim'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // PET SHOP
    // ═════════════════════════════════════════════════════════
    case 'pet': {
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          services(pack, 'Cuidado completo'),
          ...(pack.stats ? [stats(pack)] : []),
          about(pack, 'Sobre nós'),
          differentials(pack, 'Por que escolher a gente'),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack)] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroCentered(pack),
          services(pack, 'O que oferecemos'),
          schedule(pack),
          about(pack, 'Quem somos'),
          differentials(pack),
          ...(pack.testimonials ? [testimonials(pack, 'Tutores contam')] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroMagazine(pack),
        services(pack, 'Cuidado completo'),
        about(pack, 'Quem somos'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        differentials(pack),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // ACADEMIA
    // ═════════════════════════════════════════════════════════
    case 'gym': {
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          services(pack, 'Modalidades'),
          differentials(pack, 'Por que treinar aqui'),
          ...(pack.stats ? [stats(pack, 'Em números')] : []),
          about(pack, 'Sobre nós'),
          schedule(pack),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem alunos')] : []),
          ...(pack.faq ? [faq(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroFullbleed(pack),
          services(pack, 'Modalidades'),
          stats(pack),
          about(pack, 'Sobre nós'),
          schedule(pack),
          differentials(pack),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroDarkPremium(pack),
        services(pack, 'Modalidades'),
          schedule(pack),
          about(pack, 'Quem somos'),
          differentials(pack, 'Por que treinar aqui'),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // CONSULTOR / CONTADOR / CORRETOR
    // ═════════════════════════════════════════════════════════
    case 'consultant': {
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          services(pack, 'Como posso ajudar'),
          about(pack, 'Sobre mim'),
          differentials(pack, 'Por que me contratar'),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
          ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
          cta(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroCentered(pack),
          method(pack, 'Como trabalho'),
          services(pack, 'Áreas'),
          about(pack, 'Sobre mim'),
          ...(pack.stats ? [stats(pack)] : []),
          brands(pack, 'Atendo'),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      return [
        header(pack),
          heroMagazine(pack),
          services(pack, 'Onde atendo'),
          about(pack, 'Quem sou'),
          method(pack, 'Como trabalho'),
          differentials(pack),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          contact(pack),
          footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // LOJA / DECORAÇÃO / LIMPEZA
    // ═════════════════════════════════════════════════════════
    case 'shop': {
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          products(pack, 'Em destaque'),
          about(pack, 'Sobre a loja'),
          services(pack, 'Categorias'),
          differentials(pack, 'Por que comprar com a gente'),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroCentered(pack),
          products(pack, 'Coleção'),
          about(pack, 'Quem somos'),
          differentials(pack),
          brands(pack, 'Marcas que carregamos'),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroMagazine(pack),
        products(pack, 'Em destaque'),
        about(pack, 'Sobre a loja'),
        services(pack, 'Categorias'),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // LANDING PAGES DE CONVERSÃO (lp-*)
    // Layout FIXO (não sorteado): header → sticky-form hero →
    // benefícios → prova social → FAQ → CTA final → footer mínimo.
    // ─────────────────────────────────────────────────────────
    case 'landing':
      return [
        header(pack),
        heroStickyForm(pack),
        services(pack, 'Por que funciona'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        ...(pack.testimonials ? [testimonials(pack, 'Quem já usa')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        footer(),
      ];

    // ═════════════════════════════════════════════════════════
    // CORPORATIVO TRADICIONAL (empresa-corporativa, indústria)
    // Visual sério: hero full-bleed escuro + sobre com números
    // + serviços em grid + clientes + contato.
    // ─────────────────────────────────────────────────────────
    case 'corporate': {
      if (v === 0) {
        return [
          header(pack),
          heroFullbleed(pack),
          about(pack, 'A empresa'),
          ...(pack.stats ? [stats(pack, 'Nossos números')] : []),
          services(pack, 'O que oferecemos'),
          differentials(pack, 'Nossos diferenciais'),
          brands(pack, 'Quem confia'),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroAsymmetric(pack),
        services(pack, 'Soluções'),
        about(pack, 'Quem somos'),
        differentials(pack, 'Por que nos escolher'),
        ...(pack.stats ? [stats(pack, 'Resultados')] : []),
        brands(pack, 'Clientes'),
        cta(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // PREMIUM / BOUTIQUE (empresa-premium, alto padrão)
    // Visual escuro, refinado: hero com gradiente + vitrine +
    // prova social minimalista + contato sóbrio.
    // ─────────────────────────────────────────────────────────
    case 'premium': {
      return [
        header(pack),
        heroDarkPremium(pack),
        differentials(pack, 'Excelência em cada detalhe'),
        services(pack, 'Serviços exclusivos'),
        ...(pack.testimonials ? [testimonials(pack, 'Depoimentos')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    }

    // ═════════════════════════════════════════════════════════
    // GENÉRICO (fallback)
    // ═════════════════════════════════════════════════════════
    case 'default':
    default:
      if (v === 0) {
        return [
          header(pack),
          heroSplit(pack),
          about(pack),
          services(pack),
          differentials(pack),
          ...(pack.stats ? [stats(pack)] : []),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          ...(pack.faq ? [faq(pack)] : []),
          cta(pack),
          contact(pack),
          footer(),
        ];
      }
      if (v === 1) {
        return [
          header(pack),
          heroCentered(pack),
          services(pack),
          about(pack),
          differentials(pack),
          ...(pack.stats ? [stats(pack)] : []),
          method(pack),
          ...(pack.testimonials ? [testimonials(pack)] : []),
          cta(pack),
          footer(),
        ];
      }
      return [
        header(pack),
        heroMagazine(pack),
        about(pack),
        services(pack),
        ...(pack.stats ? [stats(pack)] : []),
        differentials(pack),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        cta(pack),
        footer(),
      ];
  }
}

/**
 * LAYOUTS ÚNICOS POR SLUG — usados pela LP `/lp` para garantir que
 * cada um dos 10 modelos da vitrine tem estrutura visual DIFERENTE
 * (mesmo que o `kind` seja o mesmo, ou o seed caia na mesma variação).
 *
 * Cada slug aqui tem:
 *  - 1 hero variant dedicado (A–J), fixo
 *  - 1 ordem de seções exclusiva, escrita à mão
 *  - 1 conjunto único de seções (alguns com `Timeline`, `Pricing`,
 *    `NumberedList` etc que não aparecem em outros slugs)
 *
 * Slug não listado aqui cai no `buildHomeSections(pack)` normal (kind→variação).
 */
function uniqueLayoutForSlug(slug: string, pack: ContentPack): AnySection[] | null {
  switch (slug) {
    // ── 1) Empresa Corporativa ── visual sério, full-bleed, grid 3-col
    case 'empresa-corporativa':
      return [
        header(pack),
        heroFullbleed(pack),                     // B: imagem cobrindo tudo
        about(pack, 'Quem somos'),
        stats(pack, 'Resultados que entregamos'),
        services(pack, 'Soluções'),
        brands(pack, 'Empresas que confiam'),
        differentials(pack, 'Por que nos escolher'),
        ...(pack.testimonials ? [testimonials(pack, 'Falam de nós')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── 2) Empresa Premium ── boutique, escuro, refinado, sóbrio
    case 'empresa-premium':
      return [
        header(pack),
        heroDarkPremium(pack),                   // D: dark com glow
        services(pack, 'Serviços exclusivos'),
        about(pack, 'Tradição em excelência'),
        differentials(pack, 'Excelência em cada detalhe'),
        marquee(pack),                            // faixa rolante
        ...(pack.testimonials ? [testimonials(pack, 'Depoimentos')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── 3) Empresa Moderna ── startup, split, números primeiro
    case 'empresa-moderna':
      return [
        header(pack),
        heroSplit(pack),                          // A: split clássico
        stats(pack, 'Em números'),
        services(pack, 'O que entregamos'),
        method(pack, 'Como entregamos'),
        cases(pack, 'Cases recentes'),
        logos(pack, 'Confiam na gente'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        footer(),
      ];

    // ── 4) Advocacia ── magazine, áreas primeiro, processo jurídico
    case 'escritorio-advocacia':
      return [
        header(pack),
        heroMagazine(pack),                       // C: magazine
        services(pack, 'Áreas de atuação'),
        processAdv(pack, 'Como atuamos'),
        about(pack, 'Sobre o escritório'),
        ...(pack.stats ? [stats(pack, 'Casos resolvidos')] : []),
        press(pack, 'Onde nosso trabalho apareceu'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        footer(),
      ];

    // ── 5) Clínica Médica ── centered, especialidades, convênios, time
    case 'clinica-medica':
      return [
        header(pack),
        heroCentered(pack),                       // C: título centralizado
        services(pack, 'Especialidades médicas'),
        conventions(pack, 'Convênios atendidos'),
        ...(pack.team ? [team(pack, 'Corpo clínico')] : []),
        about(pack, 'Sobre a clínica'),
        schedule(pack),                           // horários de atendimento
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem pacientes')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas frequentes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── 6) Restaurante ── cardápio grande, chef, reserva
    case 'restaurante':
      return [
        header(pack),
        heroFullbleed(pack),                      // B: full-bleed apetitoso
        menu(pack, 'Cardápio'),
        chef(pack, 'Quem cozinha'),
        about(pack, 'A casa'),
        marquee(pack),                            // social proof rolante
        schedule(pack),                           // horários
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        reservation(pack, 'Reserve sua mesa'),
        cta(pack),
        footer(),
      ];

    // ── 7) Imobiliária ── imóveis em grid, busca, mapa
    case 'imobiliaria':
      return [
        header(pack),
        heroAsymmetric(pack),                     // I: 60/40 assimétrico
        properties(pack, 'Imóveis em destaque'),
        differentials(pack, 'Por que nos escolher'),
        about(pack, 'A imobiliária'),
        method(pack, 'Como comprar com a gente'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        map(pack),                                 // mapa
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── 8) Loja ── magazine, produtos em destaque, marcas
    case 'loja':
      return [
        header(pack),
        heroMagazine(pack),                       // C: magazine
        products(pack, 'Em destaque'),
        brands(pack, 'Marcas que carregamos'),
        about(pack, 'Sobre a loja'),
        differentials(pack, 'Por que comprar com a gente'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── 9) Agência de Marketing ── centered, cases primeiro (diferente de startup)
    case 'agencia-marketing':
      return [
        header(pack),
        heroCentered(pack),                       // C
        cases(pack, 'Cases de sucesso'),
        services(pack, 'O que entregamos'),
        logos(pack, 'Quem confia'),
        stats(pack, 'Performance'),
        about(pack, 'Sobre a agência'),
        ...(pack.testimonials ? [testimonials(pack, 'Falam de nós')] : []),
        cta(pack),
        footer(),
      ];

    // ════════════════════════════════════════════════════════════
    // DEMAIS SLUGS (cada um com estrutura visual DIFERENTE)
    // ════════════════════════════════════════════════════════════

    // ── Indústria ── dark, números, capacidade, certificações
    case 'industria':
      return [
        header(pack),
        heroDarkPremium(pack),                    // D: dark
        stats(pack, 'Capacidade instalada'),
        services(pack, 'O que fabricamos'),
        instruments(pack, 'Tecnologia que usamos'),
        method(pack, 'Como é um projeto conosco'),
        about(pack, 'Sobre a indústria'),
        brands(pack, 'Quem confia'),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Construtora ── full-bleed, empreendimentos, processo
    case 'construtora':
      return [
        header(pack),
        heroFullbleed(pack),                      // B: full-bleed
        properties(pack, 'Empreendimentos'),
        differentials(pack, 'Por que construir com a gente'),
        about(pack, 'Quem somos'),
        method(pack, 'Do sonho à chave'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        brands(pack, 'Parceiros'),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Empresa Local / Comércio de bairro ── split, produtos, mapa
    case 'empresa-local':
      return [
        header(pack),
        heroSplit(pack),                          // A: split
        products(pack, 'Em destaque'),
        about(pack, 'Sobre nós'),
        differentials(pack, 'Por que escolher a gente'),
        schedule(pack),
        map(pack),
        ...(pack.testimonials ? [testimonials(pack, 'Falam de nós')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Startup ── dark, pitch, tração, cases (diferente da agência)
    case 'startup':
      return [
        header(pack),
        heroDarkPremium(pack),                    // D (não C, pra diferenciar)
        stats(pack, 'Tração'),
        services(pack, 'O que entregamos'),
        cases(pack, 'Cases recentes'),
        logos(pack, 'Investidores e clientes'),
        about(pack, 'Sobre a startup'),
        ...(pack.testimonials ? [testimonials(pack, 'Falam de nós')] : []),
        cta(pack),
        footer(),
      ];

    // ── Agência de Marketing ── (versão única acima, esta é duplicata removida)

    // ── Odontologia ── centered, especialidades, convênios, time
    case 'odontologia':
      return [
        header(pack),
        heroCentered(pack),                       // C
        services(pack, 'Tratamentos'),
        conventions(pack, 'Convênios'),
        team(pack, 'Nossa equipe'),
        about(pack, 'Sobre a clínica'),
        schedule(pack),
        ...(pack.testimonials ? [testimonials(pack, 'Sorrisos que transformamos')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Estética ── asymmetric, procedimentos, galeria de antes/depois
    case 'estetica':
      return [
        header(pack),
        heroAsymmetric(pack),                     // I
        services(pack, 'Procedimentos'),
        gallery(pack, 'Resultados reais'),
        about(pack, 'Sobre o espaço'),
        team(pack, 'Profissionais'),
        differentials(pack, 'Por que nos escolher'),
        schedule(pack),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Eletricista ── alert, serviços urgentes, áreas atendidas
    case 'eletricista':
      return [
        header(pack),
        heroAlert(pack),                          // G
        marquee(pack),
        services(pack, 'O que resolvemos'),
        differentials(pack, 'Compromissos'),
        about(pack, 'Sobre nós'),
        schedule(pack),
        ...(pack.stats ? [stats(pack, 'Atendimentos')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Encanador ── split, serviços, processo de atendimento
    case 'encanador':
      return [
        header(pack),
        heroSplit(pack),                          // A
        differentials(pack, 'Por que nos chamar'),
        services(pack, 'O que consertamos'),
        method(pack, 'Como funciona o atendimento'),
        about(pack, 'Quem somos'),
        schedule(pack),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        brands(pack, 'Atendemos condomínios e empresas'),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Mecânica ── full-bleed, serviços, marcas
    case 'mecanica':
      return [
        header(pack),
        heroFullbleed(pack),                      // B
        services(pack, 'Serviços'),
        brands(pack, 'Trabalhamos com'),
        about(pack, 'Sobre a oficina'),
        schedule(pack),
        differentials(pack, 'Por que nos escolher'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Assistência Técnica ── alert, serviços, marcas
    case 'assistencia-tecnica':
      return [
        header(pack),
        heroAlert(pack),                          // G
        services(pack, 'O que consertamos'),
        brands(pack, 'Marcas atendidas'),
        differentials(pack, 'Compromissos'),
        about(pack, 'Quem somos'),
        schedule(pack),
        ...(pack.stats ? [stats(pack, 'Reparos feitos')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Limpeza ── magazine, serviços, processo
    case 'limpeza':
      return [
        header(pack),
        heroMagazine(pack),                       // C
        services(pack, 'Serviços de limpeza'),
        method(pack, 'Como trabalhamos'),
        about(pack, 'Sobre a empresa'),
        differentials(pack, 'Por que nos contratar'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        schedule(pack),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Pizzaria ── full-bleed, cardápio, processo
    case 'pizzaria':
      return [
        header(pack),
        heroFullbleed(pack),                      // B
        menu(pack, 'Cardápio'),
        differentials(pack, 'O que faz nossa pizza diferente'),
        method(pack, 'Do forno à sua mesa'),
        about(pack, 'Nossa história'),
        schedule(pack),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        reservation(pack, 'Reserve sua mesa'),
        cta(pack),
        footer(),
      ];

    // ── Padaria ── centered, produtos, processo artesanal
    case 'padaria':
      return [
        header(pack),
        heroCentered(pack),                       // C
        products(pack, 'Fresquinhos do dia'),
        method(pack, 'Feito à mão todo dia'),
        about(pack, 'A padaria'),
        schedule(pack),
        differentials(pack, 'Por que somos diferentes'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Academia ── dark, modalidades, schedule
    case 'academia':
      return [
        header(pack),
        heroDarkPremium(pack),                    // D
        services(pack, 'Modalidades'),
        schedule(pack),
        about(pack, 'Sobre a academia'),
        differentials(pack, 'Por que treinar aqui'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem alunos')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Pet Shop ── split, serviços, time
    case 'pet-shop':
      return [
        header(pack),
        heroSplit(pack),                          // A
        services(pack, 'Cuidado completo'),
        team(pack, 'Quem cuida'),
        about(pack, 'Sobre nós'),
        schedule(pack),
        differentials(pack, 'Por que nos escolher'),
        ...(pack.testimonials ? [testimonials(pack, 'Tutores contam')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Fotógrafo ── dark, galeria, instrumentos
    case 'fotografo':
      return [
        header(pack),
        heroDarkPremium(pack),                    // D
        gallery(pack, 'Trabalhos recentes'),
        instruments(pack, 'Equipamentos'),
        services(pack, 'Coberturas'),
        about(pack, 'Sobre mim'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        press(pack, 'Onde meu trabalho apareceu'),
        cta(pack),
        footer(),
      ];

    // ── Advogado autônomo ── magazine, áreas, processo jurídico
    case 'advogado':
      return [
        header(pack),
        heroMagazine(pack),                       // C
        services(pack, 'Áreas de atuação'),
        processAdv(pack, 'Como trabalho'),
        about(pack, 'Sobre mim'),
        ...(pack.stats ? [stats(pack, 'Casos resolvidos')] : []),
        press(pack, 'Onde meu trabalho apareceu'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas frequentes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Contador ── asymmetric, serviços, processo
    case 'contador':
      return [
        header(pack),
        heroAsymmetric(pack),                     // I
        services(pack, 'O que entregamos'),
        method(pack, 'Como trabalho'),
        about(pack, 'Sobre mim'),
        ...(pack.stats ? [stats(pack, 'Empresas atendidas')] : []),
        differentials(pack, 'Por que me contratar'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Corretor ── split, imóveis, mapa
    case 'corretor':
      return [
        header(pack),
        heroSplit(pack),                          // A
        properties(pack, 'Imóveis em destaque'),
        about(pack, 'Sobre mim'),
        differentials(pack, 'Por que me escolher'),
        method(pack, 'Como funciona'),
        ...(pack.stats ? [stats(pack, 'Imóveis vendidos')] : []),
        map(pack),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Personal Trainer ── dark, modalidades, schedule
    case 'personal':
      return [
        header(pack),
        heroDarkPremium(pack),                    // D
        services(pack, 'Modalidades de treino'),
        schedule(pack),
        about(pack, 'Sobre mim'),
        method(pack, 'Como funcionam os treinos'),
        differentials(pack, 'Por que treinar comigo'),
        ...(pack.stats ? [stats(pack, 'Alunos transformados')] : []),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem alunos')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── Consultor ── asymmetric, sobre, marcas (diferente do advogado)
    case 'consultor':
      return [
        header(pack),
        heroAsymmetric(pack),                     // I (não C, pra diferenciar do advogado)
        about(pack, 'Sobre mim'),
        method(pack, 'Como trabalho'),
        services(pack, 'Onde atuo'),
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        brands(pack, 'Empresas que atendi'),
        differentials(pack, 'Por que me contratar'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ════════════════════════════════════════════════════════════
    // LANDING PAGES (lp-*) — todas sticky-form, mas seções únicas
    // ════════════════════════════════════════════════════════════

    // ── LP Lead Magnet ── isca digital, form primeiro + benefícios
    case 'lp-lead-magnet':
      return [
        header(pack),
        heroStickyForm(pack),                     // J
        services(pack, 'O que você vai aprender'),
        ...(pack.testimonials ? [testimonials(pack, 'Quem já baixou')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        footer(),
      ];

    // ── LP Waitlist ── lista de espera, prova social antes de FAQ
    case 'lp-waitlist':
      return [
        header(pack),
        heroStickyForm(pack),                     // J
        stats(pack, 'Quem já entrou na lista'),
        services(pack, 'O que vem por aí'),
        ...(pack.testimonials ? [testimonials(pack, 'Falam do lançamento')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        footer(),
      ];

    // ── LP Produto Único ── landing com form, prova, FAQ
    case 'lp-produto-unico':
      return [
        header(pack),
        heroStickyForm(pack),                     // J
        services(pack, 'Benefícios'),
        stats(pack, 'Em números'),
        ...(pack.testimonials ? [testimonials(pack, 'Quem já comprou')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        footer(),
      ];
    case 'lp-agendamento':
      return [
        header(pack),
        heroStickyForm(pack),                     // J
        schedule(pack),
        services(pack, 'Como funciona'),
        about(pack, 'Sobre o profissional'),
        ...(pack.testimonials ? [testimonials(pack, 'Quem já agendou')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];

    // ── LP Evento ── evento, programação, depoimentos antes de FAQ
    case 'lp-evento':
      return [
        header(pack),
        heroStickyForm(pack),                     // J
        services(pack, 'Programação'),
        schedule(pack),
        about(pack, 'Sobre o evento'),
        ...(pack.testimonials ? [testimonials(pack, 'Edições anteriores')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas rápidas')] : []),
        cta(pack),
        footer(),
      ];

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Mapeamento slug → kind
// ─────────────────────────────────────────────────────────────
function pickKind(slug: string): string {
  // Normaliza: remove hífens pra pegar 'escritorio-advocacia' como 'escritorioadvocacia'
  const norm = slug.replace(/-/g, '');
  const map: Record<string, string> = {
    restaurante: 'restaurant',
    pizzaria: 'restaurant',
    padaria: 'restaurant',
    'empresa-local': 'restaurant',
    imobiliaria: 'realestate',
    construtora: 'realestate',
    industria: 'industry',
    'clinica-medica': 'clinic',
    odontologia: 'clinic',
    estetica: 'clinic',
    eletricista: 'emergency',
    encanador: 'emergency',
    mecanica: 'emergency',
    'assistencia-tecnica': 'emergency',
    'empresa-corporativa': 'corporate',
    'empresa-moderna': 'saas',
    'empresa-premium': 'premium',
    startup: 'saas',
    'agencia-marketing': 'saas',
    escritorio: 'lawyer',
    escritorioadvocacia: 'lawyer',
    advogado: 'lawyer',
    fotografo: 'photographer',
    'pet-shop': 'pet',
    academia: 'gym',
    'personal-trainer': 'gym',
    consultor: 'consultant',
    contador: 'consultant',
    corretor: 'consultant',
    loja: 'shop',
    limpeza: 'shop',
  };
  if (norm.startsWith('escritorio')) return 'lawyer';
  if (slug.startsWith('lp-')) return 'landing';
  return map[slug] || map[norm] || 'default';
}