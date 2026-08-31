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
  component: 'Hero', variant: 'split',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image, imageAlt: pack.hero.imageAlt },
});

const heroFullbleed = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'fullbleed',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image, imageAlt: pack.hero.imageAlt },
});

const heroCentered = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'centered-bold',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

const heroDarkPremium = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'dark-premium',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

const heroMagazine = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'magazine',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
});

const heroAlert = (pack: ContentPack): AnySection => ({
  component: 'Hero', variant: 'card-informativo',
  content: { eyebrow: pack.hero.eyebrow, title: pack.hero.title, subtitle: pack.hero.subtitle, ctaLabel: pack.hero.ctaLabel, ctaHref: pack.hero.ctaHref, image: pack.hero.image },
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

// Seções únicas por segmento
const chef = (pack: ContentPack, title = 'Nosso time'): AnySection => ({
  component: 'Chef', variant: 'default',
  content: { title, items: pack.team || [] },
});

const brands = (pack: ContentPack, title = 'Trabalhamos com'): AnySection => ({
  component: 'Brands', variant: 'default',
  content: { title, items: [
    { name: 'Toyota' }, { name: 'Bosch' }, { name: 'Siemens' }, { name: 'Vale' },
    { name: 'Petrobras' }, { name: 'Embraer' }, { name: 'Itaú' }, { name: 'Natura' },
  ] },
});

const conventions = (pack: ContentPack, title = 'Convênios'): AnySection => ({
  component: 'Conventions', variant: 'default',
  content: { title, items: [
    { name: 'SulAmérica' }, { name: 'Amil' }, { name: 'Bradesco Saúde' },
    { name: 'Unimed' }, { name: 'Hapvida' }, { name: 'NotreDame' },
  ] },
});

const schedule = (pack: ContentPack): AnySection => ({
  component: 'Schedule', variant: 'default',
  content: { title: 'Horários', items: [
    { day: 'Segunda', hours: 'Fechado' },
    { day: 'Ter–Sex', hours: '12h–15h · 19h–23h' },
    { day: 'Sábado', hours: '12h–00h' },
    { day: 'Domingo', hours: '12h–22h' },
  ] },
});

const instruments = (pack: ContentPack, title = 'Equipamentos'): AnySection => ({
  component: 'Instruments', variant: 'default',
  content: { title, items: [
    { name: 'Sony A7R V', tag: 'Full-frame' },
    { name: 'Canon R5', tag: 'Híbrido' },
    { name: 'DJI Mavic 3 Pro', tag: 'Drone' },
    { name: 'Aputure 600D', tag: 'Iluminação' },
    { name: 'Gimbal RS3', tag: 'Estabilizador' },
    { name: 'Godox AD400', tag: 'Flash' },
    { name: 'Sigma Art 35mm', tag: 'Lente' },
    { name: 'MacBook Pro M3', tag: 'Edição' },
  ] },
});

const method = (pack: ContentPack, title = 'Nosso método'): AnySection => ({
  component: 'Method', variant: 'default',
  content: { title, items: [
    { step: '1', title: 'Diagnóstico', desc: 'Entendemos seu cenário em uma conversa de 60 minutos.' },
    { step: '2', title: 'Plano', desc: 'Documentamos escopo, prazos e investimento em contrato.' },
    { step: '3', title: 'Execução', desc: 'Sprints quinzenais com reuniões de alinhamento.' },
    { step: '4', title: 'Entrega', desc: 'Homologação, treinamento e suporte continuado.' },
  ] },
});

const processAdv = (pack: ContentPack, title = 'Como atuamos'): AnySection => ({
  component: 'Process', variant: 'default',
  content: { title, items: [
    { title: 'Consulta inicial', desc: 'Análise gratuita do caso, sem compromisso.' },
    { title: 'Estratégia', desc: 'Plano jurídico com prazos, riscos e chances de êxito.' },
    { title: 'Protocolo', desc: 'Petições, audiências e sustentações orais.' },
    { title: 'Resultado', desc: 'Acompanhamento até trânsito em julgado.' },
  ] },
});

const press = (pack: ContentPack, title = 'Quem falou de nós'): AnySection => ({
  component: 'Press', variant: 'default',
  content: { title, items: [
    { name: 'Valor Econômico' }, { name: 'Folha de S.Paulo' }, { name: 'Época' },
    { name: 'Exame' }, { name: 'IstoÉ' }, { name: 'Veja' },
  ] },
});

const logos = (pack: ContentPack, title = 'Clientes'): AnySection => ({
  component: 'Logos', variant: 'default',
  content: { title, items: [
    { name: 'Magazine Luiza' }, { name: 'Stone' }, { name: 'Nubank' },
    { name: 'iFood' }, { name: 'Ambev' }, { name: 'Natura' },
  ] },
});

const marquee = (pack: ContentPack): AnySection => ({
  component: 'Marquee', variant: 'default',
  content: { items: [
    { text: '★ 4.9 no Google' },
    { text: '✓ 18 anos no mercado' },
    { text: '● 22 profissionais' },
    { text: '◆ 8.000 clientes atendidos' },
    { text: '▲ Resposta em 1 hora' },
  ] },
});

const highlights = (pack: ContentPack): AnySection => ({
  component: 'Highlights', variant: 'default',
  content: { title: 'Por que somos diferentes', subtitle: 'Não é só marketing — são compromissos verificáveis', items: pack.differentials.map((d, i) => ({
    icon: ['✓', '★', '◆', '●', '▲', '■'][i % 6],
    title: d.name,
    desc: d.desc,
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

// ─────────────────────────────────────────────────────────────
// LAYOUTS — cada segmento tem 3 variações
// ─────────────────────────────────────────────────────────────

export function buildHomeSections(pack: ContentPack): AnySection[] {
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

// ─────────────────────────────────────────────────────────────
// Mapeamento slug → kind
// ─────────────────────────────────────────────────────────────
function pickKind(slug: string): string {
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
    'empresa-moderna': 'saas',
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
  if (slug.startsWith('escritorio')) return 'lawyer';
  return map[slug] || 'default';
}