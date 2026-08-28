/**
 * Content packs por template.
 *
 * Cada entrada define personalidade visual e textual única:
 * - paleta (primary/secondary/accent)
 * - hero (eyebrow, title, subtitle, CTA, image)
 * - serviços / diferenciais / stats / FAQ / depoimentos / time
 * - footer info
 *
 * Imagens: Unsplash (URL com params para tamanho). Se quebrar, o editor
 * permite trocar.
 */

export type ServiceItem = { icon: string; name: string; desc: string };
export type DiffItem = { name: string; desc: string };
export type TestimonialItem = { name: string; role?: string; text: string };
export type TeamItem = { name: string; role: string; photo?: string };
export type StatItem = { value: string; label: string };
export type FAQItem = { q: string; a: string };
export type ProductItem = { name: string; price?: string; image?: string; desc?: string };
export type GalleryItem = { src: string; alt?: string };
export type HistoryItem = { year: string; text: string };

export interface HeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt?: string;
}

export interface PaletteConfig {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
}

export interface ContentPack {
  slug: string;
  tagline: string;
  palette: PaletteConfig;
  aboutText: string;
  hero: HeroConfig;
  services: ServiceItem[];
  differentials: DiffItem[];
  stats?: StatItem[];
  testimonials?: TestimonialItem[];
  team?: TeamItem[];
  faq?: FAQItem[];
  products?: ProductItem[];
  menu?: Array<{ name: string; price: string; desc?: string }>;
  gallery?: GalleryItem[];
  history?: HistoryItem[];
  ctaTitle: string;
  ctaLabel: string;
  address?: string;
  hours?: string;
  cnpj?: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  instagram?: string;
}

// helper: gera URL Unsplash com tamanho + crop
const unsplash = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const PACKS: Record<string, ContentPack> = {
  // ─────────────────────────────────────────────────────────────
  // INSTITUCIONAL
  // ─────────────────────────────────────────────────────────────
  'empresa-corporativa': {
    slug: 'empresa-corporativa',
    tagline: 'Consultoria estratégica para empresas que decidem crescer.',
    palette: { primary: '#0b2545', secondary: '#1d3557', accent: '#13315c', surface: '#f4f6fb' },
    hero: {
      eyebrow: 'Consultoria · Auditoria · Estratégia',
      title: 'Decisões melhores para empresas que não cabem mais no improviso.',
      subtitle: 'Há 18 anos apoiando grupos empresariais em governança, M&A e reestruturação financeira.',
      ctaLabel: 'Agendar diagnóstico',
      ctaHref: '#contato',
      image: unsplash('1664575196841-43ef7b9c40db'),
    },
    aboutText:
      'Somos uma consultoria boutique que combina finanças, estratégia e people & culture. Atendemos 12 dos 200 maiores grupos do Brasil com squads seniores e entregáveis prontos para o board.',
    services: [
      { icon: '📊', name: 'Consultoria estratégica', desc: 'Plano de 3-5 anos com metas trimestrais e OKRs por área.' },
      { icon: '🤝', name: 'M&A e due diligence', desc: 'Compra, venda, fusão e integração de empresas de médio e grande porte.' },
      { icon: '🧭', name: 'Governança corporativa', desc: 'Estruturação de conselho, comités e políticas de controle.' },
      { icon: '💼', name: 'Reestruturação financeira', desc: 'Renegociação de dívidas, capital de giro e turnaround operacional.' },
      { icon: '👥', name: 'People & cultura', desc: 'Diagnóstico cultural, desenho de organograma e plano sucessório.' },
      { icon: '📈', name: 'FP&A sob demanda', desc: 'Squads terceirizados de planejamento financeiro para o seu CFO.' },
    ],
    differentials: [
      { name: 'Sócios envolvidos', desc: 'Cada projeto tem sócio dedicado, não só no kick-off.' },
      { name: 'Squads seniores', desc: 'Profissionais com 12+ anos de mercado, sem staff júnior.' },
      { name: 'Entrega em 90 dias', desc: 'Roadmaps e quick wins em até 12 semanas.' },
      { name: 'Confidencialidade real', desc: 'NDA reforçado, sala-cofre e ambientes auditáveis.' },
    ],
    stats: [
      { value: 'R$ 4,2 bi', label: 'em transações assessoradas' },
      { value: '120+', label: 'projetos entregues' },
      { value: '98%', label: 'NPS de clientes' },
      { value: '18 anos', label: 'de mercado' },
    ],
    testimonials: [
      { name: 'Eduardo Saldanha', role: 'CEO, Grupo Minerva', text: 'O plano de turnaround deles nos tirou do vermelho em 11 meses. Recomendo de olhos fechados.' },
      { name: 'Patrícia Andrade', role: 'CFO, Vérios Holding', text: 'A equipe age como se fosse do nosso time. Linguagem executiva, sem enrolação.' },
      { name: 'Rodrigo Quintas', role: 'Conselheiro independente', text: 'Raridade no mercado: gente que entrega o que promete, no prazo, com qualidade.' },
    ],
    faq: [
      { q: 'Qual o tamanho mínimo de empresa que vocês atendem?', a: 'Faturamento anual a partir de R$ 50 milhões. Para empresas menores, indicamos parceiros.' },
      { q: 'Como funciona o modelo de fees?', a: 'Combinado: fee fixo mensal + variável por performance em alguns casos. Sempre detalhado no contrato.' },
      { q: 'Atendem fora do Brasil?', a: 'Sim, somos fortes em LATAM, com projetos nos EUA, Portugal e Angola.' },
    ],
    ctaTitle: 'Pronto para o próximo nível?',
    ctaLabel: 'Marcar reunião',
    whatsapp: '5511999001100',
    phone: '(11) 4002-8900',
    email: 'contato@empresacorporativa.com.br',
    address: 'Av. Faria Lima, 3729 — Itaim Bibi, São Paulo/SP',
    hours: 'Seg–Sex, 8h–19h',
    cnpj: '12.345.678/0001-90',
    instagram: 'https://instagram.com/empresacorporativa',
  },

  'empresa-moderna': {
    slug: 'empresa-moderna',
    tagline: 'SaaS B2B para automatizar o que o seu time ainda faz no braço.',
    palette: { primary: '#0f172a', secondary: '#7c5cff', accent: '#7c5cff', surface: '#f7f7fb' },
    hero: {
      eyebrow: 'Plataforma SaaS · API first',
      title: 'Automatize processos. Escale times. Sem planilha.',
      subtitle: 'Conecte 200+ ferramentas, dispare fluxos com IA e entregue em horas o que levava semanas.',
      ctaLabel: 'Testar grátis por 14 dias',
      ctaHref: '#contato',
      image: unsplash('1551434678-e076c223a692'),
    },
    aboutText:
      'Pipelines de IA, integrações nativas e dashboards prontos. Mais de 3.200 times no Brasil e LATAM já automatizaram fluxos críticos com a gente.',
    services: [
      { icon: '⚡', name: 'Automações no-code', desc: 'Construtor visual com 600+ blocos prontos para uso.' },
      { icon: '🧠', name: 'IA para times operacionais', desc: 'Agentes que lêem e respondem e-mails, tickets e CRM 24/7.' },
      { icon: '🔌', name: 'API e webhooks', desc: 'API REST robusta, webhooks idempotentes e SDKs em 6 linguagens.' },
      { icon: '🗂️', name: 'Integrações nativas', desc: 'Slack, Notion, Salesforce, HubSpot, Pipedrive, RD e +200.' },
      { icon: '📊', name: 'Analytics em tempo real', desc: 'Dashboards prontos + Looker, Metabase e Power BI.' },
      { icon: '🔐', name: 'SSO e segurança', desc: 'SAML, OIDC, SCIM, audit log, LGPD e SOC 2 tipo II.' },
    ],
    differentials: [
      { name: 'Onboarding em 7 dias', desc: 'Time de sucesso entra junto na primeira semana.' },
      { name: 'SLA de 99,98%', desc: 'Status público, com histórico de 36 meses.' },
      { name: 'IA explicável', desc: 'Você vê o que o agente pensou antes de responder.' },
      { name: 'Sem lock-in', desc: 'Exporte seus dados a qualquer momento em JSON/CSV.' },
    ],
    stats: [
      { value: '3.200+', label: 'empresas ativas' },
      { value: '38 mi', label: 'automações/mês' },
      { value: '99,98%', label: 'uptime' },
      { value: '4,8/5', label: 'G2 Crowd' },
    ],
    testimonials: [
      { name: 'Camila Borges', role: 'Head of Ops, Loggi', text: 'Tiramos 4 pessoas de planilha e botamos pra pensar estratégia. ROI em 47 dias.' },
      { name: 'Felipe Yamamoto', role: 'CTO, Conta Azul', text: 'A melhor decisão de stack que tomamos em 2025. Integra com tudo que a gente usa.' },
    ],
    faq: [
      { q: 'Tem plano free?', a: 'Sim, com até 3 usuários e 1.000 execuções/mês. Sem cartão de crédito.' },
      { q: 'Como funciona o trial de 14 dias?', a: 'Acesso completo ao plano Pro. Se gostar, escolhe o plano. Se não, exporta tudo e sai.' },
      { q: 'Vocês fazem implementação?', a: 'Sim, com partners certificados. Custo separado, sob orçamento.' },
    ],
    ctaTitle: 'Comece grátis em 5 minutos',
    ctaLabel: 'Criar conta grátis',
    whatsapp: '5511988776655',
    phone: '(11) 3003-2025',
    email: 'oi@empresamoderna.com',
    address: 'Rua Capote Valente, 671 — Pinheiros, São Paulo/SP',
    hours: 'Suporte 24/7',
    instagram: 'https://instagram.com/empresamoderna',
  },

  'empresa-premium': {
    slug: 'empresa-premium',
    tagline: 'Curadoria de viagens, gastronomia e experiências singulares.',
    palette: { primary: '#1c1917', secondary: '#a16207', accent: '#d4af37', surface: '#faf7f0' },
    hero: {
      eyebrow: 'Curadoria · Concierge · Experiências',
      title: 'Para quem não procura — escolhe.',
      subtitle: 'Roteiros sob medida, acesso a lugares fechados e detalhes que fazem a diferença.',
      ctaLabel: 'Solicitar proposta',
      ctaHref: '#contato',
      image: unsplash('1564501049412-61c2a3083791'),
    },
    aboutText:
      'Atendemos 240 famílias e executivos C-level com viagens desenhadas do zero. Roteiros em 6 continentes, parceria com hotéis Relais & Châteaux, Aman e Rosewood.',
    services: [
      { icon: '✈️', name: 'Roteiros sob medida', desc: 'Viagens desenhadas a partir do seu gosto, agenda e ritmo.' },
      { icon: '🥂', name: 'Eventos privados', desc: 'Aniversários, casamentos e reuniões de família em lugares únicos.' },
      { icon: '🏨', name: 'Hotelaria premium', desc: 'Tarifas negociadas e upgrades em 4.500 hotéis no mundo.' },
      { icon: '🛥️', name: 'Iates e jets', desc: 'Fretamento com curadoria, gestão total da logística.' },
      { icon: '🍾', name: 'Gastronomia Michelin', desc: 'Reservas em restaurantes disputados, com cardápio sob medida.' },
      { icon: '🛡️', name: 'Concierge 24/7', desc: 'Time disponível em qualquer fuso, por WhatsApp ou telefone.' },
    ],
    differentials: [
      { name: 'Curadores seniores', desc: 'Profissionais com 15+ anos em hotelaria e turismo de luxo.' },
      { name: 'Acesso exclusivo', desc: 'Lugares fechados ao público geral e visitas after-hours.' },
      { name: 'Discrição absoluta', desc: 'NDA reforçado e gestão de privacidade em todas as entregas.' },
    ],
    stats: [
      { value: '240', label: 'clientes ativos' },
      { value: '52', label: 'países atendidos' },
      { value: '12 anos', label: 'de história' },
      { value: '4.500', label: 'hotéis parceiros' },
    ],
    testimonials: [
      { name: 'Família Tavares', role: 'Clientes desde 2018', text: 'A viagem à Patagônia que eles montaram mudou o que a gente entende por旅行.' },
      { name: 'Joana Mendes', role: 'CEO, holding familiar', text: 'Profissionalismo raro. Cada detalhe cuidado, do transfer ao menu do jantar.' },
    ],
    ctaTitle: 'Sua próxima viagem começa aqui',
    ctaLabel: 'Falar com curador',
    whatsapp: '5511982009988',
    phone: '(11) 3068-4040',
    email: 'concierge@empresapremium.com.br',
    address: 'Alameda Lorena, 1820 — Jardins, São Paulo/SP',
    hours: 'Concierge 24/7',
    instagram: 'https://instagram.com/empresapremium',
  },

  'industria': {
    slug: 'industria',
    tagline: 'Soluções industriais em metal-mecânica, automação e usinagem.',
    palette: { primary: '#0f172a', secondary: '#475569', accent: '#f97316', surface: '#f1f5f9' },
    hero: {
      eyebrow: 'Metal-mecânica · Usinagem · Automação',
      title: 'Da usinagem de precisão à linha de produção automatizada.',
      subtitle: '32 anos fornecendo peças e equipamentos para os setores automotivo, agro e energia.',
      ctaLabel: 'Pedir orçamento técnico',
      ctaHref: '#contato',
      image: unsplash('1581094288338-2314dddb7ece'),
    },
    aboutText:
      'Parque fabril de 14.000 m² com 78 máquinas CNC, célula robotizada e equipe de 240 colaboradores. Atendemos multinacionais com tolerâncias de até 0,005 mm.',
    services: [
      { icon: '⚙️', name: 'Usinagem CNC', desc: 'Torno, fresa e centro de usinagem 5 eixos com tolerância de 0,005 mm.' },
      { icon: '🤖', name: 'Automação industrial', desc: 'Células robotizadas, integração com CLP e projetos turnkey.' },
      { icon: '🏗️', name: 'Caldeiraria pesada', desc: 'Estruturas metálicas, tanques e vasos de pressão com certificação ASME.' },
      { icon: '🔬', name: 'Metrologia', desc: 'Braço de medição 3D, MMC e ensaios não destrutivos.' },
      { icon: '🛠️', name: 'Manutenção industrial', desc: 'Contratos preventivos, preditivos e corretivos 24/7.' },
      { icon: '📐', name: 'Engenharia sob medida', desc: 'Projeto, prototipagem e serialização de peças especiais.' },
    ],
    differentials: [
      { name: 'ISO 9001 e IATF 16949', desc: 'Certificações auditadas anualmente.' },
      { name: 'Capacidade ociosa', desc: '30% de capacidade disponível para pedidos rápidos.' },
      { name: 'Time técnico próprio', desc: 'Engenheiros e projetistas, sem terceirização.' },
    ],
    stats: [
      { value: '32 anos', label: 'no mercado' },
      { value: '14.000 m²', label: 'de parque fabril' },
      { value: '240', label: 'colaboradores' },
      { value: '78', label: 'máquinas CNC' },
    ],
    ctaTitle: 'Cotação em até 24h úteis',
    ctaLabel: 'Enviar desenho técnico',
    whatsapp: '5511940001100',
    phone: '(11) 4525-9090',
    email: 'vendas@industriaalpha.com.br',
    address: 'Rod. Anhanguera, km 122 — Sumaré/SP',
    hours: 'Seg–Sáb, 6h–22h',
    instagram: 'https://instagram.com/industriaalpha',
  },

  'construtora': {
    slug: 'construtora',
    tagline: 'Construtora e incorporadora de alto padrão em São Paulo.',
    palette: { primary: '#0b1320', secondary: '#92400e', accent: '#b45309', surface: '#fdf6ec' },
    hero: {
      eyebrow: 'Incorporação · Construção · Entrega',
      title: 'Apartamentos prontos e na planta em regiões nobres de São Paulo.',
      subtitle: '47 edifícios entregues, 12 em obra, R$ 2,1 bi em VGV nos últimos 5 anos.',
      ctaLabel: 'Ver empreendimentos',
      ctaHref: '#produtos',
      image: unsplash('1545324418-cc1a3fa10c00'),
    },
    aboutText:
      'Incorporamos e construímos empreendimentos residenciais e corporativos em São Paulo, com foco em qualidade construtiva, prazo cumprido e arquitetura contemporânea.',
    services: [
      { icon: '🏗️', name: 'Incorporação', desc: 'Estudo de viabilidade, projeto e registro de incorporação.' },
      { icon: '🏢', name: 'Construção civil', desc: 'Obras residenciais, corporativas e retrofit.' },
      { icon: '📐', name: 'Projetos arquitetônicos', desc: 'Escritório próprio com 22 arquitetos.' },
      { icon: '🔑', name: 'Gestão da entrega', desc: 'Acompanhamento pós-obra e habite-se assistido.' },
      { icon: '💼', name: 'Investimento imobiliário', desc: 'Análise de viabilidade para investidores.' },
    ],
    differentials: [
      { name: 'Prazo cumprido', desc: '97% dos empreendimentos entregues no prazo contratado.' },
      { name: 'Acabamento premium', desc: 'Materiais importados e mão de obra própria.' },
      { name: 'Garantia de 5 anos', desc: 'Assistência técnica estendida após a entrega.' },
    ],
    stats: [
      { value: '47', label: 'edifícios entregues' },
      { value: '12', label: 'em obra' },
      { value: 'R$ 2,1 bi', label: 'em VGV' },
      { value: '22 anos', label: 'de mercado' },
    ],
    products: [
      { name: 'Residencial Bela Vista', price: 'R$ 4,2 mi', desc: '4 suítes, 220 m², lazer completo.', image: unsplash('1600585154340-be6161a56a0c', 800, 600) },
      { name: 'Edifício Jardins', price: 'R$ 6,8 mi', desc: 'Cobertura duplex, 380 m², terraço gourmet.', image: unsplash('1600596542815-ffad4c1539a9', 800, 600) },
      { name: 'Studio Pinheiros', price: 'R$ 1,2 mi', desc: 'Studio, 42 m², ideal para investidor.', image: unsplash('1502672260266-1c1ef2d93688', 800, 600) },
    ],
    ctaTitle: 'Quer conhecer um lançamento?',
    ctaLabel: 'Agendar visita',
    whatsapp: '5511950002200',
    phone: '(11) 3061-7700',
    email: 'vendas@construtorabela.com.br',
    address: 'Av. Brigadeiro Faria Lima, 3477 — Itaim Bibi, São Paulo/SP',
    hours: 'Plantão de vendas todos os dias, 9h–20h',
    instagram: 'https://instagram.com/construtorabela',
  },

  'startup': {
    slug: 'startup',
    tagline: 'Plataforma de IA para previsibilidade de receita em PMEs.',
    palette: { primary: '#1a0b2e', secondary: '#7c3aed', accent: '#db2777', surface: '#fdf4ff' },
    hero: {
      eyebrow: 'IA · Revenue · PMEs',
      title: 'Previsão de receita que cabe no seu ERP.',
      subtitle: 'IA que aprende com seu histórico e devolve cenários de fechamento em 3 cliques.',
      ctaLabel: 'Solicitar demo',
      ctaHref: '#contato',
      image: unsplash('1559136555-9303baea8ebd'),
    },
    aboutText:
      'Fundada em 2023, somos 38 pessoas apaixonadas por finanças corporativas. Atendemos 480 PMEs no Brasil e México, com ARR de R$ 18 mi.',
    services: [
      { icon: '🤖', name: 'IA preditiva', desc: 'Modelos treinados em +12 mil PMEs brasileiras.' },
      { icon: '📊', name: 'Cenários automáticos', desc: 'Bear, base e bull case gerados em tempo real.' },
      { icon: '🔌', name: 'Plug & play ERP', desc: 'Integração nativa com Omie, Conta Azul, QuickBooks.' },
      { icon: '📱', name: 'Mobile CFO', desc: 'Acompanhe seu negócio pelo celular, com alertas.' },
    ],
    differentials: [
      { name: 'Implementação em 7 dias', desc: 'Conexão com seu ERP e primeira previsão em uma semana.' },
      { name: 'Sem troca de ERP', desc: 'Não pedimos para trocar de sistema. Integramos onde você já está.' },
      { name: 'IA explicável', desc: 'Cada previsão vem com o racional e os drivers.' },
    ],
    stats: [
      { value: '480', label: 'PMEs ativas' },
      { value: 'R$ 18 mi', label: 'ARR' },
      { value: '38', label: 'pessoas no time' },
      { value: '4,9/5', label: 'satisfação' },
    ],
    ctaTitle: 'Veja sua próxima previsão em 7 dias',
    ctaLabel: 'Agendar demo',
    whatsapp: '5511933004477',
    phone: '(11) 4000-3030',
    email: 'ola@startupia.com.br',
    address: 'WeWork — Av. Paulista, 1374, São Paulo/SP',
    hours: 'Seg–Sex, 9h–19h',
    instagram: 'https://instagram.com/startupia',
  },

  'empresa-local': {
    slug: 'empresa-local',
    tagline: 'Padaria e confeitaria artesanal no coração do bairro.',
    palette: { primary: '#0f3a3a', secondary: '#0d9488', accent: '#0d9488', surface: '#f0fdfa' },
    hero: {
      eyebrow: 'Padaria · Confeitaria · Café',
      title: 'Pão quentinho todo dia, das 6h às 22h.',
      subtitle: 'Tradição familiar desde 1987. Mais de 80 itens entre pães, bolos e salgados.',
      ctaLabel: 'Ver cardápio',
      ctaHref: '#cardapio',
      image: unsplash('1509440159596-0249088772ff'),
    },
    aboutText:
      'Três gerações da família Ferreira no comando. Forno a lenha, fermentação natural e ingredientes selecionados. Delivery e encomendas para festas.',
    services: [
      { icon: '🥖', name: 'Pães artesanais', desc: 'Forno a lenha, fermentação natural de 24h.' },
      { icon: '🎂', name: 'Bolos sob encomenda', desc: 'Aniversários, casamentos e eventos corporativos.' },
      { icon: '☕', name: 'Café da manhã', desc: 'Servimos das 6h às 11h com combo completo.' },
      { icon: '🚗', name: 'Delivery', desc: 'Entrega em até 40 minutos num raio de 5 km.' },
    ],
    differentials: [
      { name: 'Aberto todos os dias', desc: 'Das 6h às 22h, inclusive feriados.' },
      { name: 'Sem conservantes', desc: 'Produção diária, sem aditivos químicos.' },
      { name: 'Forno a lenha', desc: 'Sabor que só a lenha dá.' },
    ],
    menu: [
      { name: 'Pão francês (un)', price: 'R$ 1,20' },
      { name: 'Pão de queijo (un)', price: 'R$ 3,50' },
      { name: 'Bolo de cenoura (fatia)', price: 'R$ 9,00' },
      { name: 'Coxinha (un)', price: 'R$ 6,50' },
      { name: 'Pão caseiro (1 kg)', price: 'R$ 28,00' },
      { name: 'Torta de frango (inteira)', price: 'R$ 85,00' },
    ],
    ctaTitle: 'Faça sua encomenda',
    ctaLabel: 'Pedir no WhatsApp',
    whatsapp: '5511982005566',
    phone: '(11) 2233-1010',
    email: 'oi@padariabairro.com.br',
    address: 'Rua das Flores, 230 — Centro, São Paulo/SP',
    hours: 'Todos os dias, 6h–22h',
    instagram: 'https://instagram.com/padariabairro',
  },

  'escritorio-advocacia': {
    slug: 'escritorio-advocacia',
    tagline: 'Advocacia estratégica para empresas e pessoas físicas.',
    palette: { primary: '#1c0a2e', secondary: '#581c87', accent: '#a855f7', surface: '#faf5ff' },
    hero: {
      eyebrow: 'Direito Empresarial · Tributário · Trabalhista',
      title: 'Assessoria jurídica de alto nível para empresas que decidem crescer.',
      subtitle: '38 advogados especializados, 14 áreas de atuação, 18 anos de mercado.',
      ctaLabel: 'Agendar consulta',
      ctaHref: '#contato',
      image: unsplash('1589829545856-d10d557cf95f'),
    },
    aboutText:
      'Somos um escritório full service com forte atuação em M&A, direito tributário e contencioso estratégico. Atendemos grupos de médio e grande porte, com clientes nos 26 estados e DF.',
    services: [
      { icon: '🏛️', name: 'Direito empresarial', desc: 'Contratos, societário, M&A e governança.' },
      { icon: '💰', name: 'Direito tributário', desc: 'Planejamento, contencioso e recuperação de créditos.' },
      { icon: '👔', name: 'Direito do trabalho', desc: 'Consultivo, contencioso e negociação sindical.' },
      { icon: '🌐', name: 'Direito digital', desc: 'LGPD, cibersegurança e contratos de tecnologia.' },
      { icon: '🏘️', name: 'Direito imobiliário', desc: 'Due diligence, contratos e regularização.' },
      { icon: '⚖️', name: 'Contencioso estratégico', desc: 'Atuação em tribunais superiores e STJ.' },
    ],
    differentials: [
      { name: 'Sócios acessíveis', desc: 'Cada cliente tem um sócio de referência.' },
      { name: 'Time multidisciplinar', desc: '14 áreas de atuação coordenadas em um só lugar.' },
      { name: 'Honorários claros', desc: 'Tabela pública e orçamento em até 48h.' },
    ],
    stats: [
      { value: '38', label: 'advogados' },
      { value: '14', label: 'áreas' },
      { value: '1.200+', label: 'casos ativos' },
      { value: '18 anos', label: 'de mercado' },
    ],
    testimonials: [
      { name: 'Marcos Oliveira', role: 'CEO, Grupo A', text: 'Profissionais sérios, resposta rápida. Sentimos que somos prioridade.' },
      { name: 'Renata Vilas-Boas', role: 'Diretora jurídica, holding', text: 'Excelência técnica e olhar estratégico. Recomendo.' },
    ],
    ctaTitle: 'Fale com um especialista',
    ctaLabel: 'Agendar consulta',
    whatsapp: '5511950007733',
    phone: '(11) 3218-9090',
    email: 'contato@escritorioadv.com.br',
    address: 'Av. Paulista, 1009 — Bela Vista, São Paulo/SP',
    hours: 'Seg–Sex, 8h–19h',
    instagram: 'https://instagram.com/escritorioadv',
  },

  // ─────────────────────────────────────────────────────────────
  // SERVIÇOS
  // ─────────────────────────────────────────────────────────────
  'clinica-medica': {
    slug: 'clinica-medica',
    tagline: 'Clínica médica multidisciplinar com atendimento humanizado.',
    palette: { primary: '#0c4a6e', secondary: '#0891b2', accent: '#0891b2', surface: '#f0f9ff' },
    hero: {
      eyebrow: 'Clínica · Multidisciplinar · Convênios',
      title: 'Cuidar de você com tempo, técnica e empatia.',
      subtitle: '22 especialidades médicas, exames no local e agendamento online 24h.',
      ctaLabel: 'Agendar consulta',
      ctaHref: '#contato',
      image: unsplash('1576091160550-2173dba999ef'),
    },
    aboutText:
      'Mais de 38 médicos em 22 especialidades, com estrutura completa de exames e centro cirúrgico ambulatorial. Atendemos convênios e particular.',
    services: [
      { icon: '🩺', name: 'Clínica médica', desc: 'Consultas de rotina e check-up executivo.' },
      { icon: '❤️', name: 'Cardiologia', desc: 'Consultas, ECG, ecocardiograma e teste ergométrico.' },
      { icon: '👶', name: 'Pediatria', desc: 'Acompanhamento do recém-nascido à adolescência.' },
      { icon: '🦴', name: 'Ortopedia', desc: 'Consultas, infiltrações e tratamento conservador.' },
      { icon: '🧠', name: 'Neurologia', desc: 'Cefaleia, epilepsia, demência e doenças neuromusculares.' },
      { icon: '🔬', name: 'Exames laboratoriais', desc: 'Coleta no local com resultado em até 24h.' },
    ],
    differentials: [
      { name: 'Agendamento online 24h', desc: 'Marque, remarque e cancele pelo site ou app.' },
      { name: 'Sem fila de espera', desc: 'Atendimento pontual com hora marcada.' },
      { name: 'Equipe multidisciplinar', desc: 'Discussão de casos entre especialistas.' },
    ],
    stats: [
      { value: '38', label: 'médicos' },
      { value: '22', label: 'especialidades' },
      { value: '120k+', label: 'pacientes atendidos' },
      { value: '12 anos', label: 'de história' },
    ],
    ctaTitle: 'Cuide de você hoje',
    ctaLabel: 'Marcar consulta',
    whatsapp: '5511988442233',
    phone: '(11) 4002-2002',
    email: 'agendamento@clinicamedica.com.br',
    address: 'Rua Augusta, 1500 — Consolação, São Paulo/SP',
    hours: 'Seg–Sex, 7h–21h · Sáb, 7h–13h',
    instagram: 'https://instagram.com/clinicamedica',
  },

  'odontologia': {
    slug: 'odontologia',
    tagline: 'Odontologia estética, implantes e ortodontia digital.',
    palette: { primary: '#0e7490', secondary: '#06b6d4', accent: '#06b6d4', surface: '#ecfeff' },
    hero: {
      eyebrow: 'Estética · Implantes · Ortodontia',
      title: 'Seu sorriso, redesenhado com tecnologia e cuidado.',
      subtitle: 'Escaneamento intraoral, planejamento 3D e sedação consciente para tratamentos sem dor.',
      ctaLabel: 'Avaliação gratuita',
      ctaHref: '#contato',
      image: unsplash('1606811971618-4486d14f3f99'),
    },
    aboutText:
      'Equipe de 12 dentistas em 9 especialidades, com tecnologia CAD/CAM, scanner 3D e centro de imagem próprio. Mais de 8.000 sorrisos atendidos.',
    services: [
      { icon: '🦷', name: 'Implantes dentários', desc: 'Implantes premium com garantia de 10 anos.' },
      { icon: '😁', name: 'Lentes de contato', desc: 'Sorriso perfeito em até 3 sessões.' },
      { icon: '🔧', name: 'Ortodontia invisível', desc: 'Alinhadores transparentes e discretos.' },
      { icon: '✨', name: 'Clareamento', desc: 'Clareamento a laser em consultório.' },
      { icon: '🛡️', name: 'Endodontia', desc: 'Tratamento de canal com microscopia.' },
      { icon: '👶', name: 'Odontopediatria', desc: 'Cuidado lúdico e preventivo para crianças.' },
    ],
    differentials: [
      { name: 'Avaliação gratuita', desc: 'Plano de tratamento detalhado sem custo.' },
      { name: 'Tecnologia 3D', desc: 'Scanner intraoral, sem moldeira desconfortável.' },
      { name: 'Sedação consciente', desc: 'Para pacientes com medo de dentista.' },
    ],
    ctaTitle: 'Marque sua avaliação',
    ctaLabel: 'Avaliação grátis',
    whatsapp: '5511933009988',
    phone: '(11) 3224-5566',
    email: 'contato@odontologia.com.br',
    address: 'Av. Brigadeiro, 2200 — Jardim Paulista, São Paulo/SP',
    hours: 'Seg–Sex, 8h–21h · Sáb, 8h–14h',
    instagram: 'https://instagram.com/odontologia',
  },

  'estetica': {
    slug: 'estetica',
    tagline: 'Estética avançada, skincare e bem-estar feminino.',
    palette: { primary: '#831843', secondary: '#ec4899', accent: '#ec4899', surface: '#fdf2f8' },
    hero: {
      eyebrow: 'Estética · Skincare · Bem-estar',
      title: 'Realce sua beleza com protocolos seguros e eficazes.',
      subtitle: 'Equipe de 14 especialistas, equipamentos de ponta e produtos dermatológicos.',
      ctaLabel: 'Reservar sessão',
      ctaHref: '#contato',
      image: unsplash('1571019613454-1cb2f99b2d8b'),
    },
    aboutText:
      'Mais de 12 mil procedimentos realizados em 8 anos. Trabalhamos com os melhores equipamentos do mercado e profissionais registradas em conselho.',
    services: [
      { icon: '💆', name: 'Limpezas de pele', desc: 'Protocolos para cada tipo de pele, com extração cuidadosa.' },
      { icon: '💉', name: 'Botox e preenchimento', desc: 'Aplicação com médica dermatologista.' },
      { icon: '✨', name: 'Peeling químico', desc: 'Renovação celular profunda, com ácido adequado.' },
      { icon: '🧖', name: 'Drenagem linfática', desc: 'Redução de medidas e retenção.' },
      { icon: '💎', name: 'Microagulhamento', desc: 'Estímulo de colágeno com dermaroller.' },
      { icon: '🧴', name: 'Skincare personalizado', desc: 'Protocolo montado para a sua pele.' },
    ],
    differentials: [
      { name: 'Profissionais registradas', desc: 'Equipe com CRF e conselho de classe ativo.' },
      { name: 'Equipamentos de ponta', desc: 'Aparelhos homologados pela ANVISA.' },
      { name: 'Sessão de avaliação', desc: 'Plano personalizado antes de qualquer procedimento.' },
    ],
    ctaTitle: 'Cuidar de si é prioridade',
    ctaLabel: 'Reservar avaliação',
    whatsapp: '5511977445588',
    phone: '(11) 3068-1212',
    email: 'agendamento@estetica.com.br',
    address: 'Rua Oscar Freire, 1900 — Pinheiros, São Paulo/SP',
    hours: 'Ter–Sáb, 9h–20h',
    instagram: 'https://instagram.com/estetica',
  },

  'eletricista': {
    slug: 'eletricista',
    tagline: 'Eletricista residencial e industrial 24h em São Paulo.',
    palette: { primary: '#0b1320', secondary: '#eab308', accent: '#eab308', surface: '#fefce8' },
    hero: {
      eyebrow: 'Elétrica · Residencial · Industrial',
      title: 'Atendimento 24h, com garantia e nota fiscal.',
      subtitle: 'Equipe certificada, orçamento sem compromisso e serviço no mesmo dia.',
      ctaLabel: 'Chamar agora',
      ctaHref: '#contato',
      image: unsplash('1621905252507-b35492cc74b4'),
    },
    aboutText:
      '8 anos no mercado, 12 eletricistas certificados e mais de 4.000 serviços realizados. Atendemos residencial, comercial e industrial.',
    services: [
      { icon: '🏠', name: 'Residencial', desc: 'Tomadas, chuveiros, fiação e quadros de distribuição.' },
      { icon: '🏢', name: 'Comercial', desc: 'Lojas, escritórios e galpões.' },
      { icon: '🏭', name: 'Industrial', desc: 'Cabines, painéis e automação.' },
      { icon: '⚡', name: 'Eficiência energética', desc: 'Laudo e plano de redução de consumo.' },
      { icon: '🚨', name: 'Emergência 24h', desc: 'Atendimento em até 60 minutos.' },
    ],
    differentials: [
      { name: 'Garantia de 90 dias', desc: 'Todos os serviços com garantia escrita.' },
      { name: 'Orçamento sem custo', desc: 'Visita técnica sem compromisso.' },
      { name: 'Pagamento facilitado', desc: 'Pix, cartão em até 6x ou boleto.' },
    ],
    ctaTitle: 'Resolvemos hoje',
    ctaLabel: 'Pedir orçamento',
    whatsapp: '5511940001010',
    phone: '(11) 4001-1010',
    email: 'contato@eletricista24h.com.br',
    address: 'Atendemos toda a Grande São Paulo',
    hours: '24 horas, 7 dias',
    instagram: 'https://instagram.com/eletricista24h',
  },

  'encanador': {
    slug: 'encanador',
    tagline: 'Encanamento, desentupimento e caça-vazamentos 24h.',
    palette: { primary: '#0c2340', secondary: '#2563eb', accent: '#2563eb', surface: '#eff6ff' },
    hero: {
      eyebrow: 'Encanamento · Desentupimento · Caça-vazamento',
      title: 'Vazamento, entupido ou emergência? Estamos a caminho.',
      subtitle: 'Chegada em até 60 minutos. Orçamento sem custo. Garantia de 90 dias.',
      ctaLabel: 'Pedir atendimento',
      ctaHref: '#contato',
      image: unsplash('1581244277943-fe4a9c777189'),
    },
    aboutText:
      'Mais de 22 mil atendimentos em 12 anos. Equipe de 18 encanadores, todos uniformizados e identificados. Atendemos residencial, comercial e condomínios.',
    services: [
      { icon: '🚰', name: 'Desentupimento', desc: 'Pia, vaso, ralo, coluna e rede de esgoto.' },
      { icon: '🔍', name: 'Caça-vazamento', desc: 'Tecnologia de ultrassom e gás traçador.' },
      { icon: '🚿', name: 'Reparos hidráulicos', desc: 'Torres, registros, válvulas e conexões.' },
      { icon: '🏢', name: 'Condomínios', desc: 'Plano mensal para gestão preventiva.' },
    ],
    differentials: [
      { name: '60 minutos', desc: 'Chegada em até 1h na região metropolitana.' },
      { name: 'Sem custo no orçamento', desc: 'Você só paga se aprovar.' },
      { name: 'Garantia escrita', desc: '90 dias para todos os serviços.' },
    ],
    ctaTitle: 'Emergência? Atendemos agora',
    ctaLabel: 'Chamar agora',
    whatsapp: '5511940002020',
    phone: '(11) 4002-2020',
    email: 'contato@encanador.com.br',
    address: 'Atendemos toda São Paulo capital e ABC',
    hours: '24 horas, 7 dias',
    instagram: 'https://instagram.com/encanador24h',
  },

  'mecanica': {
    slug: 'mecanica',
    tagline: 'Mecânica e auto center multimarca em São Paulo.',
    palette: { primary: '#0f172a', secondary: '#dc2626', accent: '#dc2626', surface: '#fef2f2' },
    hero: {
      eyebrow: 'Mecânica · Auto Center · Multimarca',
      title: 'Seu carro em mãos de quem entende.',
      subtitle: 'Diagnóstico eletrônico, mecânica geral e funilaria com orçamento transparente.',
      ctaLabel: 'Agendar revisão',
      ctaHref: '#contato',
      image: unsplash('1486006920555-c77dcf18193c'),
    },
    aboutText:
      '15 anos no mercado, equipe certificada e equipamentos de diagnóstico de última geração. Atendemos todas as marcas e modelos.',
    services: [
      { icon: '🔧', name: 'Revisão completa', desc: 'Troca de óleo, filtros, fluidos e checklist.' },
      { icon: '🛞', name: 'Alinhamento e balanceamento', desc: 'Equipamento computadorizado 3D.' },
      { icon: '⚙️', name: 'Motor e câmbio', desc: 'Reparo, retífica e troca.' },
      { icon: '🎨', name: 'Funilaria e pintura', desc: 'Cabine de pintura com estufa.' },
      { icon: '🔋', name: 'Elétrica e eletrônica', desc: 'Diagnóstico e reparo de módulos.' },
    ],
    differentials: [
      { name: 'Orçamento transparente', desc: 'Sem surpresas, com fotos do serviço.' },
      { name: 'Entrega no prazo', desc: 'Ou lavamos seu carro por nossa conta.' },
      { name: 'Garantia de 6 meses', desc: 'Para todos os serviços executados.' },
    ],
    ctaTitle: 'Agende sua revisão',
    ctaLabel: 'Reservar horário',
    whatsapp: '5511933003030',
    phone: '(11) 4003-3030',
    email: 'agendamento@mecanica.com.br',
    address: 'Av. Santo Amaro, 4500 — Brooklin, São Paulo/SP',
    hours: 'Seg–Sex, 8h–18h · Sáb, 8h–12h',
    instagram: 'https://instagram.com/mecanica',
  },

  'assistencia-tecnica': {
    slug: 'assistencia-tecnica',
    tagline: 'Assistência técnica especializada em smartphones e notebooks.',
    palette: { primary: '#0c2545', secondary: '#0ea5e9', accent: '#0ea5e9', surface: '#f0f9ff' },
    hero: {
      eyebrow: 'Smartphones · Notebooks · Tablets',
      title: 'Seu equipamento como novo, com peças originais.',
      subtitle: 'Diagnóstico em 30 minutos. Reparos com garantia de 90 dias.',
      ctaLabel: 'Trazer equipamento',
      ctaHref: '#contato',
      image: unsplash('1588508065123-287b28e013da'),
    },
    aboutText:
      'Mais de 18 mil aparelhos reparados em 8 anos. Somos assistência autorizada de 4 marcas e atendemos todas as outras com peças originais ou OEM de qualidade.',
    services: [
      { icon: '📱', name: 'Smartphones', desc: 'Troca de tela, bateria, conector de carga e mais.' },
      { icon: '💻', name: 'Notebooks', desc: 'Troca de tela, teclado, bateria, limpeza térmica.' },
      { icon: '🎮', name: 'Videogames', desc: 'PS5, Xbox, Nintendo Switch e muito mais.' },
      { icon: '💾', name: 'Recuperação de dados', desc: 'HDs, SSDs, pen drives e cartões SD.' },
    ],
    differentials: [
      { name: 'Diagnóstico em 30 min', desc: 'Avaliação rápida e orçamento sem custo.' },
      { name: 'Peças originais', desc: 'Garantia de procedência.' },
      { name: '90 dias de garantia', desc: 'Em todos os reparos.' },
    ],
    ctaTitle: 'Diagnóstico gratuito',
    ctaLabel: 'Trazer equipamento',
    whatsapp: '5511950004040',
    phone: '(11) 4004-4040',
    email: 'contato@assistencia.com.br',
    address: 'Rua Pamplona, 1200 — Jardins, São Paulo/SP',
    hours: 'Seg–Sex, 9h–19h · Sáb, 9h–14h',
    instagram: 'https://instagram.com/assistencia',
  },

  'agencia-marketing': {
    slug: 'agencia-marketing',
    tagline: 'Agência de marketing digital full service para marcas que querem crescer.',
    palette: { primary: '#1a0b2e', secondary: '#a855f7', accent: '#a855f7', surface: '#faf5ff' },
    hero: {
      eyebrow: 'Performance · Branding · Conteúdo',
      title: 'Marketing que gera receita, não só likes.',
      subtitle: 'Estratégia, mídia, conteúdo e tecnologia sob o mesmo teto. Mais de 240 clientes atendidos.',
      ctaLabel: 'Pedir proposta',
      ctaHref: '#contato',
      image: unsplash('1552664730-d307ca884978'),
    },
    aboutText:
      'Somos uma agência boutique com DNA de consultoria. Atendemos marcas como [confidenciais], com squads dedicados e relatórios mensais em tempo real.',
    services: [
      { icon: '📈', name: 'Performance', desc: 'Google Ads, Meta Ads, TikTok Ads e programática.' },
      { icon: '🎨', name: 'Branding', desc: 'Posicionamento, identidade visual e tom de voz.' },
      { icon: '✍️', name: 'Conteúdo', desc: 'Redes sociais, blog, e-mail marketing e SEO.' },
      { icon: '🤖', name: 'Marketing automation', desc: 'RD Station, HubSpot e ActiveCampaign.' },
      { icon: '📱', name: 'Apps e landing pages', desc: 'Desenvolvimento próprio, com foco em conversão.' },
    ],
    differentials: [
      { name: 'Squad dedicado', desc: 'Time exclusivo para o seu projeto.' },
      { name: 'Relatórios em tempo real', desc: 'Dashboard no Looker com KPIs atualizados.' },
      { name: 'Compromisso de resultado', desc: 'Meta de ROI alinhada em contrato.' },
    ],
    stats: [
      { value: '240+', label: 'clientes' },
      { value: 'R$ 480 mi', label: 'em mídia veiculada' },
      { value: '12 anos', label: 'no mercado' },
      { value: '4,8/5', label: 'NPS médio' },
    ],
    ctaTitle: 'Pronto para escalar?',
    ctaLabel: 'Pedir proposta',
    whatsapp: '5511960005050',
    phone: '(11) 4005-5050',
    email: 'contato@agenciamarketing.com.br',
    address: 'Av. Brigadeiro Faria Lima, 4221 — Itaim Bibi, São Paulo/SP',
    hours: 'Seg–Sex, 9h–19h',
    instagram: 'https://instagram.com/agenciamarketing',
  },

  'limpeza': {
    slug: 'limpeza',
    tagline: 'Diaristas, faxina e limpeza pós-obra em São Paulo.',
    palette: { primary: '#064e3b', secondary: '#10b981', accent: '#10b981', surface: '#ecfdf5' },
    hero: {
      eyebrow: 'Diaristas · Pós-obra · Empresarial',
      title: 'Limpeza profissional com equipe treinada e garantida.',
      subtitle: 'Agendamento online, equipe uniformizada e seguro contra danos.',
      ctaLabel: 'Reservar atendimento',
      ctaHref: '#contato',
      image: unsplash('1581578731548-c64695cc6952'),
    },
    aboutText:
      'Mais de 30 mil residências atendidas em 8 anos. Equipe feminina, treinada e com seguro de responsabilidade civil. Nota fiscal em todos os serviços.',
    services: [
      { icon: '🧹', name: 'Diaristas', desc: 'Faxina residencial com equipe treinada.' },
      { icon: '🏗️', name: 'Pós-obra', desc: 'Limpeza pesada após reforma ou mudança.' },
      { icon: '🏢', name: 'Empresarial', desc: 'Escritórios, clínicas e lojas.' },
      { icon: '🛋️', name: 'Estofados', desc: 'Higienização de sofás, colchões e carpetes.' },
    ],
    differentials: [
      { name: 'Equipe uniformizada', desc: 'Profissionais identificados e treinados.' },
      { name: 'Seguro incluso', desc: 'Cobertura de até R$ 50 mil.' },
      { name: 'Satisfação garantida', desc: 'Se não gostar, refazemos sem custo.' },
    ],
    ctaTitle: 'Reserva em 5 minutos',
    ctaLabel: 'Agendar agora',
    whatsapp: '5511970006060',
    phone: '(11) 4006-6060',
    email: 'agendamento@limpezaprofissional.com.br',
    address: 'Atendemos toda São Paulo capital',
    hours: 'Seg–Sáb, 7h–20h',
    instagram: 'https://instagram.com/limpezaprofissional',
  },

  'imobiliaria': {
    slug: 'imobiliaria',
    tagline: 'Imobiliária boutique para compra, venda e aluguel de alto padrão.',
    palette: { primary: '#0c3a4a', secondary: '#0891b2', accent: '#0891b2', surface: '#f0f9ff' },
    hero: {
      eyebrow: 'Compra · Venda · Aluguel',
      title: 'Imóveis selecionados, atendimento personalizado.',
      subtitle: 'Mais de 1.200 imóveis ativos, 240 transações fechadas em 2025.',
      ctaLabel: 'Buscar imóvel',
      ctaHref: '#produtos',
      image: unsplash('1560518883-ce09059eeffa'),
    },
    aboutText:
      'Atendemos clientes que buscam exclusividade. Carteira com imóveis em condomínios fechados, cobertura e alto padrão construtivo em São Paulo, Rio e litoral.',
    services: [
      { icon: '🏠', name: 'Compra e venda', desc: 'Assessoria completa do cadastro ao registro.' },
      { icon: '🔑', name: 'Aluguel de temporada', desc: 'Apartamentos mobiliados para temporada.' },
      { icon: '📋', name: 'Administração', desc: 'Gestão de aluguel com repasse e vistoria.' },
      { icon: '📑', name: 'Regularização', desc: 'Habite-se, ITBI e documentação.' },
    ],
    differentials: [
      { name: 'Carteira selecionada', desc: 'Só imóveis com avaliação técnica.' },
      { name: 'Corretor CRECI', desc: 'Todos os consultores com registro ativo.' },
      { name: 'Atendimento 1:1', desc: 'Consultor dedicado em toda a jornada.' },
    ],
    stats: [
      { value: '1.200+', label: 'imóveis ativos' },
      { value: '240', label: 'transações em 2025' },
      { value: '12 anos', label: 'no mercado' },
      { value: '4,9/5', label: 'NPS' },
    ],
    products: [
      { name: 'Cobertura Duplex — Jardins', price: 'R$ 9.800.000', desc: '4 suítes, 480 m², terraço com piscina.', image: unsplash('1600596542815-ffad4c1539a9', 800, 600) },
      { name: 'Apartamento — Vila Olímpia', price: 'R$ 4.200.000', desc: '3 dorms, 180 m², lazer completo.', image: unsplash('1600585154340-be6161a56a0c', 800, 600) },
      { name: 'Casa — Alphaville', price: 'R$ 6.500.000', desc: '5 suítes, 720 m², 4 vagas.', image: unsplash('1568605114967-8130f3a36994', 800, 600) },
    ],
    ctaTitle: 'Encontre seu imóvel',
    ctaLabel: 'Falar com corretor',
    whatsapp: '5511980007070',
    phone: '(11) 4007-7070',
    email: 'contato@imobiliaria.com.br',
    address: 'Rua Haddock Lobo, 595 — Cerqueira César, São Paulo/SP',
    hours: 'Seg–Sáb, 9h–20h',
    instagram: 'https://instagram.com/imobiliaria',
  },

  // ─────────────────────────────────────────────────────────────
  // COMÉRCIO
  // ─────────────────────────────────────────────────────────────
  'loja': {
    slug: 'loja',
    tagline: 'Loja de decoração e objetos com curadoria autoral.',
    palette: { primary: '#7c2d12', secondary: '#f97316', accent: '#f97316', surface: '#fff7ed' },
    hero: {
      eyebrow: 'Decoração · Autoral · Curadoria',
      title: 'Objetos com história, design e alma.',
      subtitle: 'Mais de 1.200 peças de 80 marcas autorais brasileiras e latino-americanas.',
      ctaLabel: 'Ver produtos',
      ctaHref: '#produtos',
      image: unsplash('1567538096630-e0c55bd6374c'),
    },
    aboutText:
      'Somos uma loja de bairro que virou referência. Fundada em 2014, trabalhamos com designers e artesãos para trazer peças únicas para sua casa.',
    services: [
      { icon: '🛋️', name: 'Móveis sob medida', desc: 'Marcenaria autoral com designers parceiros.' },
      { icon: '💡', name: 'Iluminação', desc: 'Luminárias assinadas e peças vintage restauradas.' },
      { icon: '🖼️', name: 'Arte e molduras', desc: 'Artistas plásticos brasileiros contemporâneos.' },
      { icon: '🌿', name: 'Plantas e vasos', desc: 'Curadoria de vasos e espécies raras.' },
    ],
    differentials: [
      { name: 'Curadoria autoral', desc: 'Só trabalhamos com designers e marcas independentes.' },
      { name: 'Entrega white-glove', desc: 'Equipe especializada em içar móveis grandes.' },
      { name: 'Garantia estendida', desc: '1 ano para defeitos de fabricação.' },
    ],
    products: [
      { name: 'Aparador Ipê', price: 'R$ 4.200', desc: 'Madeira maciça, 1,80 m.', image: unsplash('1555041469-a586c61ea9bc', 800, 600) },
      { name: 'Luminária Pendular', price: 'R$ 980', desc: 'Fibra natural, diâmetro 60 cm.', image: unsplash('1513506003901-1e6a229e2d15', 800, 600) },
      { name: 'Vaso Cerâmica Atacama', price: 'R$ 620', desc: 'Pintura manual, 50 cm de altura.', image: unsplash('1485955900006-10f4d324d411', 800, 600) },
    ],
    ctaTitle: 'Visite nossa loja',
    ctaLabel: 'Ver no mapa',
    whatsapp: '5511990008080',
    phone: '(11) 3068-8080',
    email: 'contato@lojadecor.com.br',
    address: 'Rua Aspicuelta, 412 — Vila Madalena, São Paulo/SP',
    hours: 'Ter–Sáb, 11h–20h · Dom, 12h–18h',
    instagram: 'https://instagram.com/lojadecor',
  },

  'restaurante': {
    slug: 'restaurante',
    tagline: 'Cozinha autoral brasileira com ingredientes do território.',
    palette: { primary: '#3f0a0a', secondary: '#dc2626', accent: '#dc2626', surface: '#fef2f2' },
    hero: {
      eyebrow: 'Restaurante · Cozinha autoral · Carta de vinhos',
      title: 'Brasil no prato, com técnica e afeto.',
      subtitle: 'Chef premiada, ingredientes do território e carta de 240 rótulos.',
      ctaLabel: 'Reservar mesa',
      ctaHref: '#contato',
      image: unsplash('1414235077428-338989a2e8c0'),
    },
    aboutText:
      'Restaurante com 12 anos de casa, à frente a chef Daniela Bertolucci. Foco em ingredientes brasileiros, produtores locais e fermentações naturais.',
    services: [
      { icon: '🍽️', name: 'Almoço e jantar', desc: 'Menu degustação de 5 tempos ou à la carte.' },
      { icon: '🥂', name: 'Eventos privados', desc: 'Salão para até 40 pessoas, com menu customizado.' },
      { icon: '🍷', name: 'Carta de vinhos', desc: '240 rótulos, com curadoria de sommelier.' },
      { icon: '🧑‍🍳', name: 'Curso de gastronomia', desc: 'Workshops mensais com a chef.' },
    ],
    differentials: [
      { name: 'Chef premiada', desc: 'Reconhecida pela Veja Comer & Beber 8 anos seguidos.' },
      { name: 'Carta de vinhos curada', desc: 'Sommelier dedicado e carta atualizada.' },
      { name: 'Sem fila', desc: 'Reserva online garantida.' },
    ],
    menu: [
      { name: 'Menu degustação 5 tempos', price: 'R$ 290' },
      { name: 'Bobó de camarão com farofa de dendê', price: 'R$ 96' },
      { name: 'Picanha maturada 30 dias', price: 'R$ 145' },
      { name: 'Risoto de cogumelos do Sul', price: 'R$ 110' },
      { name: 'Petit gâteau de cacau do Pará', price: 'R$ 52' },
    ],
    ctaTitle: 'Reserve sua mesa',
    ctaLabel: 'Reservar agora',
    whatsapp: '5511990009090',
    phone: '(11) 3088-9090',
    email: 'reservas@restaurante.com.br',
    address: 'Rua Bela Cintra, 2200 — Consolação, São Paulo/SP',
    hours: 'Ter–Sáb, 12h–15h · 19h–23h',
    instagram: 'https://instagram.com/restaurante',
  },

  'pizzaria': {
    slug: 'pizzaria',
    tagline: 'Pizzaria napolitana com fermentação de 72h.',
    palette: { primary: '#7c2d12', secondary: '#ea580c', accent: '#ea580c', surface: '#fff7ed' },
    hero: {
      eyebrow: 'Napolitana · Forno a lenha · 72h',
      title: 'A pizza napolitana como ela deve ser.',
      subtitle: 'Massa de fermentação natural, ingredientes italianos e forno a lenha a 480°C.',
      ctaLabel: 'Reservar mesa',
      ctaHref: '#contato',
      image: unsplash('1513104890138-7c749659a591'),
    },
    aboutText:
      'Pizzaria certificada pela Associazione Verace Pizza Napoletana. Forno a lenha importado da Itália, ingredientes DOP e 14 sabores no menu.',
    services: [
      { icon: '🍕', name: 'Pizzas napolitanas', desc: 'Massa de 72h, assada em 90 segundos.' },
      { icon: '🍷', name: 'Vinhos italianos', desc: 'Mais de 80 rótulos da Itália.' },
      { icon: '🚗', name: 'Delivery', desc: 'Pizzas entregues em até 40 min, ainda quentes.' },
      { icon: '🎂', name: 'Eventos', desc: 'Pizza party para até 30 pessoas.' },
    ],
    differentials: [
      { name: 'Forno a 480°C', desc: 'Forno a lenha Stefano Ferrara, da Itália.' },
      { name: 'Farinha italiana', desc: 'Tipo 00, importada da Campânia.' },
      { name: 'Certificação AVPN', desc: 'Siga as regras da Associazione Verace.' },
    ],
    menu: [
      { name: 'Margherita DOP', price: 'R$ 78' },
      { name: 'Marinara', price: 'R$ 68' },
      { name: 'Quattro Formaggi', price: 'R$ 92' },
      { name: 'Diavola', price: 'R$ 88' },
      { name: 'Tartufo Nero', price: 'R$ 145' },
    ],
    ctaTitle: 'Reservar para hoje',
    ctaLabel: 'Reservar mesa',
    whatsapp: '5511990010101',
    phone: '(11) 3088-1010',
    email: 'reservas@pizzaria.com.br',
    address: 'Rua Augusta, 2500 — Cerqueira César, São Paulo/SP',
    hours: 'Ter–Dom, 18h–00h',
    instagram: 'https://instagram.com/pizzaria',
  },

  'padaria': {
    slug: 'padaria',
    tagline: 'Padaria artesanal de fermentação natural.',
    palette: { primary: '#713f12', secondary: '#a16207', accent: '#a16207', surface: '#fefce8' },
    hero: {
      eyebrow: 'Padaria · Fermentação natural · Café',
      title: 'Pão de fermentação natural, do forno para a sua mesa.',
      subtitle: '22 tipos de pão, 18 variedades de bolo e café especial de microlotes.',
      ctaLabel: 'Ver cardápio',
      ctaHref: '#cardapio',
      image: unsplash('1517433367423-c7e5b0f35086'),
    },
    aboutText:
      'Mestre padeiro formado na França, fermentação natural de 36 horas, farinhas orgânicas. Padaria referência no bairro há 8 anos.',
    services: [
      { icon: '🥖', name: 'Pães artesanais', desc: 'Levain de 36 horas, farinhas orgânicas.' },
      { icon: '☕', name: 'Café especial', desc: 'Microlotes brasileiros, preparados na hora.' },
      { icon: '🎂', name: 'Bolos sob encomenda', desc: 'Sem açúcar, veganos e tradicionais.' },
      { icon: '🛵', name: 'Delivery', desc: 'Entrega em até 50 minutos no bairro.' },
    ],
    differentials: [
      { name: 'Farinha orgânica', desc: '100% farinha de moinho certificado.' },
      { name: 'Sem conservantes', desc: 'Produção diária, congelamento zero.' },
      { name: 'Café especial', desc: 'Microlotes pontuados acima de 86.' },
    ],
    menu: [
      { name: 'Pão de fermentação natural (1kg)', price: 'R$ 38' },
      { name: 'Brioche (un)', price: 'R$ 12' },
      { name: 'Croissant de amêndoas', price: 'R$ 14' },
      { name: 'Bolo de cenoura (fatia)', price: 'R$ 11' },
      { name: 'Café coado 200ml', price: 'R$ 9' },
    ],
    ctaTitle: 'Pedir agora',
    ctaLabel: 'Pedir no WhatsApp',
    whatsapp: '5511990011111',
    phone: '(11) 3061-1111',
    email: 'oi@padaria.com.br',
    address: 'Rua Joaquim Antunes, 180 — Pinheiros, São Paulo/SP',
    hours: 'Seg–Sáb, 7h–20h · Dom, 8h–14h',
    instagram: 'https://instagram.com/padaria',
  },

  'academia': {
    slug: 'academia',
    tagline: 'Academia premium com musculação, aulas e bem-estar.',
    palette: { primary: '#0a2e0a', secondary: '#16a34a', accent: '#16a34a', surface: '#f0fdf4' },
    hero: {
      eyebrow: 'Musculação · Cross · Pilates · Yoga',
      title: 'Treinar nunca foi tão motivador.',
      subtitle: 'Equipamentos de última geração, 80 aulas por semana e profissionais formados.',
      ctaLabel: 'Aula experimental',
      ctaHref: '#contato',
      image: unsplash('1534438327276-14e5300c3a48'),
    },
    aboutText:
      'Academia de 1.800 m² com musculação, cross training, pilates, yoga, spinning e área de cardio. 22 profissionais de educação física.',
    services: [
      { icon: '🏋️', name: 'Musculação', desc: 'Equipamentos Hammer Strength e Technogym.' },
      { icon: '🔥', name: 'Cross training', desc: 'Aulas de 1h em grupo, com coach.' },
      { icon: '🧘', name: 'Yoga e pilates', desc: 'Salas equipadas com instrutores formados.' },
      { icon: '🥗', name: 'Nutrição', desc: 'Consultoria com nutricionista esportivo.' },
    ],
    differentials: [
      { name: 'Aula experimental grátis', desc: 'Para novos alunos, sem compromisso.' },
      { name: 'Sem fidelidade', desc: 'Cancela a qualquer momento.' },
      { name: 'Horários estendidos', desc: 'Aberto das 5h às 23h.' },
    ],
    ctaTitle: 'Comece hoje',
    ctaLabel: 'Aula grátis',
    whatsapp: '5511990012121',
    phone: '(11) 4008-1212',
    email: 'contato@academia.com.br',
    address: 'Av. Brigadeiro Faria Lima, 5500 — Itaim Bibi, São Paulo/SP',
    hours: 'Seg–Sex, 5h–23h · Sáb/Dom, 7h–18h',
    instagram: 'https://instagram.com/academia',
  },

  'pet-shop': {
    slug: 'pet-shop',
    tagline: 'Pet shop com banho, tosa, veterinária e produtos premium.',
    palette: { primary: '#78350f', secondary: '#f59e0b', accent: '#f59e0b', surface: '#fffbeb' },
    hero: {
      eyebrow: 'Banho · Tosa · Veterinária · Loja',
      title: 'Cuidar do seu pet com o carinho que ele merece.',
      subtitle: 'Veterinários 24h, banho e tosa com agendamento online e loja com 4.000 itens.',
      ctaLabel: 'Agendar banho',
      ctaHref: '#contato',
      image: unsplash('1548199973-03cce0bbc87b'),
    },
    aboutText:
      '8 anos no mercado, 18 veterinários e 22 banhadores/tosadores. Estrutura completa com internação, centro cirúrgico e loja.',
    services: [
      { icon: '🛁', name: 'Banho e tosa', desc: 'Pacotes a partir de R$ 45.' },
      { icon: '🩺', name: 'Veterinária 24h', desc: 'Pronto-socorro, consultas e cirurgias.' },
      { icon: '💉', name: 'Vacinação', desc: 'Calendário completo e carteirinha digital.' },
      { icon: '🛍️', name: 'Loja', desc: 'Ração, brinquedos, medicamentos e acessórios.' },
    ],
    differentials: [
      { name: 'Veterinária 24h', desc: 'Pronto-socorro todos os dias, inclusive feriados.' },
      { name: 'Agendamento online', desc: 'Sem fila de espera, com confirmação por SMS.' },
      { name: 'Profissionais formados', desc: 'CRMV ativo para todos os veterinários.' },
    ],
    ctaTitle: 'Agende banho ou consulta',
    ctaLabel: 'Agendar agora',
    whatsapp: '5511990013131',
    phone: '(11) 4009-1313',
    email: 'agendamento@petshop.com.br',
    address: 'Rua Cotoxó, 1100 — Pompeia, São Paulo/SP',
    hours: 'Seg–Sáb, 8h–22h · Dom, 9h–18h',
    instagram: 'https://instagram.com/petshop',
  },

  'fotografo': {
    slug: 'fotografo',
    tagline: 'Fotografia de casamentos, eventos e ensaios autorais.',
    palette: { primary: '#0a0a0a', secondary: '#1e293b', accent: '#1e293b', surface: '#f8fafc' },
    hero: {
      eyebrow: 'Casamentos · Eventos · Ensaio autoral',
      title: 'Fotos com olhar autoral e entrega em tempo recorde.',
      subtitle: 'Mais de 240 casamentos fotografados, 18 anos de experiência, equipamento pro.',
      ctaLabel: 'Reservar data',
      ctaHref: '#contato',
      image: unsplash('1606216794074-735e91aa2c92'),
    },
    aboutText:
      'Fotógrafo premiado, equipe de 8 fotógrafos assistentes, 2 cinegrafistas e edição entregue em até 30 dias.',
    services: [
      { icon: '💍', name: 'Casamentos', desc: 'Cobertura completa, álbum e making of.' },
      { icon: '🎂', name: 'Aniversários', desc: 'Cobertura de 4h a 8h, fotos e vídeo.' },
      { icon: '👶', name: 'Ensaio newborn', desc: 'Estúdio próprio, sessão de 2h.' },
      { icon: '🏢', name: 'Eventos corporativos', desc: 'Cobertura discreta e entrega rápida.' },
    ],
    differentials: [
      { name: 'Entrega em 30 dias', desc: 'Galeria online + fotos editadas.' },
      { name: 'Equipamento pro', desc: 'Câmeras full-frame e iluminação de cinema.' },
      { name: 'Backup em 3 locais', desc: 'Suas fotos seguras em HDD + nuvem + estúdio.' },
    ],
    gallery: [
      { src: unsplash('1519741497674-611481863552', 600, 600) },
      { src: unsplash('1465495976277-4387d4b0b4c6', 600, 600) },
      { src: unsplash('1511285560929-80b456fea0bc', 600, 600) },
      { src: unsplash('1606800052052-a08af7148866', 600, 600) },
    ],
    ctaTitle: 'Reservar data',
    ctaLabel: 'Reservar agora',
    whatsapp: '5511990014141',
    phone: '(11) 4009-1414',
    email: 'contato@fotografo.com.br',
    address: 'Estúdio Vila Madalena, São Paulo/SP',
    hours: 'Atendimento seg–sex, 9h–19h',
    instagram: 'https://instagram.com/fotografo',
  },

  // ─────────────────────────────────────────────────────────────
  // PROFISSIONAIS
  // ─────────────────────────────────────────────────────────────
  'advogado': {
    slug: 'advogado',
    tagline: 'Advocacia estratégica para pessoas físicas e empresas.',
    palette: { primary: '#0c0a1f', secondary: '#581c87', accent: '#7c3aed', surface: '#faf5ff' },
    hero: {
      eyebrow: 'Direito Civil · Trabalhista · Família',
      title: 'Atendimento jurídico pessoal, claro e eficaz.',
      subtitle: '15 anos de OAB, 1.200 casos atendidos e primeira consulta sem custo.',
      ctaLabel: 'Agendar consulta',
      ctaHref: '#contato',
      image: unsplash('1589829545856-d10d557cf95f'),
    },
    aboutText:
      'Advocacia personalizada, com atendimento humano e foco em resultado. Atuação em direito civil, do trabalho, família, consumidor e imobiliário.',
    services: [
      { icon: '⚖️', name: 'Direito civil', desc: 'Contratos, indenizações e responsabilidade civil.' },
      { icon: '👔', name: 'Trabalhista', desc: 'Defesa do empregado ou do empregador.' },
      { icon: '👨‍👩‍👧', name: 'Família', desc: 'Divórcio, guarda, pensão e inventário.' },
      { icon: '🛒', name: 'Consumidor', desc: 'Indenização contra empresas e bancos.' },
    ],
    differentials: [
      { name: '1ª consulta grátis', desc: 'Avaliação sem compromisso.' },
      { name: 'Honorários claros', desc: 'Tabela pública e parcelamento.' },
      { name: 'Atendimento humanizado', desc: 'Explicação clara, sem juridiquês.' },
    ],
    ctaTitle: 'Primeira consulta sem custo',
    ctaLabel: 'Agendar agora',
    whatsapp: '5511990015151',
    phone: '(11) 3003-1515',
    email: 'contato@advogado.com.br',
    address: 'Av. São Luís, 50 — República, São Paulo/SP',
    hours: 'Seg–Sex, 8h–19h',
    instagram: 'https://instagram.com/advogado',
  },

  'contador': {
    slug: 'contador',
    tagline: 'Contabilidade consultiva para PMEs e profissionais liberais.',
    palette: { primary: '#0c1f4a', secondary: '#1d4ed8', accent: '#1d4ed8', surface: '#eff6ff' },
    hero: {
      eyebrow: 'Contabilidade · Fiscal · Folha',
      title: 'Mais que contabilidade: planejamento tributário que economiza.',
      subtitle: 'Atendimento digital, equipe 100% em nuvem, suporte humano em até 2h.',
      ctaLabel: 'Pedir proposta',
      ctaHref: '#contato',
      image: unsplash('1554224155-6726b3ff858f'),
    },
    aboutText:
      'Escritório contábil digital, com 12 anos de mercado e mais de 480 clientes ativos. Especialistas em Simples Nacional, Lucro Presumido e profissionais liberais.',
    services: [
      { icon: '📒', name: 'Contabilidade mensal', desc: 'Escrituração, balancete e demonstrações.' },
      { icon: '💰', name: 'Planejamento tributário', desc: 'Estudo anual para reduzir carga de impostos.' },
      { icon: '👥', name: 'Folha e RH', desc: 'Admissão, demissão, FGTS e INSS.' },
      { icon: '🏢', name: 'Abertura de empresa', desc: 'Em até 7 dias, com CNPJ e tudo pronto.' },
    ],
    differentials: [
      { name: '100% digital', desc: 'Documentos enviados pelo app, sem precisar ir ao escritório.' },
      { name: 'Suporte em 2h', desc: 'Resposta por WhatsApp em horário comercial.' },
      { name: 'Contador fixo', desc: 'Mesmo profissional para sua empresa, todo mês.' },
    ],
    ctaTitle: 'Troque de contador',
    ctaLabel: 'Pedir proposta',
    whatsapp: '5511990016161',
    phone: '(11) 3003-1616',
    email: 'contato@contador.com.br',
    address: 'Atendimento 100% digital em todo o Brasil',
    hours: 'Seg–Sex, 8h–19h',
    instagram: 'https://instagram.com/contador',
  },

  'corretor': {
    slug: 'corretor',
    tagline: 'Corretor de imóveis CRECI para compra, venda e aluguel.',
    palette: { primary: '#0c2e4a', secondary: '#0891b2', accent: '#0891b2', surface: '#f0f9ff' },
    hero: {
      eyebrow: 'Compra · Venda · Aluguel',
      title: 'O corretor certo para o seu próximo imóvel.',
      subtitle: '12 anos de CRECI, 480 transações e atendimento pessoal em todo o processo.',
      ctaLabel: 'Buscar imóvel',
      ctaHref: '#contato',
      image: unsplash('1560518883-ce09059eeffa'),
    },
    aboutText:
      'Atendo pessoas físicas e famílias em todas as regiões de São Paulo. Foco em imóveis residenciais, com transparência e respeito ao cliente.',
    services: [
      { icon: '🏠', name: 'Compra', desc: 'Assessoria do cadastro à escritura.' },
      { icon: '💼', name: 'Venda', desc: 'Avaliação, marketing e negociação.' },
      { icon: '🔑', name: 'Aluguel', desc: 'Captação de inquilino e gestão do contrato.' },
      { icon: '📑', name: 'Regularização', desc: 'Documentação e habite-se.' },
    ],
    differentials: [
      { name: 'CRECI ativo', desc: '12 anos sem nenhuma ocorrência.' },
      { name: 'Avaliação gratuita', desc: 'Quer vender? Avaliamos sem compromisso.' },
      { name: 'Atendimento pessoal', desc: 'Não passo cliente pra equipe. Sigo do começo ao fim.' },
    ],
    ctaTitle: 'Vamos conversar',
    ctaLabel: 'Marcar reunião',
    whatsapp: '5511990017171',
    phone: '(11) 3003-1717',
    email: 'contato@corretor.com.br',
    address: 'Atendo toda São Paulo capital',
    hours: 'Seg–Sáb, 9h–20h',
    instagram: 'https://instagram.com/corretor',
  },

  'personal-trainer': {
    slug: 'personal-trainer',
    tagline: 'Personal trainer com atendimento em academias, condomínios e home.',
    palette: { primary: '#0a2e0a', secondary: '#16a34a', accent: '#16a34a', surface: '#f0fdf4' },
    hero: {
      eyebrow: 'Personal · Musculação · Funcional',
      title: 'Treino sob medida, com resultado em 90 dias.',
      subtitle: 'CREF ativo, 12 anos de experiência e 240 alunos atendidos.',
      ctaLabel: 'Aula experimental',
      ctaHref: '#contato',
      image: unsplash('1571019613454-1cb2f99b2d8b'),
    },
    aboutText:
      'Atendo em academias, condomínios, clubes e home office. Avaliação física gratuita e plano de treino personalizado para o seu objetivo.',
    services: [
      { icon: '💪', name: 'Musculação', desc: 'Hipertrofia, força e definição.' },
      { icon: '🏃', name: 'Emagrecimento', desc: 'Plano de treino + orientação alimentar.' },
      { icon: '🧘', name: 'Funcional', desc: 'Mobilidade, postura e core.' },
      { icon: '🏠', name: 'Home training', desc: 'Atendimento na sua casa, com ou sem equipamento.' },
    ],
    differentials: [
      { name: 'Avaliação gratuita', desc: 'Composição corporal e plano inicial.' },
      { name: 'CREF ativo', desc: 'Profissional registrado e formado em Educação Física.' },
      { name: 'Garantia de resultado', desc: 'Plano revisado a cada 30 dias.' },
    ],
    ctaTitle: 'Comece com avaliação',
    ctaLabel: 'Aula grátis',
    whatsapp: '5511990018181',
    phone: '(11) 3003-1818',
    email: 'contato@personal.com.br',
    address: 'Atendo em academias e domicílio em São Paulo',
    hours: 'Seg–Sáb, 6h–22h',
    instagram: 'https://instagram.com/personal',
  },

  'consultor': {
    slug: 'consultor',
    tagline: 'Consultoria empresarial e mentoria para empreendedores.',
    palette: { primary: '#1a0b3e', secondary: '#7c3aed', accent: '#7c3aed', surface: '#faf5ff' },
    hero: {
      eyebrow: 'Consultoria · Mentoria · Estratégia',
      title: 'Estratégia para destravar o crescimento da sua empresa.',
      subtitle: '22 anos de mercado, 180 projetos e mentoria 1:1 com foco em resultado.',
      ctaLabel: 'Agendar sessão',
      ctaHref: '#contato',
      image: unsplash('1556761175-5973dc0f32e7'),
    },
    aboutText:
      'Atendo PMEs, startups e profissionais liberais com foco em estratégia, vendas e gestão. Já conduzi processos em 14 setores diferentes.',
    services: [
      { icon: '📈', name: 'Consultoria estratégica', desc: 'Plano de 12 meses com metas trimestrais.' },
      { icon: '🧠', name: 'Mentoria 1:1', desc: 'Sessões semanais com profundidade.' },
      { icon: '💼', name: 'Diagnóstico financeiro', desc: 'Análise de DRE, fluxo de caixa e margem.' },
      { icon: '🚀', name: 'Estruturação comercial', desc: 'Funil, equipe, metas e CRM.' },
    ],
    differentials: [
      { name: '22 anos no mercado', desc: 'Experiência em 14 setores.' },
      { name: 'Mentoria 1:1', desc: 'Sessões individuais, sem turma.' },
      { name: 'Garantia de plano', desc: 'Se não gostar do plano, devolvo 100%.' },
    ],
    ctaTitle: 'Vamos conversar',
    ctaLabel: 'Sessão estratégica',
    whatsapp: '5511990019191',
    phone: '(11) 3003-1919',
    email: 'contato@consultor.com.br',
    address: 'Atendimento online e presencial em São Paulo',
    hours: 'Seg–Sex, 9h–19h',
    instagram: 'https://instagram.com/consultor',
  },
};

/** Pega o pack de um slug ou devolve um fallback genérico. */
export function getPack(slug: string): ContentPack {
  return PACKS[slug] || PACKS['empresa-corporativa'];
}
