/**
 * Group 6 — Profissionais liberais: advogado autônomo, contador, corretor,
 * personal trainer e consultor empresarial.
 * Voz: primeira pessoa, brasileira, com números reais, opinião e zero clichê.
 * Imagens: Unsplash (URLs com tamanho + crop).
 */

import type { ContentPack } from './registry';

// Helper local — gera URL Unsplash no formato padrão do projeto.
const unsplash = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const GROUP_6: Record<string, ContentPack> = {
  // ─────────────────────────────────────────────────────────────
  // 1. ADVOGADO — Advogado autônomo (civil, família, trabalhista, consumidor)
  // ─────────────────────────────────────────────────────────────
  advogado: {
    slug: 'advogado',
    tagline: 'Advocacia de gente. Explico o que está em jogo e defendo sem teatro.',
    palette: {
      primary: '#1a0b2e',
      secondary: '#6d28d9',
      accent: '#a855f7',
      surface: '#faf5ff',
    },
    aboutText:
      'Sou advogada há 14 anos — OAB/SP 287.441 — e atendo pessoas físicas e pequenas empresas em direito civil, família, trabalhista e consumidor. Já protocolei mais de 1.800 peças, com 92% de êxito em acordos e sentenças. Trabalho sozinha, com agenda curta e resposta no mesmo dia.',
    hero: {
      eyebrow: 'Civil · Família · Trabalhista · Consumidor',
      title: 'Você fala com a advogada que vai defender você — não com a secretária.',
      subtitle: 'Atendimento direto comigo, do primeiro e-mail à última audiência. Sem terceirizar, sem passar cliente pra estagiário.',
      ctaLabel: '1ª consulta sem custo',
      ctaHref: '#contato',
      image: unsplash('1521791136064-7986c2920216'),
    },
    services: [
      { icon: '⚖️', name: 'Direito civil', desc: 'Contratos, indenizações, responsabilidade civil e cobranças judiciais.' },
      { icon: '👔', name: 'Trabalhista', desc: 'Defesa do empregado ou do empregador, verbas rescisórias e assédio.' },
      { icon: '👨‍👩‍👧', name: 'Família e sucessões', desc: 'Divórcio, guarda, pensão, inventário e planejamento patrimonial.' },
      { icon: '🛒', name: 'Consumidor', desc: 'Indenização contra bancos, planos de saúde, companhias aéreas e varejistas.' },
      { icon: '🏠', name: 'Imobiliário', desc: 'Contratos de compra e venda, locação, usucapião e regularização.' },
      { icon: '📑', name: 'Contratos e consultivo', desc: 'Elaboração e revisão de contratos com linguagem clara e preventiva.' },
    ],
    differentials: [
      { name: '1ª consulta sem custo', desc: '30 minutos para entender o caso e dizer se vale a pena entrar com ação.' },
      { name: 'Atendimento humano', desc: 'Sem juridiquês. Você entende cada passo, cada prazo e cada custo.' },
      { name: 'Honorários transparentes', desc: 'Tabela pública, parcelamento em até 12x e contrato antes de começar.' },
      { name: 'OAB ativa e regular', desc: '14 anos de inscrição, sem nenhuma sanção disciplinar.' },
    ],
    stats: [
      { value: '14 anos', label: 'de OAB' },
      { value: '1.800+', label: 'peças protocoladas' },
      { value: '92%', label: 'de êxito' },
      { value: '1 dia', label: 'prazo médio de resposta' },
    ],
    testimonials: [
      {
        name: 'Mariana Coelho',
        role: 'Professora — Divórcio consensual',
        text: 'A Dra. me explicou tudo sem pressa. Fechamos acordo em 4 meses, sem audiência e sem briga. Indiquei pra 3 amigas.',
      },
      {
        name: 'Rafael Andrade',
        role: 'Autônomo — Cobrança indevida',
        text: 'Banco me cobrou R$ 18 mil indevidos. Em 6 meses, ação julgada procedente e ainda recebi dano moral. Resposta sempre no mesmo dia.',
      },
      {
        name: 'Júlia Tavares',
        role: 'Empresária — Trabalhista',
        text: 'Defendeu meu lado numa ação que parecia perdida. Acordo melhor do que eu esperava. Atendimento direto, zero enrolação.',
      },
    ],
    faq: [
      {
        q: 'Quanto custa uma consulta?',
        a: 'A primeira conversa de 30 minutos é sem custo. Se avançar, passo orçamento detalhado por escrito antes de começar.',
      },
      {
        q: 'Quanto tempo demora um processo?',
        a: 'Depende da vara e do tipo de ação. Em média: consumidor 8 a 14 meses, família 6 a 12 meses, trabalhista 10 a 18 meses.',
      },
      {
        q: 'Atende em qual região?',
        a: 'Atendo todo o estado de SP online, e presencialmente em São Paulo capital (República e Pinheiros).',
      },
    ],
    ctaTitle: 'Vamos conversar sobre o seu caso',
    ctaLabel: 'Marcar 1ª consulta grátis',
    whatsapp: '5511984551010',
    phone: '(11) 3030-1010',
    email: 'dra.fernanda@escritorioadvocacia.com.br',
    address: 'Atendimento online em todo o estado de SP · Presencial em São Paulo capital',
    hours: 'Seg–Sex, 9h–19h',
    instagram: 'https://instagram.com/dra.fernanda.adv',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. CONTADOR — Escritório de contabilidade consultiva 100% digital
  // ─────────────────────────────────────────────────────────────
  contador: {
    slug: 'contador',
    tagline: 'Contabilidade que devolve dinheiro pro caixa — não só entrega imposto em dia.',
    palette: {
      primary: '#0a1f4a',
      secondary: '#1e40af',
      accent: '#0ea5e9',
      surface: '#eff6ff',
    },
    aboutText:
      'Escritório 100% digital há 11 anos, com 18 colaboradores entre contadores, analistas fiscais e consultores. Atendemos 420 PMEs e 180 profissionais liberais em todo o Brasil. Já recuperamos R$ 12,8 mi em créditos tributários para clientes nos últimos 3 anos. CRC/SP ativo, sem multa recente.',
    hero: {
      eyebrow: 'Contabilidade consultiva · 100% digital',
      title: 'Troque o contador que só entrega guia pelo que economiza imposto.',
      subtitle: 'Mês a mês, você recebe um diagnóstico do seu negócio — não só DAS e folha. A média dos meus clientes economiza 14% na carga tributária.',
      ctaLabel: 'Diagnóstico sem custo',
      ctaHref: '#contato',
      image: unsplash('1554224155-6726b3ff858f'),
    },
    services: [
      { icon: '📒', name: 'Contabilidade mensal completa', desc: 'Escrituração, balancete, DRE e demonstrações com fechamento até o dia 10.' },
      { icon: '💰', name: 'Planejamento tributário', desc: 'Estudo anual entre regimes, recuperação de créditos e elisão legal.' },
      { icon: '👥', name: 'Folha e RH', desc: 'Admissão, demissão, FGTS, INSS, eSocial e rescisões sem dor de cabeça.' },
      { icon: '🏢', name: 'Abertura e legalização', desc: 'CNPJ em até 7 dias, alterações, baixa e enquadramento tributário.' },
      { icon: '📊', name: 'BPO financeiro', desc: ' Contas a pagar, receber, fluxo de caixa e DFC gerados pela nossa equipe.' },
      { icon: '🤝', name: 'Atendimento consultivo', desc: 'Reunião mensal com seu contador fixo para revisar números e decidir.' },
    ],
    differentials: [
      { name: '100% digital', desc: 'Documentos pelo app, sem precisar ir ao escritório. Atendemos clientes em todos os 26 estados.' },
      { name: 'Resposta em até 2h', desc: 'WhatsApp dedicado para o seu CNPJ. SLA por escrito, sem ficar no vácuo.' },
      { name: 'Contador fixo', desc: 'Mesmo profissional para sua empresa, todo mês. Você não fala com alguém diferente a cada ligação.' },
      { name: 'CRC ativo e regular', desc: 'Escritório registrado no CRC/SP, com responsável técnico e sem advertência recente.' },
    ],
    stats: [
      { value: '420', label: 'PMEs atendidas' },
      { value: '180', label: 'profissionais liberais' },
      { value: 'R$ 12,8 mi', label: 'em créditos recuperados (3 anos)' },
      { value: '14%', label: 'economia média tributária' },
    ],
    testimonials: [
      {
        name: 'Beatriz Miranda',
        role: 'Sócia, clínica de estética',
        text: 'Meu contador anterior só entregava DAS. Em 6 meses, eles recuperaram R$ 42 mil em créditos e me colocaram no regime certo. Recomendo de olhos fechados.',
      },
      {
        name: 'Dr. Henrique Sales',
        role: 'Médico anestesista',
        text: 'Sou PF e atendo em 3 estados. Eles desenharam um planejamento que reduziu minha carga em quase 20%. Atendimento de gente grande.',
      },
      {
        name: 'Marcelo Duarte',
        role: 'CEO, startup SaaS',
        text: 'A entrega do fechamento até dia 10 virou rotina. Antes era dia 25. Mudou minha relação com o financeiro da empresa.',
      },
    ],
    faq: [
      {
        q: 'Vocês atendem pessoa física?',
        a: 'Sim. Médicos, advogados, engenheiros, dentistas e autônomos em geral. PF com receita recorrente é uma das nossas forças.',
      },
      {
        q: 'Quanto custa a mensalidade?',
        a: 'Varia conforme o regime e volume de notas. Simples Nacional: a partir de R$ 380/mês. Lucro Presumido/Real: a partir de R$ 1.200/mês.',
      },
      {
        q: 'Atendem fora de São Paulo?',
        a: 'Sim, atendemos clientes em todos os 26 estados e DF. Operação 100% digital, presencial só quando o cliente pede.',
      },
    ],
    ctaTitle: 'Trocar de contador é mais simples do que parece',
    ctaLabel: 'Pedir diagnóstico grátis',
    whatsapp: '5511933445566',
    phone: '(11) 4040-5566',
    email: 'contato@contamaxconsult.com.br',
    address: 'Atendimento 100% digital em todo o Brasil · Sede em São Paulo/SP',
    hours: 'Seg–Sex, 8h–19h',
    instagram: 'https://instagram.com/contamax.consult',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. CORRETOR — Corretor de imóveis CRECI (compra, venda, aluguel)
  // ─────────────────────────────────────────────────────────────
  corretor: {
    slug: 'corretor',
    tagline: 'Corretor CRECI que atende você do primeiro telefonema até a escritura.',
    palette: {
      primary: '#0c2e4a',
      secondary: '#0891b2',
      accent: '#38bdf8',
      surface: '#f0f9ff',
    },
    aboutText:
      'Sou corretor de imóveis há 13 anos — CRECI/SP 64.218-F — com 480 transações fechadas entre compra, venda e aluguel. Atendo todas as regiões da Grande São Paulo, com foco em imóveis residenciais de médio e alto padrão. Não passo cliente pra equipe: eu mesmo faço a visita, a proposta e a negociação.',
    hero: {
      eyebrow: 'Compra · Venda · Aluguel · CRECI ativo',
      title: 'O corretor que responde no domingo — e que não some depois da proposta.',
      subtitle: '13 anos de CRECI, 480 transações e zero reclamação em conselho. Você fala comigo do início ao fim, não com um atendente.',
      ctaLabel: 'Buscar imóvel',
      ctaHref: '#contato',
      image: unsplash('1560518883-ce09059eeffa'),
    },
    services: [
      { icon: '🏠', name: 'Compra de imóvel', desc: 'Assessoria do cadastro à escritura, com análise documental e due diligence.' },
      { icon: '💼', name: 'Venda de imóvel', desc: 'Avaliação de mercado, plano de marketing, negociação e fechamento.' },
      { icon: '🔑', name: 'Aluguel residencial', desc: 'Captação de inquilino, análise de fiador, contrato e vistoria.' },
      { icon: '📑', name: 'Regularização', desc: 'Habite-se, ITBI, matrícula atualizada e resolução de pendências.' },
      { icon: '📈', name: 'Investimento imobiliário', desc: 'Análise de viabilidade, comparativo de região e rentabilidade esperada.' },
      { icon: '🏢', name: 'Imóvel comercial', desc: 'Sala, loja, galpão e lajes corporativas. Atendo pessoas jurídicas também.' },
    ],
    differentials: [
      { name: 'CRECI ativo há 13 anos', desc: 'Sem processo ético, sem reclamação em conselho. Inscrição 64.218-F, validável online.' },
      { name: 'Avaliação gratuita', desc: 'Se quer vender, avalio sem compromisso. Comparativo com 12 transações similares da região.' },
      { name: 'Atendimento pessoal do começo ao fim', desc: 'Eu mesmo faço visita, proposta e fechamento. Sem repassar cliente pra equipe.' },
      { name: 'Comissão transparente', desc: 'Percentual combinado antes da visita, sem surpresa no final.' },
    ],
    stats: [
      { value: '13 anos', label: 'de CRECI' },
      { value: '480', label: 'transações fechadas' },
      { value: '0', label: 'reclamações em conselho' },
      { value: '24h', label: 'prazo médio de proposta' },
    ],
    testimonials: [
      {
        name: 'Família Souza',
        role: 'Compradores — Apartamento 4 dorms',
        text: 'Ele nos mostrou 14 imóveis em 2 semanas. Achamos o certo e ele cuidou de toda a documentação. Vendemos o antigo também por ele.',
      },
      {
        name: 'Patrícia Lemos',
        role: 'Proprietária — Vila Madalena',
        text: 'Anunciei com 3 corretores. Só ele me trazia proposta qualificada. Vendeu em 47 dias, acima do preço pedido.',
      },
      {
        name: 'Eduardo Britto',
        role: 'Investidor — 2 imóveis',
        text: 'Comprei meu primeiro imóvel com ele. Dois anos depois, me ajudou a comprar o segundo. Resposta sempre rápida, mesmo domingo.',
      },
    ],
    faq: [
      {
        q: 'Quanto é a comissão?',
        a: 'Varia de 4% a 6% sobre o valor da venda, dependendo do imóvel e do prazo combinado. Aluguel: 1 aluguel. Combinado antes da visita.',
      },
      {
        q: 'Como funciona a avaliação?',
        a: 'Comparativo com até 12 transações similares da região, análise de preço/m² e ajuste por estado de conservação. Documento em PDF em 48h.',
      },
      {
        q: 'Atende em quais regiões?',
        a: 'Toda a Grande São Paulo. Atendo com mais volume em Pinheiros, Vila Madalena, Jardins, Itaim e Brooklin.',
      },
    ],
    ctaTitle: 'Vamos achar o imóvel certo',
    ctaLabel: 'Buscar imóvel comigo',
    whatsapp: '5511966778899',
    phone: '(11) 3030-8899',
    email: 'ricardo@imoveiscerta.com.br',
    address: 'Atendo toda a Grande São Paulo · Escritório em Pinheiros',
    hours: 'Seg–Sáb, 8h–21h · Dom, 14h–18h',
    instagram: 'https://instagram.com/ricardo.imoveis.creci',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. PERSONAL TRAINER — Atendimento em academias, condomínios, home
  // ─────────────────────────────────────────────────────────────
  personal: {
    slug: 'personal-trainer',
    tagline: 'Personal trainer que ajusta o plano a cada 30 dias — não só entrega uma planilha.',
    palette: {
      primary: '#052e16',
      secondary: '#15803d',
      accent: '#22c55e',
      surface: '#f0fdf4',
    },
    aboutText:
      'Sou educador físico formado há 11 anos, com CREF ativo (064.221-G/SP) e 280 alunos atendidos em academias, condomínios e home. Especialização em hipertrofia e emagrecimento. 87% dos meus alunos ativos há mais de 6 meses batem a meta combinada no plano inicial. Avaliação física e postural inclusa.',
    hero: {
      eyebrow: 'Personal · Hipertrofia · Emagrecimento · Funcional',
      title: 'Treino sob medida, com plano revisado todo mês e resultado em 90 dias.',
      subtitle: 'Atendo em academias parceiras, condomínios e na sua casa. Avaliação física, postural e metabólica inclusa.',
      ctaLabel: 'Aula experimental grátis',
      ctaHref: '#contato',
      image: unsplash('1571019614242-c5c5dee9f50b'),
    },
    services: [
      { icon: '💪', name: 'Hipertrofia e força', desc: 'Plano progressivo, periodizado e ajustado a cada 30 dias conforme evolução.' },
      { icon: '🏃', name: 'Emagrecimento e composição', desc: 'Treino combinado com orientação alimentar e meta mensal de medida e peso.' },
      { icon: '🧘', name: 'Funcional e postura', desc: 'Mobilidade, core, correção postural e prevenção de lesão para rotina.' },
      { icon: '🏠', name: 'Home training', desc: 'Atendimento na sua casa, com ou sem equipamento, em São Paulo capital.' },
      { icon: '🏢', name: 'Condomínios e empresas', desc: 'Aulas em grupo ou individuais, com horários flexíveis e plano corporativo.' },
      { icon: '🩺', name: 'Avaliação física completa', desc: 'Composição corporal, perimetria, flexibilidade e teste de força por segmento.' },
    ],
    differentials: [
      { name: 'Aula experimental grátis', desc: '60 minutos para entender seu objetivo e mostrar como trabalho.' },
      { name: 'CREF ativo', desc: 'Profissional registrado e formado em Educação Física. Inscrição validável no site do CREF.' },
      { name: 'Plano revisado a cada 30 dias', desc: 'Reunião rápida de avaliação, ajuste de carga e nova meta. Sem planilha parada.' },
      { name: 'Atendo onde você treina', desc: 'Academia, condomínio, praça ou sua casa. Sem desculpa para faltar.' },
    ],
    stats: [
      { value: '11 anos', label: 'de CREF' },
      { value: '280', label: 'alunos atendidos' },
      { value: '87%', label: 'batem meta em 6 meses' },
      { value: '30 dias', label: 'frequência de revisão' },
    ],
    testimonials: [
      {
        name: 'Camila Rocha',
        role: 'Aluna há 14 meses',
        text: 'Perdi 14kg em 6 meses sem passar fome. Ele ajusta o treino todo mês e me cobra os resultados. Mudou minha relação com exercício.',
      },
      {
        name: 'Bruno Saldanha',
        role: 'Empresário — Home training',
        text: 'Treino 3x por semana no escritório, no horário do almoço. Resultado de academia, sem enfrentar trânsito. Ele leva tudo.',
      },
      {
        name: 'Renata Ferreira',
        role: 'Mãe de 2 — Condomínio',
        text: 'Aula às 6h30 no salão do prédio. Antes eu enrolava pra ir na academia. Agora não perco um dia, ele cobra presença.',
      },
    ],
    faq: [
      {
        q: 'Quanto custa a mensalidade?',
        a: 'A partir de R$ 480/semana em academia. Home training em São Paulo capital a partir de R$ 600/sessão. Pacotes corporativos sob orçamento.',
      },
      {
        q: 'Em quanto tempo vejo resultado?',
        a: 'Em 30 dias você sente diferença. Em 90 dias, medida e peso. Em 6 meses, mudança visível pra quem convive com você.',
      },
      {
        q: 'Preciso de equipamento em casa?',
        a: 'Não. Trabalho com peso do corpo, elásticos e itens portáteis. Para hipertrofia avançada, indico kit mínimo que cabe em 1 m².',
      },
    ],
    ctaTitle: 'Bora pra primeira aula?',
    ctaLabel: 'Agendar experimental grátis',
    whatsapp: '5511944332211',
    phone: '(11) 3030-2211',
    email: 'contato@personaltrainer.com.br',
    address: 'Atendo em academias, condomínios e home em São Paulo capital',
    hours: 'Seg–Sáb, 5h30–21h',
    instagram: 'https://instagram.com/personal.lucas.cref',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. CONSULTOR — Consultor empresarial, mentoria 1:1 para PMEs
  // ─────────────────────────────────────────────────────────────
  consultor: {
    slug: 'consultor',
    tagline: 'Mentoria 1:1 para quem já tem empresa e quer destravar o próximo nível.',
    palette: {
      primary: '#1a0b3e',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      surface: '#faf5ff',
    },
    aboutText:
      'Sou consultor empresarial há 17 anos, com passagem por empresa própria (faturei R$ 4 mi/ano antes de vender) e MBA pela FGV. Já conduzi 220 projetos em 18 setores, de clínica médica a indústria. Hoje atendo 32 clientes em mentoria 1:1 — não turma, não workshop, conversa semanal comigo mesmo.',
    hero: {
      eyebrow: 'Consultoria · Mentoria 1:1 · Estratégia',
      title: 'Mentoria executiva para quem está cansado de planilha bonita e resultado medíocre.',
      subtitle: '17 anos de estrada, 220 projetos e mentoria semanal 1:1. Não é curso, não é workshop — é decisão acompanhada de perto.',
      ctaLabel: 'Diagnóstico estratégico',
      ctaHref: '#contato',
      image: unsplash('1573497019418-b400bb3ab074'),
    },
    services: [
      { icon: '📈', name: 'Mentoria 1:1 semanal', desc: 'Encontro de 60 minutos toda semana, com plano de ação e accountability.' },
      { icon: '🧭', name: 'Planejamento estratégico', desc: 'Plano de 12 meses com metas trimestrais, KPIs por área e revisão mensal.' },
      { icon: '💰', name: 'Diagnóstico financeiro', desc: 'Análise de margem, DRE, fluxo de caixa, precificação e ponto de equilíbrio.' },
      { icon: '🚀', name: 'Estruturação comercial', desc: 'Funil de vendas, equipe, metas, CRM e ritual comercial.' },
      { icon: '👥', name: 'Gestão de time', desc: 'Organograma, contratação, avaliação de desempenho e plano de cargos.' },
      { icon: '🎯', name: 'Operação e produtividade', desc: 'Diagnóstico operacional, eliminação de desperdício e ganho de margem.' },
    ],
    differentials: [
      { name: 'Mentoria 1:1', desc: 'Sem turma, sem webinar gravado. Cada sessão é comigo, do começo ao fim do contrato.' },
      { name: 'Já fui dono de empresa', desc: 'Faturei, contratei, demiti, vendi. Não sou teórico — já quebrei e refiz resultado.' },
      { name: 'Garantia da 1ª sessão', desc: 'Se após o diagnóstico inicial você não enxergar valor, devolvo 100% do valor pago.' },
      { name: 'Resposta em até 24h', desc: 'WhatsApp direto comigo para dúvidas entre as sessões, sem filtro de analista.' },
    ],
    stats: [
      { value: '17 anos', label: 'no mercado' },
      { value: '220', label: 'projetos conduzidos' },
      { value: '32', label: 'clientes ativos em mentoria' },
      { value: '18', label: 'setores atendidos' },
    ],
    testimonials: [
      {
        name: 'Cláudia Bertoldo',
        role: 'CEO, agência de marketing',
        text: 'Em 9 meses saí de R$ 380 mil/ano para R$ 1,8 mi. Não foi mágica, foi método. Ele cobra, eu executo. Funciona.',
      },
      {
        name: 'Thiago Mancini',
        role: 'Sócio, indústria de alimentos',
        text: 'Já gastei R$ 60 mil em curso de gestão. Esse mentoring me devolveu R$ 480 mil em 14 meses. Foco, cobrança e método.',
      },
      {
        name: 'Fernanda Vasconcelos',
        role: 'Sócia, clínica médica',
        text: 'Passei de médica para empresária. Ele me ajudou a montar time, precificar e abrir 2 unidades. Hoje fatura R$ 2,4 mi/ano.',
      },
    ],
    faq: [
      {
        q: 'Quanto custa a mentoria?',
        a: 'Pacote mensal a partir de R$ 4.800/mês com encontro semanal. Pacote trimestral com desconto. Diagnóstico inicial cobrado à parte, R$ 1.200.',
      },
      {
        q: 'Para qual perfil é indicado?',
        a: 'Donos de empresa com faturamento entre R$ 500 mil e R$ 20 mi/ano. Não atende iniciantes nem grandes corporações.',
      },
      {
        q: 'É online ou presencial?',
        a: 'Os dois. Sessões por vídeo, mas presencial em São Paulo capital (Itaim Bibi) sob agendamento. Atendo clientes em 12 estados.',
      },
    ],
    ctaTitle: 'Vamos tirar a empresa do piloto automático?',
    ctaLabel: 'Marcar diagnóstico estratégico',
    whatsapp: '5511977665544',
    phone: '(11) 3030-5544',
    email: 'marcos@consultorempresarial.com.br',
    address: 'Atendimento online em todo o Brasil · Presencial em São Paulo capital',
    hours: 'Seg–Sex, 8h–19h',
    instagram: 'https://instagram.com/consultor.marcos.mba',
  },
};
