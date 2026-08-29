/**
 * Layouts de seções por tipo de negócio.
 *
 * Cada "kind" retorna um array de seções diferente para a Home. Isso evita
 * que todos os 30 templates sigam a mesma sequência Hero → About → Services →
 * Differentials → Testimonials → FAQ → CTA, que era o que fazia os sites
 * parecerem iguais mesmo com copy diferente.
 *
 * Os tipos cobertos:
 *   - 'default'        genérico (consultorias, escritórios, profissionais liberais)
 *   - 'restaurant'     restaurantes, pizzarias, padarias
 *   - 'realestate'     imobiliária, construtora
 *   - 'shop'           loja, decoração, varejo
 *   - 'industry'       indústria, metal-mecânica
 *   - 'clinic'         clínica, odontologia, estética
 *   - 'emergency'      eletricista, encanador, mecânica, assistência
 *   - 'saas'           software, agência de marketing
 *   - 'lawyer'         advogado, escritório de advocacia
 *   - 'photographer'   fotógrafo
 *   - 'pet'            pet shop
 *   - 'gym'            academia, personal trainer
 *   - 'consultant'     consultor, contador, corretor
 */
import type { ContentPack } from './content/registry';

type AnySection = Record<string, any>;

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

const hero = (pack: ContentPack): AnySection => ({
  component: 'Hero',
  variant: 'split',
  content: {
    eyebrow: pack.hero.eyebrow,
    title: pack.hero.title,
    subtitle: pack.hero.subtitle,
    ctaLabel: pack.hero.ctaLabel,
    ctaHref: pack.hero.ctaHref,
    image: pack.hero.image,
    imageAlt: pack.hero.imageAlt,
  },
});

const about = (pack: ContentPack, title = 'Sobre nós'): AnySection => ({
  component: 'About',
  variant: 'simple',
  content: { title, text: pack.aboutText },
});

const services = (pack: ContentPack, title = 'Serviços'): AnySection => ({
  component: 'Services',
  variant: 'grid',
  content: { title, items: pack.services },
});

const differentials = (pack: ContentPack, title = 'Por que nos escolher'): AnySection => ({
  component: 'Differentials',
  variant: 'default',
  content: { title, items: pack.differentials },
});

const stats = (pack: ContentPack, title = 'Nossos números'): AnySection => ({
  component: 'Stats',
  variant: 'default',
  content: { title, items: pack.stats },
});

const testimonials = (pack: ContentPack, title = 'Depoimentos'): AnySection => ({
  component: 'Testimonials',
  variant: 'default',
  content: { title, items: pack.testimonials },
});

const faq = (pack: ContentPack, title = 'Perguntas frequentes'): AnySection => ({
  component: 'FAQ',
  variant: 'default',
  content: { title, items: pack.faq },
});

const cta = (pack: ContentPack): AnySection => ({
  component: 'CTA',
  variant: 'centered',
  content: { title: pack.ctaTitle, ctaLabel: pack.ctaLabel, ctaHref: '#contato' },
});

const contact = (pack: ContentPack): AnySection => ({
  component: 'Contact',
  variant: 'simple',
  content: { title: 'Fale conosco', whatsapp: pack.whatsapp, email: pack.email, address: pack.address },
});

const menu = (pack: ContentPack, title = 'Cardápio'): AnySection => {
  // Se tem menuCategories, usa o MenuFull com categorias
  if (pack.menuCategories && pack.menuCategories.length) {
    return {
      component: 'MenuFull',
      variant: 'categorized',
      content: { title, categories: pack.menuCategories },
    };
  }
  return {
    component: 'MenuPreview',
    variant: 'simple',
    content: { title, items: pack.menu || [] },
  };
};

const reservation = (pack: ContentPack, title = 'Reserve sua mesa'): AnySection => ({
  component: 'Reservation',
  variant: 'simple',
  content: { title, ctaLabel: pack.ctaLabel },
});

const properties = (pack: ContentPack, title = 'Imóveis em destaque'): AnySection => ({
  component: 'Properties',
  variant: 'grid',
  content: { title, items: pack.products || [] },
});

const products = (pack: ContentPack, title = 'Em destaque'): AnySection => ({
  component: 'Products',
  variant: 'grid',
  content: { title, items: pack.products || [] },
});

const gallery = (pack: ContentPack, title = 'Galeria'): AnySection => ({
  component: 'Gallery',
  variant: 'grid',
  content: { title, items: pack.gallery || [] },
});

const cases = (pack: ContentPack, title = 'Cases'): AnySection => {
  const items = (pack as any).cases || [];
  return {
    component: 'Cases',
    variant: 'default',
    content: { title, items },
  };
};

const team = (pack: ContentPack, title = 'Time'): AnySection => ({
  component: 'Team',
  variant: 'default',
  content: { title, items: pack.team || [] },
});

// ─────────────────────────────────────────────────────────────
// LAYOUTS
// ─────────────────────────────────────────────────────────────

export function buildHomeSections(pack: ContentPack): AnySection[] {
  const kind = pickKind(pack.slug);
  switch (kind) {
    // Restaurante, pizzaria, padaria, empresa-local (comida)
    case 'restaurant':
      return [
        header(pack),
        hero(pack),
        // Menu CHEGA primeiro em restaurante — é o que importa
        menu(pack, 'Nosso cardápio'),
        about(pack, 'A casa'),
        ...(pack.stats ? [stats(pack, 'Nossos números')] : []),
        // Reservation no lugar do CTA padrão
        reservation(pack, 'Reserve sua mesa'),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        ...(pack.faq ? [faq(pack)] : []),
        contact(pack),
        footer(),
      ];
    // Imobiliária, construtora
    case 'realestate':
      return [
        header(pack),
        hero(pack),
        // Imóveis em destaque primeiro
        properties(pack, 'Imóveis em destaque'),
        differentials(pack, 'Por que nos escolher'),
        about(pack, 'Quem somos'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack, 'O que clientes dizem')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas frequentes')] : []),
        cta(pack),
        footer(),
      ];
    // Indústria
    case 'industry':
      return [
        header(pack),
        hero(pack),
        // Stats primeiro: indústria fala em números (capacidade, tolerância, certificações)
        ...(pack.stats ? [stats(pack, 'Capacidade e certificações')] : []),
        services(pack, 'O que fabricamos'),
        about(pack, 'Quem somos'),
        differentials(pack, 'Nossos diferenciais'),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Clínica, odonto, estética
    case 'clinic':
      return [
        header(pack),
        hero(pack),
        services(pack, 'Nossas especialidades'),
        // Stats: tempo de mercado + pacientes
        ...(pack.stats ? [stats(pack)] : []),
        about(pack, 'Sobre a clínica'),
        ...(pack.team ? [team(pack, 'Nosso corpo clínico')] : []),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Emergenciais 24h
    case 'emergency':
      return [
        header(pack),
        hero(pack),
        // Diferenciais ANTES dos serviços: prova que chega rápido
        differentials(pack, 'Por que nos chamar'),
        services(pack, 'O que resolvemos'),
        about(pack, 'Sobre nós'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Software / agência
    case 'saas':
      return [
        header(pack),
        hero(pack),
        // Stats logo após hero (usuários, uptime)
        ...(pack.stats ? [stats(pack, 'Em números')] : []),
        services(pack, 'O que entregamos'),
        // Cases para SaaS/agência
        ...((pack as any).cases ? [cases(pack, 'Cases recentes')] : [differentials(pack)]),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        ...(pack.faq ? [faq(pack)] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Advocacia
    case 'lawyer':
      return [
        header(pack),
        hero(pack),
        services(pack, 'Áreas de atuação'),
        about(pack, 'Sobre o escritório'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        differentials(pack, 'Por que nos contratar'),
        ...(pack.faq ? [faq(pack)] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Fotógrafo
    case 'photographer':
      return [
        header(pack),
        hero(pack),
        // Galeria CHEGA primeiro em fotógrafo
        gallery(pack, 'Trabalhos recentes'),
        services(pack, 'O que faço'),
        about(pack, 'Sobre mim'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        ...(pack.faq ? [faq(pack)] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Pet shop
    case 'pet':
      return [
        header(pack),
        hero(pack),
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
    // Academia / personal
    case 'gym':
      return [
        header(pack),
        hero(pack),
        services(pack, 'Modalidades'),
        differentials(pack, 'Por que treinar aqui'),
        ...(pack.stats ? [stats(pack)] : []),
        about(pack, 'Sobre nós'),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem alunos')] : []),
        ...(pack.faq ? [faq(pack)] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Consultor / contador / corretor
    case 'consultant':
      return [
        header(pack),
        hero(pack),
        services(pack, 'Como posso ajudar'),
        about(pack, 'Sobre mim'),
        differentials(pack, 'Por que me contratar'),
        ...(pack.stats ? [stats(pack)] : []),
        ...(pack.testimonials ? [testimonials(pack, 'O que dizem clientes')] : []),
        ...(pack.faq ? [faq(pack, 'Dúvidas comuns')] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Loja / decoração
    case 'shop':
      return [
        header(pack),
        hero(pack),
        // Produtos primeiro em loja
        products(pack, 'Em destaque'),
        about(pack, 'Sobre a loja'),
        services(pack, 'Categorias'),
        differentials(pack, 'Por que comprar com a gente'),
        ...(pack.testimonials ? [testimonials(pack)] : []),
        cta(pack),
        contact(pack),
        footer(),
      ];
    // Genérico (fallback)
    case 'default':
    default:
      return [
        header(pack),
        hero(pack),
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
}

/** Mapeia slug → kind de layout. */
function pickKind(slug: string): string {
  const map: Record<string, string> = {
    // Comida
    restaurante: 'restaurant',
    pizzaria: 'restaurant',
    padaria: 'restaurant',
    'empresa-local': 'restaurant',
    // Imóveis
    imobiliaria: 'realestate',
    construtora: 'realestate',
    // Indústria
    industria: 'industry',
    // Saúde
    'clinica-medica': 'clinic',
    odontologia: 'clinic',
    estetica: 'clinic',
    // Emergenciais
    eletricista: 'emergency',
    encanador: 'emergency',
    mecanica: 'emergency',
    'assistencia-tecnica': 'emergency',
    pet: 'emergency',
    // Software
    'empresa-moderna': 'saas',
    startup: 'saas',
    'agencia-marketing': 'saas',
    // Advocacia
    escritorio: 'lawyer',
    advogado: 'lawyer',
    // Fotógrafo
    fotografo: 'photographer',
    // Pet
    'pet-shop': 'pet',
    // Ginásio
    academia: 'gym',
    'personal-trainer': 'gym',
    // Consultor
    consultor: 'consultant',
    contador: 'consultant',
    corretor: 'consultant',
    // Loja
    loja: 'shop',
    limpeza: 'shop',
  };
  // escritório de advocacia
  if (slug.startsWith('escritorio')) return 'lawyer';
  return map[slug] || 'default';
}
