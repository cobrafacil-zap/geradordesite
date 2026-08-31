/**
 * Group 1 — 5 content packs de empresa (B2B / industrial / premium / imóveis).
 * Cada pack tem voz própria, números reais e personalidade distinta.
 * Imagens: Unsplash (URLs com tamanho + crop). Se quebrar, o editor permite trocar.
 */

import type { ContentPack } from './registry';

// Helper local — gera URL Unsplash no formato padrão do projeto.
const unsplash = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const GROUP_1: Record<string, ContentPack> = {
  // ─────────────────────────────────────────────────────────────
  // 1. EMPRESA CORPORATIVA — Consultoria estratégica B2B
  // ─────────────────────────────────────────────────────────────
  'empresa-corporativa': {
    slug: 'empresa-corporativa',
    tagline: 'Decisões melhores para empresas que não cabem mais no improviso.',
    palette: {
      primary: '#0b2545',
      secondary: '#1d3557',
      accent: '#c9a961',
      surface: '#f5f3ee',
    },
    aboutText:
      'Boutique de consultoria com 22 anos de estrada. Atendemos 38 grupos empresariais com squads seniores — sem PowerPoint de 200 páginas e sem consultor que some depois do kick-off. Aqui, sócio entra na sala, fica até o último entregável e fala a mesma língua do seu board.',
    hero: {
      eyebrow: 'Consultoria · M&A · Governança',
      title: 'Estratégia que entra em planilha antes de virar slide.',
      subtitle: 'Em 22 anos, atravessamos 4 crises macroeconômicas. A gente conhece o que não está nos livros e o que não aparece em relatório.',
      ctaLabel: 'Agendar diagnóstico executivo',
      ctaHref: '#contato',
      image: unsplash('1497366216548-37526070297c'),
    },
    services: [
      { icon: '📊', name: 'Consultoria estratégica', desc: 'Plano de 3 a 5 anos com metas trimestrais, OKRs por área e revisão mensal com o board.' },
      { icon: '🤝', name: 'M&A e due diligence', desc: 'Compra, venda, fusão e integração cultural de empresas de médio e grande porte.' },
      { icon: '🧭', name: 'Governança corporativa', desc: 'Estruturação de conselho, comitês, políticas de controle e sucessão familiar.' },
      { icon: '💼', name: 'Reestruturação financeira', desc: 'Renegociação de dívidas, capital de giro, turnaround operacional em até 11 meses.' },
      { icon: '👥', name: 'People & cultura', desc: 'Diagnóstico cultural, desenho de organograma e plano sucessório em 90 dias.' },
      { icon: '📈', name: 'FP&A sob demanda', desc: 'Squad terceirizado de planejamento financeiro que fala a língua do seu CFO.' },
    ],
    differentials: [
      { name: 'Sócio na linha de frente', desc: 'Cada projeto tem sócio dedicado — não só no kick-off, mas no último entregável.' },
      { name: 'Sem staff júnior', desc: 'Profissionais com 12+ anos. Nenhum analista de primeiro ano vai entrar na sua sala.' },
      { name: 'Confidencialidade real', desc: 'NDA reforçado, sala-cofre e ambientes auditáveis para casos sensíveis.' },
    ],
    stats: [
      { value: 'R$ 6,8 bi', label: 'em transações assessoradas' },
      { value: '142', label: 'projetos entregues' },
      { value: '97%', label: 'NPS de clientes' },
      { value: '22 anos', label: 'no mercado' },
    ],
    testimonials: [
      {
        name: 'Eduardo Saldanha',
        role: 'CEO, Grupo Minerva',
        text: 'O turnaround deles nos tirou do vermelho em 11 meses. Cumpriram cronograma, orçamento e prometeram o que podiam entregar.',
      },
      {
        name: 'Patrícia Andrade',
        role: 'CFO, Vérios Holding',
        text: 'A equipe age como se fosse do nosso time. Linguagem executiva, sem enrolação e sem consultor querendo virar celebridade.',
      },
      {
        name: 'Rodrigo Quintas',
        role: 'Conselheiro independente',
        text: 'Raridade no mercado: gente que entrega o que promete, no prazo, com profundidade. E que ainda atende o celular depois.',
      },
    ],
    faq: [
      {
        q: 'Vocês atendem empresa de qual porte?',
        a: 'Faturamento anual a partir de R$ 80 milhões. Para empresas menores, indicamos 3 parceiros sérios que conhecemos.',
      },
      {
        q: 'Como funciona o fee?',
        a: 'Combinado: fee fixo mensal + variável por performance em alguns casos. Tudo detalhado em contrato, sem letra miúda.',
      },
      {
        q: 'Atendem fora do Brasil?',
        a: 'Sim, somos fortes em LATAM. Já tocamos projetos nos EUA, Portugal, Angola e Reino Unido.',
      },
    ],
    ctaTitle: 'Vamos tirar essa decisão do papel?',
    ctaLabel: 'Marcar reunião com sócio',
    whatsapp: '5511334519001',
    phone: '(11) 4519-0022',
    email: 'contato@meridianconsult.com.br',
    address: 'Av. Faria Lima, 3729 — Itaim Bibi, São Paulo/SP',
    hours: 'Seg–Sex, 8h–19h',
    cnpj: '14.208.337/0001-04',
    instagram: 'https://instagram.com/meridianconsult',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. EMPRESA MODERNA — SaaS B2B / plataforma de automação
  // ─────────────────────────────────────────────────────────────
  'empresa-moderna': {
    slug: 'empresa-moderna',
    tagline: 'Automatize o que seu time ainda faz no braço. Sem planilha, sem retrabalho.',
    palette: {
      primary: '#0a0f1f',
      secondary: '#5b6bff',
      accent: '#22d3a4',
      surface: '#f6f7fb',
    },
    aboutText:
      'Plataforma de automação B2B com 3.800 clientes ativos. Conectamos 240 ferramentas, disparamos fluxos com IA e entregamos em horas o que antes levava semanas. Time de 142 pessoas em São Paulo e Recife, com uptime de 99,98% nos últimos 36 meses.',
    hero: {
      eyebrow: 'Plataforma SaaS · API first',
      title: 'Tire sua equipe da planilha. Coloque a IA para trabalhar.',
      subtitle: 'Em 7 dias você sai do zero com pipelines rodando, integrações conectadas e dashboards prontos pro CFO.',
      ctaLabel: 'Testar grátis por 14 dias',
      ctaHref: '#contato',
      image: unsplash('1551288049-bebda4e38f71'),
    },
    services: [
      { icon: '⚡', name: 'Automações no-code', desc: 'Construtor visual com 720 blocos prontos, do CRM ao financeiro.' },
      { icon: '🧠', name: 'IA para times operacionais', desc: 'Agentes que lêem e respondem e-mails, tickets e CRM 24/7, em português.' },
      { icon: '🔌', name: 'API e webhooks', desc: 'API REST robusta, webhooks idempotentes e SDKs em 6 linguagens.' },
      { icon: '🗂️', name: 'Integrações nativas', desc: 'Slack, Notion, Salesforce, HubSpot, Pipedrive, RD e mais 240.' },
      { icon: '📊', name: 'Analytics em tempo real', desc: 'Dashboards prontos + exportação para Looker, Metabase e Power BI.' },
      { icon: '🔐', name: 'SSO e segurança', desc: 'SAML, OIDC, SCIM, audit log, LGPD e SOC 2 tipo II auditado.' },
    ],
    differentials: [
      { name: 'Onboarding em 7 dias', desc: 'Time de sucesso entra junto na primeira semana e não te larga na mão.' },
      { name: 'IA explicável', desc: 'Você vê o que o agente pensou antes de responder. Sem caixa-preta.' },
      { name: 'Sem lock-in', desc: 'Exporte seus dados em JSON/CSV a qualquer momento, sem tarifa de saída.' },
    ],
    stats: [
      { value: '3.800+', label: 'empresas ativas' },
      { value: '52 mi', label: 'automações/mês' },
      { value: '99,98%', label: 'uptime em 36 meses' },
      { value: '4,8/5', label: 'G2 Crowd' },
    ],
    testimonials: [
      {
        name: 'Camila Borges',
        role: 'Head of Ops, Loggi',
        text: 'Tiramos 4 pessoas de planilha e botamos pra pensar estratégia. ROI apareceu em 47 dias, não em trimestre.',
      },
      {
        name: 'Felipe Yamamoto',
        role: 'CTO, Conta Azul',
        text: 'A melhor decisão de stack que tomamos em 2025. Integra com tudo que a gente usa, sem gambiarra.',
      },
      {
        name: 'Renata Pellegrini',
        role: 'VP de Operações, QuintoAndar',
        text: 'Saímos de 12 planilhas para 1 pipeline automatizado. Suporte responde em minutos, não em dias.',
      },
    ],
    faq: [
      {
        q: 'Tem plano free?',
        a: 'Sim, com até 3 usuários e 1.000 execuções por mês. Sem cartão de crédito, sem pegadinha.',
      },
      {
        q: 'Como funciona o trial de 14 dias?',
        a: 'Acesso completo ao plano Pro. Se gostar, escolhe plano. Se não gostar, exporta tudo e sai.',
      },
      {
        q: 'Vocês fazem implementação assistida?',
        a: 'Sim, com partners certificados. Custo separado, sob orçamento, com SLA de 30 dias.',
      },
    ],
    ctaTitle: 'Comece grátis em 5 minutos',
    ctaLabel: 'Criar conta gratuita',
    whatsapp: '5511988223344',
    phone: '(11) 4040-2525',
    email: 'oi@nimbusflow.com.br',
    address: 'Rua Capote Valente, 671 — Pinheiros, São Paulo/SP',
    hours: 'Suporte humano 24/7',
    cnpj: '38.914.002/0001-78',
    instagram: 'https://instagram.com/nimbusflow',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. EMPRESA PREMIUM — Curadoria de viagens e experiências de luxo
  // ─────────────────────────────────────────────────────────────
  'empresa-premium': {
    slug: 'empresa-premium',
    tagline: 'Para quem não procura — escolhe.',
    mode: 'dark',
    palette: {
      primary: '#1c1917',
      secondary: '#a16207',
      accent: '#d4af37',
      surface: '#faf7f0',
    },
    aboutText:
      'Curadoria boutique de viagens para 280 famílias e executivos C-level. Roteiros em 6 continentes, parceria com hotéis Relais & Châteaux, Aman e Rosewood. Discrição absoluta, acesso a lugares fechados ao público geral e concierge em qualquer fuso.',
    hero: {
      eyebrow: 'Curadoria · Concierge · Experiências',
      title: 'A viagem que você quer, do jeito que só você vive.',
      subtitle: 'A gente desenha do zero. Você entra no carro, no barco ou no jatinho — e o resto já está resolvido.',
      ctaLabel: 'Solicitar proposta sob medida',
      ctaHref: '#contato',
      image: unsplash('1582719508461-905c673771fd'),
    },
    services: [
      { icon: '✈️', name: 'Roteiros sob medida', desc: 'Viagens desenhadas a partir do seu gosto, agenda, ritmo e restrições alimentares.' },
      { icon: '🥂', name: 'Eventos privados', desc: 'Aniversários, casamentos e reuniões de família em lugares únicos e exclusivos.' },
      { icon: '🏨', name: 'Hotelaria premium', desc: 'Tarifas negociadas e upgrades em 4.800 hotéis no mundo, dos Aman aos Rosewood.' },
      { icon: '🛥️', name: 'Iates e jatos', desc: 'Fretamento com curadoria, gestão total da logística e tripulação selecionada.' },
      { icon: '🍾', name: 'Gastronomia Michelin', desc: 'Reservas em restaurantes disputados, com cardápio sob medida e harmonização.' },
      { icon: '🛡️', name: 'Concierge 24/7', desc: 'Time disponível em qualquer fuso, por WhatsApp, telefone ou Signal.' },
    ],
    differentials: [
      { name: 'Curadores seniores', desc: 'Profissionais com 15+ anos em hotelaria e turismo de luxo, com vivência real.' },
      { name: 'Acesso exclusivo', desc: 'Lugares fechados ao público geral e visitas after-hours em museus e vinícolas.' },
      { name: 'Discrição absoluta', desc: 'NDA reforçado e gestão de privacidade em todas as entregas, sem exceção.' },
    ],
    stats: [
      { value: '280', label: 'clientes ativos' },
      { value: '52', label: 'países atendidos' },
      { value: '14 anos', label: 'de história' },
      { value: '4.800', label: 'hotéis parceiros' },
    ],
    testimonials: [
      {
        name: 'Família Tavares',
        role: 'Clientes desde 2017',
        text: 'A viagem à Patagônia que eles montaram mudou o que a gente entende por旅行. Cada detalhe pensado, cada reserva impecável.',
      },
      {
        name: 'Joana Mendes',
        role: 'CEO, holding familiar',
        text: 'Profissionalismo raro. Do transfer ao menu do jantar, tudo cuidado como se fosse para eles mesmos.',
      },
      {
        name: 'Henrique Albuquerque',
        role: 'Sócio, banco de investimento',
        text: 'Em 8 anos usando o serviço deles, nunca tive uma surpresa ruim. Isso diz tudo sobre o padrão.',
      },
    ],
    faq: [
      {
        q: 'Como funciona o processo de cotação?',
        a: 'Reunião de briefing de 1h, proposta detalhada em até 5 dias úteis e ajustes ilimitados antes do fechamento.',
      },
      {
        q: 'Vocês cobram taxa de planejamento?',
        a: 'Sim, uma taxa fixa que é abatida do valor final da viagem. Transparente desde o primeiro e-mail.',
      },
      {
        q: 'Atendem grupos grandes?',
        a: 'Sim, de 2 a 80 pessoas. Casamentos, incentivos corporativos e reuniões de família são nosso forte.',
      },
    ],
    ctaTitle: 'Sua próxima viagem começa numa conversa',
    ctaLabel: 'Falar com curador',
    whatsapp: '5511967009988',
    phone: '(11) 3068-4040',
    email: 'concierge@aurumtravel.com.br',
    address: 'Alameda Lorena, 1820 — Jardins, São Paulo/SP',
    hours: 'Concierge 24/7 · Escritório Seg–Sex, 9h–19h',
    cnpj: '27.082.119/0001-60',
    instagram: 'https://instagram.com/aurumtravel',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. INDÚSTRIA — Metal-mecânica, usinagem e automação industrial
  // ─────────────────────────────────────────────────────────────
  'industria': {
    slug: 'industria',
    tagline: 'Da usinagem de precisão à célula robotizada — entregue no prazo.',
    palette: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#f97316',
      surface: '#f1f5f9',
    },
    aboutText:
      'Parque fabril de 16.000 m² em Sumaré, com 82 máquinas CNC de 3 a 5 eixos, célula robotizada KUKA e equipe de 280 colaboradores. Atendemos automotivo, agro, energia e óleo & gás. Tolerância de até 0,003 mm e certificação IATF 16949 auditada em 2025.',
    hero: {
      eyebrow: 'Metal-mecânica · Usinagem · Automação',
      title: 'Peça crítica, prazo curto, tolerância apertada? A gente resolve.',
      subtitle: 'Cotação técnica em 24h úteis. Série piloto em 15 dias. Produção em escala quando você precisar.',
      ctaLabel: 'Enviar desenho técnico',
      ctaHref: '#contato',
      image: unsplash('1565043666747-69f6646db940'),
    },
    services: [
      { icon: '⚙️', name: 'Usinagem CNC', desc: 'Torno, fresa e centro de usinagem 5 eixos com tolerância de 0,003 mm.' },
      { icon: '🤖', name: 'Automação industrial', desc: 'Células robotizadas, integração com CLP Siemens e Allen-Bradley, projetos turnkey.' },
      { icon: '🏗️', name: 'Caldeiraria pesada', desc: 'Estruturas metálicas, tanques e vasos de pressão com certificação ASME.' },
      { icon: '🔬', name: 'Metrologia', desc: 'Braço de medição 3D, MMC Zeiss e ensaios não destrutivos próprios.' },
      { icon: '🛠️', name: 'Manutenção industrial', desc: 'Contratos preventivos, preditivos e corretivos 24/7 em campo.' },
      { icon: '📐', name: 'Engenharia sob medida', desc: 'Projeto, prototipagem rápida e serialização de peças especiais.' },
    ],
    differentials: [
      { name: 'ISO 9001 e IATF 16949', desc: 'Certificações auditadas em 2025 por organismo acreditado Inmetro.' },
      { name: '30% de capacidade ociosa', desc: 'Pedidos rápidos e séries curtas cabem no nosso calendário, sem furar fila de cliente grande.' },
      { name: 'Time técnico próprio', desc: 'Engenheiros mecânicos, de produção e de qualidade. Sem terceirização de projeto.' },
    ],
    stats: [
      { value: '32 anos', label: 'no mercado' },
      { value: '16.000 m²', label: 'de parque fabril' },
      { value: '280', label: 'colaboradores' },
      { value: '82', label: 'máquinas CNC' },
    ],
    testimonials: [
      {
        name: 'Marcelo Tavares',
        role: 'Diretor de Compras, Stellantis',
        text: 'Entregaram 14 lotes de peça crítica sem uma única não-conformidade em 18 meses. Isso é consistência.',
      },
      {
        name: 'Andrea Figueiredo',
        role: 'Engenheira sênior, WEG',
        text: 'Cotaram em 4 horas num domingo. Viraram fornecedor estratégico em 90 dias. Cumpriram o que prometeram.',
      },
      {
        name: 'Roberto Nasser',
        role: 'COO, fabricante de implementos agrícolas',
        text: 'O projeto turnkey de célula robotizada deles pagou o investimento em 14 meses. Time técnico de verdade.',
      },
    ],
    faq: [
      {
        q: 'Qual o volume mínimo para pedido?',
        a: 'A partir de 50 peças para usinagem. Para caldeiraria, projetos acima de R$ 30 mil.',
      },
      {
        q: 'Vocês trabalham com quais materiais?',
        a: 'Aços carbono, inox, alumínio, latão, bronze, titânio e plásticos de engenharia (PEEK, Delrin).',
      },
      {
        q: 'Como é a logística de entrega?',
        a: 'Transportadora própria para até 500 km. Acima disso, fretes parceiros com rastreamento.',
      },
    ],
    ctaTitle: 'Cotação técnica em 24h úteis',
    ctaLabel: 'Enviar desenho 3D',
    whatsapp: '5511940502200',
    phone: '(19) 4525-9090',
    email: 'vendas@axisprecision.com.br',
    address: 'Rod. Anhanguera, km 122 — Distrito Industrial, Sumaré/SP',
    hours: 'Seg–Sáb, 6h–22h',
    cnpj: '54.829.117/0001-42',
    instagram: 'https://instagram.com/axisprecision',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. CONSTRUTORA — Incorporadora e construtora de alto padrão
  // ─────────────────────────────────────────────────────────────
  'construtora': {
    slug: 'construtora',
    tagline: 'Apartamentos de alto padrão entregues no prazo — sem surpresa de última hora.',
    palette: {
      primary: '#0b1320',
      secondary: '#92400e',
      accent: '#b45309',
      surface: '#fdf6ec',
    },
    aboutText:
      'Incorporamos e construímos empreendimentos residenciais em São Paulo há 24 anos. 52 edifícios entregues, 14 em obra, R$ 2,8 bi em VGV nos últimos 5 anos. Arquitetura contemporânea, materiais importados e 97% das obras no prazo contratado.',
    hero: {
      eyebrow: 'Incorporação · Construção · Entrega',
      title: 'Apartamento pronto ou na planta — com data certa para mudar.',
      subtitle: 'Bela Vista, Jardins, Pinheiros, Vila Olímpia. Lançamentos com 4 suítes, terraço gourmet e lazer assinado por arquiteto.',
      ctaLabel: 'Ver empreendimentos',
      ctaHref: '#produtos',
      image: unsplash('1545324418-cc1a3fa10c00'),
    },
    services: [
      { icon: '🏗️', name: 'Incorporação', desc: 'Estudo de viabilidade, projeto legal, registro de incorporação e comercial.' },
      { icon: '🏢', name: 'Construção civil', desc: 'Obras residenciais, corporativas e retrofit com mão de obra própria.' },
      { icon: '📐', name: 'Projetos arquitetônicos', desc: 'Escritório próprio com 24 arquitetos e 4 escritórios de arquitetura parceiros.' },
      { icon: '🔑', name: 'Gestão da entrega', desc: 'Acompanhamento pós-obra, vistoria assistida e habite-se sem dor de cabeça.' },
      { icon: '💼', name: 'Investimento imobiliário', desc: 'Análise de viabilidade e estruturação de operação para investidor.' },
      { icon: '🛋️', name: 'Decoração de áreas comuns', desc: 'Interiores assinados e mobiliados, prontos para o morador usar.' },
    ],
    differentials: [
      { name: '97% no prazo', desc: 'Em 24 anos, 97% dos empreendimentos entregues na data contratada em contrato.' },
      { name: 'Acabamento premium', desc: 'Materiais importados, mão de obra própria e 3 visitas de QA por unidade.' },
      { name: 'Garantia de 5 anos', desc: 'Assistência técnica estendida e equipe dedicada após a entrega das chaves.' },
    ],
    stats: [
      { value: '52', label: 'edifícios entregues' },
      { value: '14', label: 'em obra agora' },
      { value: 'R$ 2,8 bi', label: 'em VGV nos últimos 5 anos' },
      { value: '24 anos', label: 'de mercado' },
    ],
    testimonials: [
      {
        name: 'Renata Bittencourt',
        role: 'Compradora — Bela Vista',
        text: 'Entregaram 38 dias antes do prazo. Vistoria assistida foi um mimo, sem surpresa no habite-se.',
      },
      {
        name: 'Carlos Pellegrini',
        role: 'Investidor — 3 unidades',
        text: 'Já fechei 3 unidades com eles. Rentabilidade de aluguel 30% acima do que a região entregava.',
      },
      {
        name: 'Família Mesquita',
        role: 'Moradores — Jardins',
        text: 'Acabamento de hotel 5 estrelas. A equipe de pós-obra respondeu qualquer chamado em 48h.',
      },
    ],
    faq: [
      {
        q: 'Vocês vendem na planta ou só pronto?',
        a: 'Os dois. Lançamentos na planta com tabela atualizada todo mês e pronta-entrega com chave na mão.',
      },
      {
        q: 'Como funciona a garantia de 5 anos?',
        a: 'Assistência técnica estendida, equipe própria, atendimento por WhatsApp e visita em até 7 dias úteis.',
      },
      {
        q: 'Atendem outras cidades?',
        a: 'Foco em São Paulo capital. Projetos pontuais no Rio e litoral, sob análise de viabilidade.',
      },
    ],
    products: [
      {
        name: 'Residencial Bela Vista',
        price: 'R$ 4,2 mi',
        desc: '4 suítes, 218 m², varanda gourmet, 3 vagas.',
        image: unsplash('1600585154340-be6161a56a0c', 800, 600),
      },
      {
        name: 'Cobertura Duplex Jardins',
        price: 'R$ 8,9 mi',
        desc: '4 suítes, 380 m², terraço com piscina privativa e 4 vagas.',
        image: unsplash('1600596542815-ffad4c1539a9', 800, 600),
      },
      {
        name: 'Studio Pinheiros',
        price: 'R$ 1,1 mi',
        desc: 'Studio, 38 m², ideal para investidor. Rentabilidade estimada de 0,55% ao mês.',
        image: unsplash('1502672260266-1c1ef2d93688', 800, 600),
      },
    ],
    ctaTitle: 'Quer conhecer um lançamento?',
    ctaLabel: 'Agendar visita ao stand',
    whatsapp: '5511950007700',
    phone: '(11) 3061-7700',
    email: 'vendas@monteverdere.com.br',
    address: 'Av. Brigadeiro Faria Lima, 3477 — Itaim Bibi, São Paulo/SP',
    hours: 'Plantão de vendas todos os dias, 9h–20h',
    cnpj: '46.712.808/0001-91',
    instagram: 'https://instagram.com/monteverdere',
  },
};
