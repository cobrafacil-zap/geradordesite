// ─────────────────────────────────────────────────────────────────
// 30 Templates com identidade própria
// Cada um define: pages, sections por página, defaultTheme,
// presets de copy e variantes de componentes usadas.
// ─────────────────────────────────────────────────────────────────

import type { Page, Section } from '../site-schema';

export interface TemplatePreset {
  company: string;
  slogan: string;
  about: string;
  segment: string;
  city?: string;
  state?: string;
  services?: Array<{ name: string; desc: string }>;
  differentials?: Array<{ name: string; desc: string }>;
  faq?: Array<{ q: string; a: string }>;
  team?: Array<{ name: string; role: string; bio?: string }>;
  testimonials?: Array<{ name: string; text: string; role?: string }>;
  city_label?: string;
}

export interface Template {
  slug: string;
  name: string;
  category: 'institucional' | 'servicos' | 'comercio' | 'profissionais';
  segment: string;
  description: string;
  thumb: string;
  defaultTheme: {
    primary: string;
    secondary: string;
    accent: string;
    style: string;
    fontHeading?: string;
    fontBody?: string;
  };
  pages: Array<{ slug: string; name: string; sections: string[] }>;
  variants: { hero: string; header: string; footer: string };
  preset: TemplatePreset;
}

// Helper para gerar páginas com sections
function page(slug: string, name: string, sections: string[]): { slug: string; name: string; sections: string[] } {
  return { slug, name, sections };
}

function buildPages(specs: Array<[string, string, string[]]>): Template['pages'] {
  return specs.map(([slug, name, sections]) => page(slug, name, sections));
}

// Imagens por categoria (Unsplash)
const IMG = {
  corporate: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop',
  modern: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80&auto=format&fit=crop',
  premium: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?w=1600&q=80&auto=format&fit=crop',
  industry: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1600&q=80&auto=format&fit=crop',
  construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80&auto=format&fit=crop',
  startup: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format&fit=crop',
  local: 'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1600&q=80&auto=format&fit=crop',
  lawfirm: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80&auto=format&fit=crop',
  clinic: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&auto=format&fit=crop',
  odonto: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&q=80&auto=format&fit=crop',
  esthetic: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80&auto=format&fit=crop',
  electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80&auto=format&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1600&q=80&auto=format&fit=crop',
  mechanic: 'https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=1600&q=80&auto=format&fit=crop',
  techassist: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1600&q=80&auto=format&fit=crop',
  agency: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80&auto=format&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80&auto=format&fit=crop',
  realestate: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80&auto=format&fit=crop',
  shop: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format&fit=crop',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
  pizzaria: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80&auto=format&fit=crop',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80&auto=format&fit=crop',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop',
  petshop: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600&q=80&auto=format&fit=crop',
  photographer: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80&auto=format&fit=crop',
  lawyer: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80&auto=format&fit=crop',
  accountant: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80&auto=format&fit=crop',
  broker: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80&auto=format&fit=crop',
  trainer: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop',
  consultant: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80&auto=format&fit=crop',
};

// ─────────────────────────────────────────────────────────────────
// INSTITUCIONAL (8)
// ─────────────────────────────────────────────────────────────────

const empresaCorporativa: Template = {
  slug: 'empresa-corporativa',
  name: 'Empresa Corporativa',
  category: 'institucional',
  segment: 'empresa',
  description: 'Sites sólidos para empresas B2B, indústria e tecnologia.',
  thumb: IMG.corporate,
  defaultTheme: { primary: '#1e3a8a', secondary: '#0f172a', accent: '#0ea5e9', style: 'corporativo' },
  variants: { hero: 'A', header: 'centered', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Cases', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'Differentials', 'CTA', 'Footer']],
    ['/cases', 'Cases', ['Header', 'HeroSimple', 'Cases', 'CTA', 'Footer']],
    ['/blog', 'Blog', ['Header', 'HeroSimple', 'BlogList', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Aurélio & Bastos',
    slogan: 'Quarenta anos construindo empresas que constroem o Brasil',
    about: 'Sociedade empresarial com atuação em direito societário, contratos complexos e contencioso estratégico. Atendemos grupos econômicos e médias empresas.',
    segment: 'Empresa Corporativa',
    city: 'São Paulo',
    services: [
      { name: 'Direito Societário', desc: 'Estruturação, M&A e reorganização societária.' },
      { name: 'Contratos Complexos', desc: 'Negociação e revisão contratual nacional e internacional.' },
      { name: 'Contencioso Estratégico', desc: 'Atuação em tribunais superiores e câmaras arbitrais.' },
    ],
    differentials: [
      { name: 'Bancas de Elite', desc: 'Sócios formados em universidades de referência.' },
      { name: 'Atendimento por Sócio', desc: 'Cada cliente é acompanhado por um sócio responsável.' },
      { name: 'SLA de Resposta', desc: '24h úteis para retorno em qualquer demanda.' },
    ],
    faq: [
      { q: 'Atendem em quais regiões?', a: 'Atendemos clientes em todo o Brasil e exterior.' },
      { q: 'Como é a forma de cobrança?', a: 'Honorários por hora, valor fixo ou êxito, sempre combinados antes.' },
    ],
  },
};

const empresaModerna: Template = {
  slug: 'empresa-moderna',
  name: 'Empresa Moderna',
  category: 'institucional',
  segment: 'empresa-tech',
  description: 'Startups, SaaS e empresas de tecnologia.',
  thumb: IMG.modern,
  defaultTheme: { primary: '#0f172a', secondary: '#1e293b', accent: '#22d3ee', style: 'moderno' },
  variants: { hero: 'C', header: 'sticky-dark', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Stats', 'Services', 'About', 'Cases', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/cases', 'Cases', ['Header', 'HeroSimple', 'Cases', 'CTA', 'Footer']],
    ['/blog', 'Blog', ['Header', 'HeroSimple', 'BlogList', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Stack Lab',
    slogan: 'Engenharia de software com obsessão por produto',
    about: 'Time senior de engenheiros e product designers que entrega software robusto, escalável e observável. Squads embarcadas ou projetos fechados.',
    segment: 'Engenharia de Software',
    city: 'Florianópolis',
    services: [
      { name: 'Squads Embarcadas', desc: 'Engenheiros e QAs alocados no seu time com cultura e processo definidos.' },
      { name: 'Plataformas e APIs', desc: 'Backend assíncrono, microsserviços e GraphQL para alto tráfego.' },
      { name: 'Modernização de Legado', desc: 'Migração incremental de monolitos para arquiteturas evolutivas.' },
    ],
    differentials: [
      { name: 'Só Engenheiro Senior', desc: 'Nenhum dev júnior no projeto. Média de 8 anos de experiência.' },
      { name: 'Observabilidade dia 1', desc: 'Logs estruturados, métricas, tracing e alertas desde a primeira sprint.' },
      { name: 'On-call com SLA', desc: 'Plantão com tempo de resposta contratual.' },
    ],
  },
};

const empresaPremium: Template = {
  slug: 'empresa-premium',
  name: 'Empresa Premium',
  category: 'institucional',
  segment: 'luxo',
  description: 'Boutiques, alto padrão e marcas sofisticadas.',
  thumb: IMG.premium,
  defaultTheme: { primary: '#0c0a09', secondary: '#1c1917', accent: '#d4af37', style: 'premium', fontHeading: 'Playfair Display, serif', fontBody: 'Inter, sans-serif' },
  variants: { hero: 'B', header: 'centered-dark', footer: 'premium' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'About', 'Differentials', 'Gallery', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'History', 'CTA', 'Footer']],
    ['/colecoes', 'Coleções', ['Header', 'HeroSimple', 'Gallery', 'CTA', 'Footer']],
    ['/atendimento', 'Atendimento', ['Header', 'HeroSimple', 'Contact', 'CTA', 'Footer']],
  ]),
  preset: {
    company: 'Atelier Fiamma',
    slogan: 'Alta relojoaria, ourivesaria e objetos de coleção',
    about: 'Casa especializada em relógios suíços de alta gama, joias sob encomenda e objetos de arte. Atendimento exclusivo por agendamento.',
    segment: 'Alta Relojoaria',
    city: 'São Paulo',
    services: [
      { name: 'Curadoria de Relógios', desc: 'Pequenas tiragens de maisons independentes e peças usadas certificadas.' },
      { name: 'Joias sob Encomenda', desc: 'Peças únicas desenhadas em conjunto com ourives e lapidários.' },
      { name: 'Manutenção Especializada', desc: 'Revisão periódica por relojoeiro formado na Suíça.' },
    ],
    differentials: [
      { name: 'Procedência Garantida', desc: 'Cada peça acompanha certificado e nota de procedência.' },
      { name: 'Atendimento por Agenda', desc: 'Showroom particular, sem fila e sem pressão.' },
      { name: 'Garantia Estendida', desc: 'Cobertura adicional após a entrega, com revisão anual cortesia.' },
    ],
  },
};

const industria: Template = {
  slug: 'industria',
  name: 'Indústria',
  category: 'institucional',
  segment: 'industria',
  description: 'Indústrias, fabricantes e fornecedores.',
  thumb: IMG.industry,
  defaultTheme: { primary: '#374151', secondary: '#111827', accent: '#f59e0b', style: 'corporativo' },
  variants: { hero: 'A', header: 'centered', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Stats', 'Cases', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'History', 'CTA', 'Footer']],
    ['/produtos', 'Produtos', ['Header', 'HeroSimple', 'Products', 'CTA', 'Footer']],
    ['/cases', 'Cases', ['Header', 'HeroSimple', 'Cases', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Metalúrgica Andrade',
    slogan: 'Componentes usinados com precisão CNC há três décadas',
    about: 'Indústria metalúrgica especializada em usinagem de precisão, injeção plástica e montagem técnica para setores automotivo, agrícola e médico.',
    segment: 'Indústria Metalúrgica',
    city: 'Caxias do Sul',
    services: [
      { name: 'Usinagem CNC', desc: 'Tornos e centros de usinagem 3 a 5 eixos de última geração.' },
      { name: 'Injeção Plástica', desc: 'Produção seriada e prototipagem rápida.' },
      { name: 'Montagem Técnica', desc: 'Linhas de montagem com controle de qualidade ISO 9001.' },
    ],
    differentials: [
      { name: 'ISO 9001', desc: 'Certificação atualizada com auditoria anual.' },
      { name: 'Engenharia Própria', desc: 'Equipe técnica para desenvolvimento de produtos.' },
      { name: 'Logística Integrada', desc: 'Entrega just-in-time em todo o Mercosul.' },
    ],
  },
};

const construtora: Template = {
  slug: 'construtora',
  name: 'Construtora',
  category: 'institucional',
  segment: 'construcao',
  description: 'Construtoras, incorporadoras e arquitetura.',
  thumb: IMG.construction,
  defaultTheme: { primary: '#b45309', secondary: '#451a03', accent: '#facc15', style: 'corporativo' },
  variants: { hero: 'A', header: 'split', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Cases', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'History', 'CTA', 'Footer']],
    ['/empreendimentos', 'Empreendimentos', ['Header', 'HeroSimple', 'Properties', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Construtora Beira-Rio',
    slogan: 'Empreendimentos que respeitam o tempo e a paisagem',
    about: 'Construtora e incorporadora com foco em empreendimentos residenciais e comerciais de médio e alto padrão.',
    segment: 'Construção Civil',
    city: 'Curitiba',
    services: [
      { name: 'Incorporação', desc: 'Lançamento, planejamento e aprovação de empreendimentos.' },
      { name: 'Construção Civil', desc: 'Execução de obras com cronograma e orçamento garantidos.' },
      { name: 'Reformas Premium', desc: 'Reformas residenciais e comerciais com acabamento autoral.' },
    ],
  },
};

const startup: Template = {
  slug: 'startup',
  name: 'Startup',
  category: 'institucional',
  segment: 'startup',
  description: 'Startups early stage e empresas em crescimento.',
  thumb: IMG.startup,
  defaultTheme: { primary: '#7c3aed', secondary: '#1e1b4b', accent: '#22d3ee', style: 'moderno' },
  variants: { hero: 'C', header: 'transparent-dark', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Cases', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'CTA', 'Footer']],
    ['/produto', 'Produto', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/blog', 'Blog', ['Header', 'HeroSimple', 'BlogList', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Pulse AI',
    slogan: 'Inteligência artificial que ouve seus clientes em tempo real',
    about: 'Plataforma SaaS de análise de voz para call centers. Transcreve, classifica e gera insights de cada chamada.',
    segment: 'Inteligência Artificial',
    city: 'São Paulo',
    services: [
      { name: 'Análise de Voz', desc: 'Transcrição e classificação em tempo real.' },
      { name: 'Insights Automáticos', desc: 'Detecção de padrões e alertas inteligentes.' },
      { name: 'Dashboard', desc: 'Painel de métricas operacionais e de qualidade.' },
    ],
  },
};

const empresaLocal: Template = {
  slug: 'empresa-local',
  name: 'Empresa Local',
  category: 'institucional',
  segment: 'comercio-local',
  description: 'Negócios regionais e empresas de bairro.',
  thumb: IMG.local,
  defaultTheme: { primary: '#15803d', secondary: '#052e16', accent: '#fbbf24', style: 'popular' },
  variants: { hero: 'E', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Mercado do Bairro',
    slogan: 'Tradição e qualidade desde 1987',
    about: 'Mercado familiar com produtos frescos, hortifrúti, açougue e padaria. Atendimento próximo e personalizado.',
    segment: 'Comércio Local',
    city: 'Belo Horizonte',
  },
};

const escritorioAdvocacia: Template = {
  slug: 'escritorio-advocacia',
  name: 'Escritório de Advocacia',
  category: 'institucional',
  segment: 'advocacia-empresa',
  description: 'Bancas full service e escritórios empresariais.',
  thumb: IMG.lawfirm,
  defaultTheme: { primary: '#0c0a09', secondary: '#1c1917', accent: '#a16207', style: 'premium' },
  variants: { hero: 'A', header: 'centered-dark', footer: 'premium' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Team', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'History', 'CTA', 'Footer']],
    ['/areas', 'Áreas de Atuação', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/equipe', 'Equipe', ['Header', 'HeroSimple', 'Team', 'CTA', 'Footer']],
    ['/artigos', 'Artigos', ['Header', 'HeroSimple', 'BlogList', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Pereira & Saldanha',
    slogan: 'Advocacia empresarial de alta performance',
    about: 'Banca full service com foco em direito empresarial, contratos, tributário e contencioso estratégico. Atendemos grupos econômicos em todo o Brasil.',
    segment: 'Advocacia Empresarial',
    city: 'São Paulo',
    services: [
      { name: 'Direito Societário', desc: 'Estruturação, M&A e governança corporativa.' },
      { name: 'Direito Tributário', desc: 'Planejamento e contencioso fiscal.' },
      { name: 'Contratos', desc: 'Negociação e revisão contratual nacional e internacional.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────
// SERVIÇOS (10)
// ─────────────────────────────────────────────────────────────────

const clinicaMedica: Template = {
  slug: 'clinica-medica',
  name: 'Clínica Médica',
  category: 'servicos',
  segment: 'clinica',
  description: 'Clínicas, consultórios e profissionais da saúde.',
  thumb: IMG.clinic,
  defaultTheme: { primary: '#0d9488', secondary: '#134e4a', accent: '#06b6d4', style: 'elegante' },
  variants: { hero: 'B', header: 'centered', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Specialties', 'About', 'Differentials', 'Team', 'Testimonials', 'FAQ', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'History', 'CTA', 'Footer']],
    ['/especialidades', 'Especialidades', ['Header', 'HeroSimple', 'Specialties', 'CTA', 'Footer']],
    ['/equipe', 'Equipe', ['Header', 'HeroSimple', 'Team', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
    ['/politica-de-privacidade', 'Privacidade', ['Header', 'Legal', 'Footer']],
  ]),
  preset: {
    company: 'Clínica Vita',
    slogan: 'Cuidado integral para sua saúde e bem-estar',
    about: 'Clínica multidisciplinar com equipe médica especializada em cardiologia, endocrinologia, clínica geral e nutrição. Atendimento humanizado.',
    segment: 'Clínica Médica',
    city: 'Curitiba',
    services: [
      { name: 'Cardiologia', desc: 'Avaliação cardiológica completa e exames complementares.' },
      { name: 'Endocrinologia', desc: 'Tratamento de diabetes, tireoide e metabolismo.' },
      { name: 'Nutrição Clínica', desc: 'Planos alimentares individualizados.' },
    ],
    differentials: [
      { name: 'Equipe Multidisciplinar', desc: 'Médicos, nutricionistas e psicólogos integrados.' },
      { name: 'Convênios e Particular', desc: 'Atendemos os principais convênios e particular.' },
      { name: 'Agendamento Online', desc: 'Marque sua consulta pelo site em poucos cliques.' },
    ],
  },
};

const odontologia: Template = {
  slug: 'odontologia',
  name: 'Odontologia',
  category: 'servicos',
  segment: 'odontologia',
  description: 'Consultórios odontológicos e clínicas dentárias.',
  thumb: IMG.odonto,
  defaultTheme: { primary: '#0284c7', secondary: '#082f49', accent: '#67e8f9', style: 'elegante' },
  variants: { hero: 'B', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Specialties', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Odonto Vita',
    slogan: 'Sorriso saudável começa aqui',
    about: 'Clínica odontológica com tecnologia digital, sedação consciente e equipe especializada em implantes, ortodontia e estética.',
    segment: 'Odontologia',
    city: 'São Paulo',
    services: [
      { name: 'Implantes', desc: 'Implantes dentários com tecnologia 3D.' },
      { name: 'Ortodontia', desc: 'Aparelhos convencionais e alinhadores invisíveis.' },
      { name: 'Estética Dental', desc: 'Lentes, clareamento e harmonização.' },
    ],
  },
};

const estetica: Template = {
  slug: 'estetica',
  name: 'Estética & Beleza',
  category: 'servicos',
  segment: 'estetica',
  description: 'Clínicas de estética, beleza e bem-estar.',
  thumb: IMG.esthetic,
  defaultTheme: { primary: '#be185d', secondary: '#500724', accent: '#f9a8d4', style: 'elegante' },
  variants: { hero: 'B', header: 'centered', footer: 'premium' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/procedimentos', 'Procedimentos', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/galeria', 'Galeria', ['Header', 'HeroSimple', 'Gallery', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Bella Estética',
    slogan: 'Sua melhor versão começa aqui',
    about: 'Clínica de estética avançada com procedimentos faciais e corporais. Equipe especializada e tecnologia de ponta.',
    segment: 'Estética Avançada',
    city: 'Rio de Janeiro',
    services: [
      { name: 'Tratamentos Faciais', desc: 'Limpezas, peelings e harmonização facial.' },
      { name: 'Tratamentos Corporais', desc: 'Drenagem, criolipólise e massagens.' },
      { name: 'Depilação a Laser', desc: 'Tecnologia de última geração para todos os tipos de pele.' },
    ],
  },
};

const eletricista: Template = {
  slug: 'eletricista',
  name: 'Eletricista',
  category: 'servicos',
  segment: 'eletricista',
  description: 'Eletricistas residenciais, prediais e industriais.',
  thumb: IMG.electrician,
  defaultTheme: { primary: '#facc15', secondary: '#713f12', accent: '#0ea5e9', style: 'impactante' },
  variants: { hero: 'A', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Elétrica Central',
    slogan: 'Energia segura, instalação profissional',
    about: 'Eletricista com 15 anos de experiência em instalações residenciais, prediais e industriais. Atendimento 24h para emergências.',
    segment: 'Serviços Elétricos',
    city: 'São Paulo',
    services: [
      { name: 'Instalações Residenciais', desc: 'Projetos elétricos residenciais completos.' },
      { name: 'Manutenção Predial', desc: 'Manutenção preventiva e corretiva em condomínios.' },
      { name: 'Emergência 24h', desc: 'Atendimento de emergência todos os dias.' },
    ],
    differentials: [
      { name: 'NR-10 e NR-35', desc: 'Equipe certificada para trabalho em altura e instalações elétricas.' },
      { name: 'Orçamento Sem Compromisso', desc: 'Visita técnica gratuita e orçamento detalhado.' },
      { name: 'Garantia de Serviço', desc: 'Garantia de 90 dias em todos os serviços.' },
    ],
  },
};

const encanador: Template = {
  slug: 'encanador',
  name: 'Encanador',
  category: 'servicos',
  segment: 'encanador',
  description: 'Encanadores residenciais e comerciais.',
  thumb: IMG.plumber,
  defaultTheme: { primary: '#1d4ed8', secondary: '#172554', accent: '#06b6d4', style: 'corporativo' },
  variants: { hero: 'A', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'FAQ', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Hidro Pró',
    slogan: 'Solução rápida para qualquer problema hidráulico',
    about: 'Encanamento residencial e comercial com atendimento 24h. Detecção de vazamentos, desentupimento e instalação.',
    segment: 'Encanamento',
    city: 'Campinas',
    services: [
      { name: 'Desentupimento', desc: 'Desentupimento de pias, ralos, vasos e esgotos.' },
      { name: 'Detecção de Vazamentos', desc: 'Tecnologia ultrassônica para localizar vazamentos sem quebrar.' },
      { name: 'Instalações', desc: 'Instalação de tubulações e acessórios hidráulicos.' },
    ],
  },
};

const mecanica: Template = {
  slug: 'mecanica',
  name: 'Mecânica / Auto Center',
  category: 'servicos',
  segment: 'mecanica',
  description: 'Oficinas mecânicas, auto centers e borracharias.',
  thumb: IMG.mechanic,
  defaultTheme: { primary: '#dc2626', secondary: '#450a0a', accent: '#facc15', style: 'impactante' },
  variants: { hero: 'A', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Auto Center Roda Viva',
    slogan: 'Cuidamos do seu carro como se fosse nosso',
    about: 'Mecânica geral, elétrica, suspensão e funilaria. Atendimento multimarcas com orçamento detalhado.',
    segment: 'Mecânica Automotiva',
    city: 'Curitiba',
    services: [
      { name: 'Mecânica Geral', desc: 'Troca de óleo, freios, suspensão e motor.' },
      { name: 'Elétrica Automotiva', desc: 'Diagnóstico e reparo elétrico completo.' },
      { name: 'Alinhamento e Balanceamento', desc: 'Equipamentos de precisão para seu veículo.' },
    ],
  },
};

const assistenciaTecnica: Template = {
  slug: 'assistencia-tecnica',
  name: 'Assistência Técnica',
  category: 'servicos',
  segment: 'assistencia',
  description: 'Assistência técnica de celulares, eletrodomésticos e TI.',
  thumb: IMG.techassist,
  defaultTheme: { primary: '#0ea5e9', secondary: '#082f49', accent: '#fbbf24', style: 'moderno' },
  variants: { hero: 'E', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'FAQ', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'TechFix Assistência',
    slogan: 'Conserto rápido e garantia real',
    about: 'Assistência técnica especializada em smartphones, notebooks e eletrodomésticos. Diagnóstico em 24h.',
    segment: 'Assistência Técnica',
    city: 'São Paulo',
    services: [
      { name: 'Smartphones', desc: 'Troca de tela, bateria e reparo de placa.' },
      { name: 'Notebooks', desc: 'Reparo de placas, troca de teclado e upgrades.' },
      { name: 'Eletrodomésticos', desc: 'Conserto de geladeiras, máquinas de lavar e micro-ondas.' },
    ],
  },
};

const agenciaMarketing: Template = {
  slug: 'agencia-marketing',
  name: 'Agência de Marketing',
  category: 'servicos',
  segment: 'agencia',
  description: 'Agências criativas, de marketing digital e publicidade.',
  thumb: IMG.agency,
  defaultTheme: { primary: '#7c3aed', secondary: '#2e1065', accent: '#ec4899', style: 'criativo' },
  variants: { hero: 'C', header: 'transparent-dark', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Cases', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/cases', 'Cases', ['Header', 'HeroSimple', 'Cases', 'CTA', 'Footer']],
    ['/blog', 'Blog', ['Header', 'HeroSimple', 'BlogList', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Estúdio Onda',
    slogan: 'Marcas que movem pessoas',
    about: 'Agência independente focada em branding, estratégia digital e conteúdo. Atendemos marcas que valorizam identidade e impacto.',
    segment: 'Agência Criativa',
    city: 'São Paulo',
    services: [
      { name: 'Branding', desc: 'Identidade visual e verbal para marcas memoráveis.' },
      { name: 'Marketing Digital', desc: 'Estratégia, mídia paga e SEO.' },
      { name: 'Conteúdo', desc: 'Produção de conteúdo para redes sociais e blogs.' },
    ],
  },
};

const limpeza: Template = {
  slug: 'limpeza',
  name: 'Limpeza',
  category: 'servicos',
  segment: 'limpeza',
  description: 'Diaristas, empresas de limpeza residencial e comercial.',
  thumb: IMG.cleaning,
  defaultTheme: { primary: '#16a34a', secondary: '#052e16', accent: '#84cc16', style: 'popular' },
  variants: { hero: 'A', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Brilho Total',
    slogan: 'Sua casa limpa, sua vida organizada',
    about: 'Empresa de limpeza residencial e comercial com equipe treinada, produtos profissionais e agendamento flexível.',
    segment: 'Limpeza',
    city: 'Rio de Janeiro',
    services: [
      { name: 'Limpeza Residencial', desc: 'Faxina completa, semanal ou quinzenal.' },
      { name: 'Limpeza Comercial', desc: 'Escritórios, clínicas e lojas.' },
      { name: 'Pós-obra', desc: 'Limpeza pesada após reforma ou mudança.' },
    ],
  },
};

const imobiliaria: Template = {
  slug: 'imobiliaria',
  name: 'Imobiliária',
  category: 'servicos',
  segment: 'imobiliaria',
  description: 'Imobiliárias, corretores e lançamentos.',
  thumb: IMG.realestate,
  defaultTheme: { primary: '#0f172a', secondary: '#1e293b', accent: '#d4af37', style: 'premium' },
  variants: { hero: 'F', header: 'split', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Properties', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/imoveis', 'Imóveis', ['Header', 'HeroSimple', 'PropertyList', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Team', 'CTA', 'Footer']],
    ['/corretores', 'Corretores', ['Header', 'HeroSimple', 'Team', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Imobiliária Central',
    slogan: 'O imóvel certo para o momento certo',
    about: 'Imobiliária com mais de 20 anos no mercado. Atuação em venda, locação e lançamentos de alto padrão.',
    segment: 'Imobiliária',
    city: 'São Paulo',
    services: [
      { name: 'Venda de Imóveis', desc: 'Apartamentos, casas, terrenos e comerciais.' },
      { name: 'Locação', desc: 'Aluguel residencial e comercial com gestão completa.' },
      { name: 'Lançamentos', desc: 'Acesso exclusivo a empreendimentos em pré-lançamento.' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────
// COMÉRCIO (7)
// ─────────────────────────────────────────────────────────────────

const loja: Template = {
  slug: 'loja',
  name: 'Loja / Catálogo',
  category: 'comercio',
  segment: 'loja',
  description: 'Lojas, catálogos e e-commerce simples.',
  thumb: IMG.shop,
  defaultTheme: { primary: '#7c3aed', secondary: '#1e1b4b', accent: '#f59e0b', style: 'criativo' },
  variants: { hero: 'D', header: 'ecommerce', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Products', 'Differentials', 'About', 'Testimonials', 'CTA', 'Footer']],
    ['/produtos', 'Produtos', ['Header', 'HeroSimple', 'ProductList', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Loja Aurora',
    slogan: 'Produtos selecionados para o seu dia a dia',
    about: 'Loja online de produtos selecionados com curadoria criteriosa. Entrega para todo o Brasil.',
    segment: 'Comércio',
    city: 'São Paulo',
  },
};

const restaurante: Template = {
  slug: 'restaurante',
  name: 'Restaurante',
  category: 'comercio',
  segment: 'restaurante',
  description: 'Restaurantes, bares e casas gastronômicas.',
  thumb: IMG.restaurant,
  defaultTheme: { primary: '#7c2d12', secondary: '#431407', accent: '#f59e0b', style: 'elegante' },
  variants: { hero: 'B', header: 'centered-dark', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'MenuPreview', 'About', 'Gallery', 'Testimonials', 'CTA', 'Footer']],
    ['/cardapio', 'Cardápio', ['Header', 'HeroSimple', 'MenuFull', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'Gallery', 'CTA', 'Footer']],
    ['/reservas', 'Reservas', ['Header', 'HeroSimple', 'Reservation', 'Contact', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Trattoria Bella',
    slogan: 'Cozinha italiana autêntica no coração da cidade',
    about: 'Restaurante italiano com massas frescas feitas diariamente, ingredientes importados e carta de vinhos selecionada.',
    segment: 'Restaurante',
    city: 'São Paulo',
  },
};

const pizzaria: Template = {
  slug: 'pizzaria',
  name: 'Pizzaria',
  category: 'comercio',
  segment: 'pizzaria',
  description: 'Pizzarias tradicionais e artesanais.',
  thumb: IMG.pizzaria,
  defaultTheme: { primary: '#dc2626', secondary: '#450a0a', accent: '#facc15', style: 'impactante' },
  variants: { hero: 'B', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'MenuPreview', 'About', 'Gallery', 'Testimonials', 'CTA', 'Footer']],
    ['/cardapio', 'Cardápio', ['Header', 'HeroSimple', 'MenuFull', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Pizzaria Forno a Lenha',
    slogan: 'A pizza que você sempre quis provar',
    about: 'Pizzaria tradicional com forno a lenha, massa de fermentação natural e ingredientes selecionados.',
    segment: 'Pizzaria',
    city: 'Curitiba',
  },
};

const padaria: Template = {
  slug: 'padaria',
  name: 'Padaria',
  category: 'comercio',
  segment: 'padaria',
  description: 'Padarias, confeitarias e boulangeries.',
  thumb: IMG.bakery,
  defaultTheme: { primary: '#b45309', secondary: '#451a03', accent: '#facc15', style: 'popular' },
  variants: { hero: 'B', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'MenuPreview', 'About', 'Gallery', 'CTA', 'Footer']],
    ['/cardapio', 'Cardápio', ['Header', 'HeroSimple', 'MenuFull', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Padaria Pão Quente',
    slogan: 'Pão fresco todos os dias, desde 1985',
    about: 'Padaria tradicional com pães artesanais, bolos, salgados e café da manhã completo.',
    segment: 'Padaria',
    city: 'Belo Horizonte',
  },
};

const academia: Template = {
  slug: 'academia',
  name: 'Academia',
  category: 'comercio',
  segment: 'academia',
  description: 'Academias, studios de pilates e crossfit.',
  thumb: IMG.gym,
  defaultTheme: { primary: '#0f172a', secondary: '#1e293b', accent: '#22c55e', style: 'moderno' },
  variants: { hero: 'C', header: 'centered-dark', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Stats', 'Testimonials', 'CTA', 'Footer']],
    ['/modalidades', 'Modalidades', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Academia Movimento',
    slogan: 'Seu corpo, sua melhor versão',
    about: 'Academia completa com musculação, aulas coletivas, crossfit e personal training. Estrutura moderna e equipamentos novos.',
    segment: 'Academia',
    city: 'São Paulo',
  },
};

const petShop: Template = {
  slug: 'pet-shop',
  name: 'Pet Shop',
  category: 'comercio',
  segment: 'petshop',
  description: 'Pet shops, banho e tosa, veterinária.',
  thumb: IMG.petshop,
  defaultTheme: { primary: '#0d9488', secondary: '#042f2e', accent: '#fb923c', style: 'popular' },
  variants: { hero: 'B', header: 'centered', footer: 'simple' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Gallery', 'Testimonials', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/produtos', 'Produtos', ['Header', 'HeroSimple', 'Products', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Pet Shop Amigo Fiel',
    slogan: 'Cuidando do seu pet com amor',
    about: 'Pet shop completo com banho, tosa, veterinária e produtos. Ambiente climatizado e equipe especializada.',
    segment: 'Pet Shop',
    city: 'Porto Alegre',
  },
};

const fotografo: Template = {
  slug: 'fotografo',
  name: 'Fotógrafo',
  category: 'comercio',
  segment: 'fotografo',
  description: 'Fotógrafos profissionais e estúdios.',
  thumb: IMG.photographer,
  defaultTheme: { primary: '#18181b', secondary: '#000000', accent: '#f59e0b', style: 'elegante' },
  variants: { hero: 'G', header: 'minimal-dark', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Gallery', 'About', 'Services', 'CTA', 'Footer']],
    ['/portfolio', 'Portfólio', ['Header', 'HeroSimple', 'Gallery', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Estúdio Luz Natural',
    slogan: 'Fotografia autoral com luz e emoção',
    about: 'Fotógrafo especializado em casamentos, ensaios pessoais e eventos corporativos. Linguagem autoral e direção de arte.',
    segment: 'Fotografia',
    city: 'Rio de Janeiro',
  },
};

// ─────────────────────────────────────────────────────────────────
// PROFISSIONAIS LIBERAIS (5)
// ─────────────────────────────────────────────────────────────────

const advogado: Template = {
  slug: 'advogado',
  name: 'Advogado Autônomo',
  category: 'profissionais',
  segment: 'advocacia',
  description: 'Advogados autônomos e bancas pequenas.',
  thumb: IMG.lawyer,
  defaultTheme: { primary: '#0c0a09', secondary: '#1c1917', accent: '#a16207', style: 'premium' },
  variants: { hero: 'A', header: 'centered-dark', footer: 'premium' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'FAQ', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/areas', 'Áreas', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Dr. Marcelo Saldanha',
    slogan: 'Advocacia técnica e dedicada',
    about: 'Advocacia especializada em direito civil, contratos e família. Atendimento personalizado e sigilo profissional.',
    segment: 'Advocacia',
    city: 'Belo Horizonte',
  },
};

const contador: Template = {
  slug: 'contador',
  name: 'Contador',
  category: 'profissionais',
  segment: 'contabilidade',
  description: 'Escritórios de contabilidade.',
  thumb: IMG.accountant,
  defaultTheme: { primary: '#0f766e', secondary: '#042f2e', accent: '#fbbf24', style: 'corporativo' },
  variants: { hero: 'B', header: 'centered', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Map', 'Footer']],
  ]),
  preset: {
    company: 'Contábil Andrade',
    slogan: 'Contabilidade estratégica para PME',
    about: 'Escritório contábil focado em pequenas e médias empresas. Planejamento tributário, folha e auditoria.',
    segment: 'Contabilidade',
    city: 'Curitiba',
  },
};

const corretor: Template = {
  slug: 'corretor',
  name: 'Corretor de Imóveis',
  category: 'profissionais',
  segment: 'corretor',
  description: 'Corretores autônomos e pequenos portfólios.',
  thumb: IMG.broker,
  defaultTheme: { primary: '#1e3a8a', secondary: '#172554', accent: '#d4af37', style: 'corporativo' },
  variants: { hero: 'F', header: 'split', footer: 'corporate' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Properties', 'About', 'Testimonials', 'CTA', 'Footer']],
    ['/imoveis', 'Imóveis', ['Header', 'HeroSimple', 'PropertyList', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Maria Helena Imóveis',
    slogan: 'Especialista em imóveis residenciais',
    about: 'Corretora com 15 anos de experiência no mercado imobiliário. Atendimento personalizado em toda a região.',
    segment: 'Corretagem',
    city: 'Florianópolis',
  },
};

const personalTrainer: Template = {
  slug: 'personal-trainer',
  name: 'Personal Trainer',
  category: 'profissionais',
  segment: 'personal',
  description: 'Personal trainers e consultorias fitness.',
  thumb: IMG.trainer,
  defaultTheme: { primary: '#0f172a', secondary: '#1e293b', accent: '#22c55e', style: 'moderno' },
  variants: { hero: 'C', header: 'centered-dark', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Testimonials', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Coach Bruno Lima',
    slogan: 'Treinos que cabem na sua rotina',
    about: 'Personal trainer com formação em educação física. Atendimento presencial e online, planos personalizados.',
    segment: 'Personal Training',
    city: 'Rio de Janeiro',
  },
};

const consultor: Template = {
  slug: 'consultor',
  name: 'Consultor / Autônomo',
  category: 'profissionais',
  segment: 'consultor',
  description: 'Consultores e profissionais autônomos.',
  thumb: IMG.consultant,
  defaultTheme: { primary: '#1e293b', secondary: '#0f172a', accent: '#0ea5e9', style: 'elegante' },
  variants: { hero: 'A', header: 'split', footer: 'minimal' },
  pages: buildPages([
    ['/', 'Início', ['Header', 'Hero', 'Services', 'About', 'Differentials', 'Testimonials', 'FAQ', 'CTA', 'Footer']],
    ['/sobre', 'Sobre', ['Header', 'HeroSimple', 'About', 'CTA', 'Footer']],
    ['/servicos', 'Serviços', ['Header', 'HeroSimple', 'Services', 'CTA', 'Footer']],
    ['/artigos', 'Artigos', ['Header', 'HeroSimple', 'BlogList', 'CTA', 'Footer']],
    ['/contato', 'Contato', ['Header', 'HeroSimple', 'Contact', 'Footer']],
  ]),
  preset: {
    company: 'Consultoria Estratégica Lima',
    slogan: 'Decisões melhores para empresas reais',
    about: 'Consultoria empresarial em estratégia, operações e finanças. Atendimento para médias empresas e startups em crescimento.',
    segment: 'Consultoria',
    city: 'São Paulo',
  },
};

// ─────────────────────────────────────────────────────────────────
// Registry — 30 templates
// ─────────────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  // INSTITUCIONAL (8)
  empresaCorporativa, empresaModerna, empresaPremium, industria,
  construtora, startup, empresaLocal, escritorioAdvocacia,
  // SERVIÇOS (10)
  clinicaMedica, odontologia, estetica, eletricista, encanador,
  mecanica, assistenciaTecnica, agenciaMarketing, limpeza, imobiliaria,
  // COMÉRCIO (7)
  loja, restaurante, pizzaria, padaria, academia, petShop, fotografo,
  // PROFISSIONAIS (5)
  advogado, contador, corretor, personalTrainer, consultor,
];

export const CATEGORIES = [
  { id: 'institucional', name: 'Institucional' },
  { id: 'servicos', name: 'Serviços' },
  { id: 'comercio', name: 'Comércio' },
  { id: 'profissionais', name: 'Profissionais Liberais' },
] as const;

export function getTemplate(slug: string): Template | undefined {
  return TEMPLATES.find(t => t.slug === slug);
}

export function getTemplatesByCategory(cat: string): Template[] {
  if (cat === 'all') return TEMPLATES;
  return TEMPLATES.filter(t => t.category === cat);
}
