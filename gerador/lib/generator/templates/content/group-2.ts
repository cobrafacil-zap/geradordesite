import type { ContentPack } from './registry';

// Helper para gerar URL Unsplash com tamanho consistente.
const img = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const GROUP_2: Record<string, ContentPack> = {
  // 1) STARTUP — IA para PMEs, receita preditiva
  startup: {
    slug: 'startup',
    tagline: 'A IA que lê seus números e te avisa onde a próxima venda vai cair.',
    palette: {
      primary: '#1a0b2e',
      secondary: '#7c3aed',
      accent: '#22d3ee',
      surface: '#fdf4ff',
    },
    hero: {
      eyebrow: 'IA · Receita · CFO de bolso',
      title: 'Previsão de receita que cabe no seu ERP — e no seu tempo.',
      subtitle:
        'Conectamos no seu Omie, Conta Azul ou QuickBooks e devolvemos bear, base e bull case em 3 cliques. Sem trocar de sistema, sem planilha, sem enrolação.',
      ctaLabel: 'Ver demo com meus números',
      ctaHref: '#contato',
      image: img('1551288049-bebda4e38f71'),
      imageAlt: 'Dashboard de analytics com gráficos de previsão de receita',
    },
    aboutText:
      'Somos 42 pessoas obcecadas por finanças de PME. Treinamos modelos em +14 mil empresas brasileiras e atendemos 520 clientes ativos no Brasil e México. ARR de R$ 22 mi em 2025 — sem rodada série C, sem equity diluído.',
    services: [
      { icon: '🧠', name: 'IA preditiva de receita', desc: 'Modelos próprios que aprendem com seu histórico e devolvem forecast diário, não mensal.' },
      { icon: '📊', name: 'Cenários bear/base/bull', desc: 'Três caminhos calculados em tempo real, com intervalo de confiança explícito.' },
      { icon: '🔌', name: 'Plug & play com seu ERP', desc: 'Omie, Conta Azul, QuickBooks, Bling e Tiny. Conexão em 20 minutos, sem consultoria.' },
      { icon: '📱', name: 'Mobile CFO', desc: 'Receba alerta no WhatsApp quando o forecast sair da meta — sem abrir dashboard.' },
      { icon: '🧾', name: 'Detecção de anomalia', desc: 'A IA avisa quando uma conta, cliente ou produto começa aperformar diferente.' },
      { icon: '🤝', name: 'Onboarding com humano', desc: 'Especialista dedicado nos primeiros 14 dias, depois é só manter.' },
    ],
    differentials: [
      { name: '7 dias para a primeira previsão', desc: 'Conexão, calibração e primeiro cenário em uma semana útil. Garantido em contrato.' },
      { name: 'Sem trocar de ERP', desc: 'Integramos onde você já está. Você continua operando no sistema que gosta.' },
      { name: 'IA explicável', desc: 'Cada número vem com o racional, os drivers e o peso de cada variável.' },
      { name: 'Preço por PME, não por assento', desc: 'Plano único. CFO, controller e três analistas pelo mesmo valor.' },
    ],
    stats: [
      { value: '520', label: 'PMEs ativas' },
      { value: 'R$ 22 mi', label: 'ARR em 2025' },
      { value: '94%', label: 'precisão de forecast' },
      { value: '4,9/5', label: 'G2 (45 reviews)' },
    ],
    testimonials: [
      { name: 'Renata Aguiar', role: 'CFO, Bistek Suplementos', text: 'Saí do achismo pra fechar o mês com 96% de acurácia. A IA pegou uma sazonalidade que a gente não via em planilha nenhuma.' },
      { name: 'Marcos Vinícius Toledo', role: 'CEO, Linhas Aérias Gerais', text: 'Implementação em 5 dias, sem dor de cabeça. Hoje o forecast roda no celular do meu celular.' },
      { name: 'Letícia Hayashi', role: 'Controller, Grupo Faro', text: 'A detecção de anomalia já nos poupou de três inadimplências grandes. Valeu o ano.' },
    ],
    faq: [
      { q: 'Preciso trocar de ERP?', a: 'Não. Integramos com o que você já usa. Se trocar amanhã, mudamos a conexão e mantemos a IA.' },
      { q: 'Funciona para empresa de 5 pessoas?', a: 'Sim, desde que você tenha pelo menos 12 meses de receita registrada. Abaixo disso o modelo fica fraco.' },
      { q: 'Os dados ficam seguros?', a: 'Servidores no Brasil (AWS São Paulo), criptografia em repouso e em trânsito, SOC 2 tipo II auditado.' },
    ],
    ctaTitle: 'Veja seu forecast em 7 dias',
    ctaLabel: 'Quero a demo',
    whatsapp: '5511933004477',
    phone: '(11) 4000-3030',
    email: 'ola@previsaoia.com.br',
    address: 'WeWork — Av. Paulista, 1374 — Bela Vista, São Paulo/SP',
    hours: 'Seg–Sex, 9h–19h · Suporte on-call',
    cnpj: '48.220.118/0001-04',
    instagram: 'https://instagram.com/previsaoia',
  },

  // 2) EMPRESA LOCAL — Padaria/confeitaria de bairro
  'empresa-local': {
    slug: 'empresa-local',
    tagline: 'A padaria do bairro que virou ponto de encontro da família Ferreira.',
    palette: {
      primary: '#5b2a0f',
      secondary: '#b45309',
      accent: '#eab308',
      surface: '#fff8ed',
    },
    hero: {
      eyebrow: 'Padaria · Confeitaria · Café do seu jeito',
      title: 'Pão na chapa, café coado na hora, e o vizinho na mesa do lado.',
      subtitle:
        'Três gerações assando no mesmo ponto desde 1987. Mais de 80 receitas entre pães de fermentação natural, bolos caseiros e salgados de forno.',
      ctaLabel: 'Ver cardápio da semana',
      ctaHref: '#cardapio',
      image: img('1568259265855-d55e0c0503a3'),
      imageAlt: 'Pão artesanal recém-saído do forno a lenha',
    },
    aboutText:
      'A Ferreira & Filhos nasceu na esquina da Rua das Acácias em 1987 com um forno a lenha e uma receita de pão caseiro passada pela avó Helena. Hoje são três unidades, 28 colaboradores e o mesmo fermento natural de 36 horas. O café é nosso, o pão é nosso, a conversa é do bairro.',
    services: [
      { icon: '🥖', name: 'Pães de fermentação natural', desc: 'Levain de 36h, farinha orgânica e o mesmo forno a lenha desde o primeiro dia.' },
      { icon: '🎂', name: 'Bolos sob encomenda', desc: 'Aniversários, casamentos e coffee corporativo. Encomenda com 72h de antecedência.' },
      { icon: '☕', name: 'Café da manhã completo', desc: 'Pão na chapa, manteiga da fazenda, queijo minas, café coado na hora. R$ 28 o combo.' },
      { icon: '🥐', name: 'Salgados assados', desc: 'Coxinha, esfiha, palmier, empada — tudo assado, nada frito, fresco de hora em hora.' },
      { icon: '🛵', name: 'Delivery no bairro', desc: 'Raio de 4 km, entrega em até 40 minutos, frete grátis acima de R$ 60.' },
      { icon: '🎉', name: 'Cestas e kits presente', desc: 'Cestas montadas com pão, queijo, doce e café. A gente entrega pra quem você quiser.' },
    ],
    differentials: [
      { name: 'Forno a lenha, todo dia', desc: 'Três fornos funcionando das 4h às 22h. Sabor que só lenha dá.' },
      { name: 'Sem conservante, sem mistura', desc: 'Produção diária, congelamento zero. O que sobrou ontem vira ração da horta.' },
      { name: 'Aberto até tarde', desc: 'Das 6h às 22h, todos os dias do ano, inclusive Natal e Ano Novo.' },
    ],
    stats: [
      { value: '38 anos', label: 'na mesma esquina' },
      { value: '28', label: 'colaboradores' },
      { value: '80+', label: 'itens no balcão' },
      { value: '3 unidades', label: 'no bairro' },
    ],
    menu: [
      { name: 'Pão francês (unidade)', price: 'R$ 1,30' },
      { name: 'Pão de queijo mineiro (un)', price: 'R$ 4,00' },
      { name: 'Pão caseiro da Helena (1 kg)', price: 'R$ 32,00' },
      { name: 'Bolo de cenoura com chocolate (fatia)', price: 'R$ 11,00' },
      { name: 'Coxinha de frango com catupiry (un)', price: 'R$ 7,50' },
      { name: 'Torta de palmito (inteira)', price: 'R$ 92,00' },
      { name: 'Combo café da manhã', price: 'R$ 28,00' },
      { name: 'Cesta artesanal (média)', price: 'R$ 145,00' },
    ],
    testimonials: [
      { name: 'Cláudia Mascarenhas', role: 'Cliente desde 2009', text: 'Meus filhos cresceram com o pão de queijo da Ferreira. Hoje levo meus netos no mesmo balcão. Não troco por nada.' },
      { name: 'Roberto Nasser', role: 'Morador do bairro', text: 'Café das 7h, todo dia, na mesa da dona Helena. Padaria de verdade, do jeito que era.' },
    ],
    faq: [
      { q: 'Vocês fazem entrega?', a: 'Sim, raio de 4 km das 7h às 20h. Frete grátis acima de R$ 60. Pedidos pelo WhatsApp.' },
      { q: 'Quanto antes preciso encomendar um bolo?', a: 'Bolos simples: 48h. Bolos decorados e cenográficos: 5 dias úteis. Encomendas grandes: com 15 dias.' },
      { q: 'Tem pão sem glúten?', a: 'Temos duas opções de pão sem glúten às quartas e sextas. Demanda alta, vale encomendar.' },
    ],
    ctaTitle: 'Encomenda pelo WhatsApp em 2 minutos',
    ctaLabel: 'Pedir agora',
    whatsapp: '5511982005566',
    phone: '(11) 2233-1010',
    email: 'oi@padariaferreira.com.br',
    address: 'Rua das Acácias, 230 — Vila Madalena, São Paulo/SP',
    hours: 'Todos os dias, 6h–22h (inclusive feriados)',
    cnpj: '62.184.337/0001-22',
    instagram: 'https://instagram.com/padariaferreira',
  },

  // 3) ESCRITÓRIO DE ADVOCACIA — Full service B2B, sério mas acessível
  'escritorio-advocacia': {
    slug: 'escritorio-advocacia',
    tagline: 'Advocacia B2B séria, mas sem o juridiquês que ninguém aguenta.',
    mode: 'dark',
    palette: {
      primary: '#1c0a2e',
      secondary: '#581c87',
      accent: '#c4b5fd',
      surface: '#faf7ff',
    },
    hero: {
      eyebrow: 'Empresarial · Tributário · Contencioso estratégico',
      title: 'O jurídico que fala a língua do CFO — e devolve resultado.',
      subtitle:
        '38 advogados, 14 áreas, 1.400 processos ativos. Atendemos grupos de médio e grande porte nos 26 estados e DF, com sócio em cada demanda.',
      ctaLabel: 'Marcar conversa com sócio',
      ctaHref: '#contato',
      image: img('1589829545856-d10d557cf95f'),
      imageAlt: 'Escritório de advocacia moderno com estantes de livros',
    },
    aboutText:
      'Boutique full service com DNA de consultoria. Em 18 anos viramos referência em M&A, planejamento tributário e contencioso estratégico para grupos com faturamento entre R$ 80 mi e R$ 1,2 bi. Honorário fixo mensal combinado, sem surpresa na fatura.',
    services: [
      { icon: '🏛️', name: 'Direito empresarial e M&A', desc: 'Due diligence, contratos, societário, compra e venda de empresas, joint ventures.' },
      { icon: '💰', name: 'Tributário e fiscal', desc: 'Planejamento tributário, contencioso, recuperação de créditos e blindagem patrimonial.' },
      { icon: '👔', name: 'Trabalhista estratégico', desc: 'Consultivo, contencioso, negociação sindical e programas de retenção.' },
      { icon: '🌐', name: 'LGPD e direito digital', desc: 'Adequação à LGPD, cibersegurança contratual e resposta a incidentes.' },
      { icon: '🏘️', name: 'Imobiliário e regularização', desc: 'Due diligence, contratos, estruturação de operações e registro.' },
      { icon: '⚖️', name: 'Contencioso estratégico', desc: 'Atuação em STJ, STF e tribunais superiores. Time próprio de litigância.' },
    ],
    differentials: [
      { name: 'Sócio em toda demanda', desc: 'Cada cliente tem um sócio de referência que toca o processo do começo ao fim.' },
      { name: 'Honorários claros', desc: 'Tabela pública no site e orçamento detalhado em até 48h úteis.' },
      { name: 'Resposta em 24h úteis', desc: 'Todo e-mail ou mensagem tem retorno dentro de um dia útil. Garantido em SLA.' },
      { name: 'Visão de negócio', desc: 'Recomendação vem com estimativa de impacto financeiro e alternativas. Não ficamos no juridiquês.' },
    ],
    stats: [
      { value: '38', label: 'advogados' },
      { value: '14', label: 'áreas' },
      { value: '1.400', label: 'processos ativos' },
      { value: 'R$ 480 mi', label: 'em créditos recuperados' },
    ],
    testimonials: [
      { name: 'Eduardo Whitaker', role: 'CFO, Grupo Marquise', text: 'O tributário deles identificou R$ 18 mi em créditos que a contabilidade antiga não enxergou. Honorário se pagou em 40 dias.' },
      { name: 'Marina Beltrão', role: 'Diretora jurídica, holding industrial', text: 'Linguagem executiva, sem enrolação. Quando pedem prazo, cumprem. Raro no mercado jurídico.' },
      { name: 'Felipe Drummond', role: 'CEO, fintech série B', text: 'Apoiaram nosso M&A do começo ao fim. Due diligence cirúrgica, fechamento em 78 dias.' },
    ],
    faq: [
      { q: 'Vocês têm honorário fixo mensal?', a: 'Sim, é o modelo padrão para clientes recorrentes. Combina escopo, prazo e SLA. Sem surpresa de hora extra.' },
      { q: 'Atendem fora de São Paulo?', a: 'Atendemos clientes nos 26 estados e DF. Para casos complexos, deslocamos o sócio responsável.' },
      { q: 'Como funciona o orçamento para uma demanda pontual?', a: 'Recebemos o briefing, avaliamos em até 48h úteis e devolvemos proposta fechada com escopo, prazo e valor.' },
    ],
    ctaTitle: 'Fale com o sócio da área',
    ctaLabel: 'Marcar conversa',
    whatsapp: '5511950007733',
    phone: '(11) 3218-9090',
    email: 'contato@escritorioadv.com.br',
    address: 'Av. Paulista, 1009 — 14º andar — Bela Vista, São Paulo/SP',
    hours: 'Seg–Sex, 8h–19h · Plantão jurídico para clientes',
    cnpj: '29.471.882/0001-46',
    instagram: 'https://instagram.com/escritorioadv',
  },

  // 4) CLÍNICA MÉDICA — Multidisciplinar, 22+ especialidades
  'clinica-medica': {
    slug: 'clinica-medica',
    tagline: 'Clínica multidisciplinar que entende de gente — não só de especialidade.',
    palette: {
      primary: '#0c4a6e',
      secondary: '#0891b2',
      accent: '#10b981',
      surface: '#f0f9ff',
    },
    hero: {
      eyebrow: '22 especialidades · Exames no local · Convênios',
      title: 'Você marca uma vez. Resolve tudo no mesmo lugar.',
      subtitle:
        'Cardiologista, ortopedista, pediatra, ginecologista, exames de sangue e imagem no mesmo prédio. Sem correr entre consultórios diferentes.',
      ctaLabel: 'Agendar consulta agora',
      ctaHref: '#contato',
      image: img('1576091160399-112ba8d25d1d'),
      imageAlt: 'Consultório médico moderno com profissional de saúde',
    },
    aboutText:
      '42 médicos em 22 especialidades, equipe de enfermagem própria, laboratório e centro de imagem no mesmo prédio. Atendemos 18 convênios e particular. Em 12 anos, somamos mais de 140 mil pacientes atendidos com NPS de 82.',
    services: [
      { icon: '🩺', name: 'Clínica médica e check-up', desc: 'Consulta de rotina e check-up executivo com 14 exames em 3 horas.' },
      { icon: '❤️', name: 'Cardiologia', desc: 'Consulta, ECG, ecocardiograma, teste ergométrico e holter 24h.' },
      { icon: '🧠', name: 'Neurologia', desc: 'Cefaleia, epilepsia, sono, demência e doenças neuromusculares.' },
      { icon: '🦴', name: 'Ortopedia', desc: 'Consultas, infiltração, tratamento conservador e pós-cirúrgico.' },
      { icon: '👶', name: 'Pediatria e puericultura', desc: 'Acompanhamento do recém-nascido à adolescência, com calendário vacinal.' },
      { icon: '🔬', name: 'Laboratório e imagem', desc: 'Coleta no local, resultado de sangue em até 12h, USG, raio-X e mamografia digital.' },
    ],
    differentials: [
      { name: 'Tudo no mesmo prédio', desc: 'Consulta, exame de sangue e imagem na mesma visita. Sem voltar em outro dia.' },
      { name: 'Agendamento online real', desc: 'Marca, desmarca e recebe confirmação por WhatsApp. Sem telefone tocando 40 minutos.' },
      { name: 'Equipe que se fala', desc: 'Discussão de casos entre especialistas registrada em prontuário. Você não precisa explicar de novo.' },
      { name: 'Sem fila no balcão', desc: 'Recepção organizada por horário. Tempo médio de espera: 11 minutos.' },
    ],
    stats: [
      { value: '42', label: 'médicos' },
      { value: '22', label: 'especialidades' },
      { value: '140k+', label: 'pacientes atendidos' },
      { value: '82', label: 'NPS' },
    ],
    testimonials: [
      { name: 'Helena Prado', role: 'Paciente desde 2019', text: 'Minha mãe, meu marido e eu fazemos check-up lá. Saímos com tudo resolvido no mesmo dia. Vale cada minuto.' },
      { name: 'Dr. Otávio Peçanha', role: 'Médico do trabalho, Multinacional X', text: 'Indicamos para todo o nosso corporativo. Agilidade, relatório no prazo, equipe que escuta. Diferenciado.' },
    ],
    faq: [
      { q: 'Quais convênios vocês aceitam?', a: 'Atendemos 18 convênios principais (SulAmérica, Bradesco Saúde, Amil, NotreDame Intermédica, Unimed e outros) e particular.' },
      { q: 'Consigo marcar pelo WhatsApp?', a: 'Sim, mandamos confirmação, link de teleconsulta e lembretes. Funciona melhor do que app na maioria dos casos.' },
      { q: 'Tem atendimento aos sábados?', a: 'Sim, aos sábados das 7h às 13h. Pediatria, clínica médica e coleta laboratorial.' },
    ],
    ctaTitle: 'Agende sua consulta agora',
    ctaLabel: 'Marcar consulta',
    whatsapp: '5511988442233',
    phone: '(11) 4002-2002',
    email: 'agendamento@clinicavida.com.br',
    address: 'Rua Augusta, 1500 — Consolação, São Paulo/SP',
    hours: 'Seg–Sex, 7h–21h · Sáb, 7h–13h',
    cnpj: '17.402.633/0001-81',
    instagram: 'https://instagram.com/clinicavida',
  },

  // 5) ODONTOLOGIA — Premium, implantes, ortodontia invisível, estética
  odontologia: {
    slug: 'odontologia',
    tagline: 'Odontologia premium que redesenha sorrisos — sem dor e sem improviso.',
    palette: {
      primary: '#0e7490',
      secondary: '#06b6d4',
      accent: '#a7f3d0',
      surface: '#ecfeff',
    },
    hero: {
      eyebrow: 'Implantes · Ortodontia invisível · Estética',
      title: 'Planejamento em 3D. Resultado antes da primeira broca.',
      subtitle:
        'Scanner intraoral, cirurgia guiada por computador e sedação consciente. Mais de 8.000 sorrisos refeitos com plano escrito e garantia de 10 anos em implantes.',
      ctaLabel: 'Marcar avaliação gratuita',
      ctaHref: '#contato',
      image: img('1606811971618-4486d14f3f99'),
      imageAlt: 'Consultório odontológico premium com tecnologia moderna',
    },
    aboutText:
      '12 dentistas em 9 especialidades, com tecnologia CAD/CAM, scanner 3D iTero, impressora 3D e centro de imagem próprio. Atendemos adultos e adolescentes em casos que vão do simples clareamento à reabilitação oral completa. Mais de 8.000 sorrisos entregues com taxa de retrabalho de 1,4%.',
    services: [
      { icon: '🦷', name: 'Implantes premium', desc: 'Marcas europeias, cirurgia guiada por computador, garantia escrita de 10 anos.' },
      { icon: '😁', name: 'Lentes de contato dental', desc: 'Planejamento digital do sorriso, mockup no seu rosto antes do procedimento.' },
      { icon: '🔧', name: 'Ortodontia invisível', desc: 'Alinhadores Invisalign e similares, com acompanhamento quinzenal via app.' },
      { icon: '✨', name: 'Clareamento a laser', desc: 'Sessão única de 1h30 em consultório, com resultados visíveis na mesma consulta.' },
      { icon: '🛡️', name: 'Endodontia com microscopia', desc: 'Tratamento de canal com microscópio Zeiss, preservando ao máximo o dente natural.' },
      { icon: '🧒', name: 'Odontopediatria', desc: 'Atendimento lúdico, preventivo e livre de trauma para crianças a partir dos 3 anos.' },
    ],
    differentials: [
      { name: 'Avaliação sem custo', desc: 'Plano detalhado por escrito, com fotos, valores e cronograma. Sem compromisso.' },
      { name: 'Tecnologia 3D ponta a ponta', desc: 'Scanner intraoral, cirurgia guiada e provisórios impressos em 3D. Sem moldeira desconfortável.' },
      { name: 'Sedação consciente', desc: 'Para quem tem medo de dentista. Equipe de anestesiologia de apoio, monitoramento contínuo.' },
      { name: 'Garantia de 10 anos', desc: 'Em implantes, com revisão anual gratuita incluída. Documentado em contrato.' },
    ],
    stats: [
      { value: '12', label: 'especialistas' },
      { value: '9', label: 'especialidades' },
      { value: '8.000+', label: 'sorrisos refeitos' },
      { value: '98%', label: 'aprovação' },
    ],
    testimonials: [
      { name: 'Camila Vasconcelos', role: 'Executiva, paciente há 4 anos', text: 'Coloquei 4 implantes e fiz clareamento. Mostraram o resultado no computador antes da primeira sessão. Zero surpresa.' },
      { name: 'Pedro Lemos', role: 'Atleta profissional', text: 'Lentes de contato dental + alinhador invisível. Terminei em 11 meses e ninguém percebeu que eu estava em tratamento.' },
      { name: 'Sandra Khouri', role: 'Empresária', text: 'Tinha pavor de dentista. A sedação consciente mudou tudo. Coloquei 3 implantes sem perceber. Recomendo de olhos fechados.' },
    ],
    faq: [
      { q: 'A avaliação é mesmo gratuita?', a: 'Sim. Dura 40 minutos, inclui exame clínico, fotos e escaneamento 3D. Você sai com plano escrito e orçamento.' },
      { q: 'Quanto custa um implante?', a: 'O valor depende do caso, mas implantes premium com cirurgia guiada ficam entre R$ 4.500 e R$ 7.800. Parcelamos em até 18x.' },
      { q: 'Atendem convênio?', a: 'Somos particular e alguns planos odontológicos premium (SulAmérica Odonto, Amil Dental, MetLife). Confirmamos antes da avaliação.' },
    ],
    ctaTitle: 'Marque sua avaliação sem custo',
    ctaLabel: 'Avaliação grátis',
    whatsapp: '5511933009988',
    phone: '(11) 3224-5566',
    email: 'contato@sorrisostudio.com.br',
    address: 'Av. Brigadeiro Luís Antônio, 2200 — Jardim Paulista, São Paulo/SP',
    hours: 'Seg–Sex, 8h–21h · Sáb, 8h–14h',
    cnpj: '31.778.590/0001-12',
    instagram: 'https://instagram.com/sorrisostudio',
  },
};
