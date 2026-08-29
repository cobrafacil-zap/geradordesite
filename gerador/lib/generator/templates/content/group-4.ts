/**
 * Group 4 — 5 content packs com voz e personalidade únicas.
 * Cobre: agência de marketing, limpeza, imobiliária, loja de decoração, restaurante.
 * Cada pack tem opinião, números e zero clichê. Imagens: Unsplash.
 */

import type { ContentPack } from './registry';

// Helper local — gera URL Unsplash no formato padrão do projeto.
const unsplash = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const GROUP_4: Record<string, ContentPack> = {
  // ─────────────────────────────────────────────────────────────
  // 1. AGÊNCIA DE MARKETING — Performance, branding e conteúdo
  // ─────────────────────────────────────────────────────────────
  'agencia-marketing': {
    slug: 'agencia-marketing',
    tagline: 'Estratégia, mídia e conteúdo sob o mesmo teto — sem relatório fofo.',
    palette: {
      primary: '#2a0a4a',
      secondary: '#7c3aed',
      accent: '#ec4899',
      surface: '#faf5ff',
    },
    aboutText:
      'Boutique de marketing com 11 anos de mercado, 38 pessoas entre planners, criadores e mídia. Já torramos R$ 620 mi em ads para 142 clientes — varejo, SaaS, saúde e educação. Operamos com squads dedicados, dashboards em tempo real e meta de ROI cravada em contrato. Se a conta não fecha, a gente devolve.',
    hero: {
      eyebrow: 'Performance · Branding · Conteúdo',
      title: 'Mídia que dá resultado, marca que dá vontade, conteúdo que dá clique.',
      subtitle: 'Atendemos marcas que odeiam vaidade. Planos trimestrais, relatórios semanais e reuniões com o C-level — não com o estagiário.',
      ctaLabel: 'Pedir diagnóstico gratuito',
      ctaHref: '#contato',
      image: unsplash('1542744173-8e7e53415bb0'),
    },
    services: [
      { icon: '📈', name: 'Performance e mídia paga', desc: 'Google Ads, Meta Ads, TikTok Ads e programática. Gestão com meta de CAC e ROAS cravadas.' },
      { icon: '🎨', name: 'Branding e posicionamento', desc: 'Identidade visual, tom de voz, manifesto de marca e arquitetura de marca.' },
      { icon: '✍️', name: 'Conteúdo e social media', desc: 'Redes sociais, blog, e-mail marketing, SEO e produção de podcast.' },
      { icon: '🤖', name: 'Marketing automation', desc: 'RD Station, HubSpot, ActiveCampaign e fluxos com IA para qualificação de leads.' },
      { icon: '🛒', name: 'E-commerce e CRO', desc: 'VTEX, Shopify, Wake e-commerce. Testes A/B, landing pages e funis completos.' },
      { icon: '📊', name: 'Analytics e BI', desc: 'Looker, Metabase, GA4 e dashboards customizados para a operação do cliente.' },
    ],
    differentials: [
      { name: 'Squad dedicado, não PJ', desc: 'Time exclusivo, com contrato e meta de ROI. Sem rodízio de analista a cada 90 dias.' },
      { name: 'Compromisso de resultado em contrato', desc: 'Se não bater a meta de ROAS, devolvemos 30% do fee. Já devolvemos 2 vezes.' },
      { name: 'Reunião com C-level, não com estagiário', desc: 'Head de estratégia entra na primeira reunião e fica até o último relatório.' },
    ],
    stats: [
      { value: 'R$ 620 mi', label: 'em mídia veiculada' },
      { value: '142', label: 'clientes atendidos' },
      { value: '4,3x', label: 'ROAS médio em e-commerce' },
      { value: '11 anos', label: 'no mercado' },
    ],
    testimonials: [
      {
        name: 'Bruno Whitaker',
        role: 'CMO, Livelo',
        text: 'Trocaram a agência anterior em 60 dias. ROAS saiu de 2,1x para 5,8x em um trimestre. Cumpriram cronograma e meta de CPA.',
      },
      {
        name: 'Helena Quintela',
        role: 'CEO, DTC de cosméticos',
        text: 'A primeira agência que entregou o que prometeu em contrato. Reportam CAC por SKU, não por agregado. Raro.',
      },
      {
        name: 'Pedro Saldanha',
        role: 'Head de Growth, fintech B2B',
        text: 'Pipeline de MQLs cresceu 3,2x em 9 meses. A equipe de conteúdo virou braço do nosso marketing.',
      },
    ],
    faq: [
      {
        q: 'Vocês fecham em fee fixo ou percentual de mídia?',
        a: 'Os dois. Fee mensal de R$ 18 mil a R$ 80 mil + 12% de comissão de mídia. Modelo transparente, sem mark-up escondido.',
      },
      {
        q: 'Trabalham com que portes de empresa?',
        a: 'Faturamento a partir de R$ 5 mi/ano. Para startups pré-receita, indicamos 2 parceiros com ticket menor.',
      },
      {
        q: 'Fazem mídia em quais plataformas?',
        a: 'Google, Meta, TikTok, LinkedIn, Pinterest, Spotify, programmatic (DV360) e mídia off (rádio, OOH), sob curadoria.',
      },
    ],
    ctaTitle: 'Sua próxima campanha pode começar amanhã',
    ctaLabel: 'Pedir diagnóstico gratuito',
    whatsapp: '5511934567890',
    phone: '(11) 4567-8901',
    email: 'oi@violetacompany.com.br',
    address: 'Rua Capote Valente, 671 — Pinheiros, São Paulo/SP',
    hours: 'Seg–Sex, 9h–19h · Plantão aos sábados para crises de mídia',
    cnpj: '32.187.940/0001-25',
    instagram: 'https://instagram.com/violetacompany',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. LIMPEZA — Diaristas, faxina, pós-obra e limpeza empresarial
  // ─────────────────────────────────────────────────────────────
  'limpeza': {
    slug: 'limpeza',
    tagline: 'Faxina séria, equipe uniformizada e sem aquela velha surpresa no boleto.',
    palette: {
      primary: '#064e3b',
      secondary: '#10b981',
      accent: '#84cc16',
      surface: '#ecfdf5',
    },
    aboutText:
      'Operamos com 240 profissionais CLT, todas mulheres, com carteira assinada, uniforme e seguro de R$ 80 mil incluso. Já entramos em 42 mil residências e 680 empresas em São Paulo. Atendemos Zona Sul, Zona Oeste, Centro, ABC e Guarulhos. Pagamos o piso da categoria + 18% de adicional de insalubridade — porque faxineira não é bico.',
    hero: {
      eyebrow: 'Diaristas · Pós-obra · Empresarial',
      title: 'Chega de diarista que não aparece, não limpa ou cobra a mais.',
      subtitle: 'Reserva em 5 minutos pelo site, equipe chega no horário e se não gostar, refazemos sem custo. Simples assim.',
      ctaLabel: 'Reservar atendimento agora',
      ctaHref: '#contato',
      image: unsplash('1581578731548-c64695cc6952'),
    },
    services: [
      { icon: '🧹', name: 'Faxina residencial', desc: 'Diarista para 4h, 6h ou 8h. Quartos, cozinha, banheiros, áreas e passadoria leve.' },
      { icon: '🏗️', name: 'Pós-obra e mudança', desc: 'Limpeza pesada após reforma, tinta, gesso e entulho. Equipe de 4 a 6 pessoas.' },
      { icon: '🏢', name: 'Limpeza empresarial', desc: 'Escritórios, clínicas, coworking e lojas. Contrato mensal ou avulso.' },
      { icon: '🛋️', name: 'Higienização de estofados', desc: 'Sofás, colchões, cadeiras e carpetes. Secagem em 4h, sem cheiro.' },
      { icon: '✨', name: 'Limpeza detalhada', desc: 'Geladeira por dentro, forno, micro-ondas, armários, rejuntes e box de vidro.' },
      { icon: '🏠', name: 'Airbnb e temporada', desc: 'Rotação de hóspedes com check-list fotografado e reposição de amenities.' },
    ],
    differentials: [
      { name: 'Profissionais CLT, não "diaristas avulsas"', desc: 'Carteira assinada, uniforme, EPI e adicional de insalubridade. Equipe estável, sem rodízio de WhatsApp.' },
      { name: 'Seguro de R$ 80 mil incluso', desc: 'Se quebrar algo, a gente paga. Já acionamos 14 vezes em 8 anos — todas resolvidas em 72h.' },
      { name: 'Satisfação garantida em contrato', desc: 'Não gostou? Refazemos em até 48h, sem custo adicional. 96% dos clientes aprovam na primeira.' },
      { name: 'Foto do antes e depois', desc: 'Equipe tira foto da casa no início e no fim. Você vê o que pagou.' },
    ],
    stats: [
      { value: '42 mil+', label: 'residências atendidas' },
      { value: '240', label: 'profissionais CLT' },
      { value: '96%', label: 'de aprovação na primeira' },
      { value: 'R$ 80 mil', label: 'de seguro incluso' },
    ],
    testimonials: [
      {
        name: 'Carolina Marques',
        role: 'Moradora — Vila Mariana',
        text: 'Diarista chega às 8h, sai às 14h e eu nunca mais tive que limpar rejunte. Em 3 anos, mesma equipe, sem surpresa.',
      },
      {
        name: 'Marcelo Furtado',
        role: 'Síndico — Edifício Itaim',
        text: 'Contrato mensal para 3 halls e salão de festas. Cobram o que combinaram, entregam no padrão. Acabou a novela.',
      },
      {
        name: 'Renata Vieira',
        role: 'Host Airbnb — 4 imóveis',
        text: 'Rotação entre hóspedes sem stress. Foto do check-out no grupo, reposição de amenities, tudo certinho.',
      },
    ],
    faq: [
      {
        q: 'Como funciona o pagamento?',
        a: 'Pix, cartão em até 3x ou boleto. Pagamento só depois do serviço aprovado. Sem sinal antecipado.',
      },
      {
        q: 'Posso escolher a mesma profissional toda semana?',
        a: 'Sim, com plano semanal. Para avulso, a equipe roda conforme rota, mas sempre 2 a 3 profissionais fixas na região.',
      },
      {
        q: 'Atendem qual região?',
        a: 'Zona Sul, Zona Oeste, Centro, Pinheiros, Vila Mariana, Moema, ABC e Guarulhos. Confirme sua região pelo WhatsApp.',
      },
    ],
    ctaTitle: 'Reserva em 5 minutos, atendimento em até 48h',
    ctaLabel: 'Reservar pelo WhatsApp',
    whatsapp: '5511956471234',
    phone: '(11) 4567-1234',
    email: 'agendamento@verdefolha.com.br',
    address: 'Atendemos toda São Paulo capital, ABC e Guarulhos',
    hours: 'Seg–Sáb, 7h–20h · Dom só emergência',
    cnpj: '41.728.503/0001-19',
    instagram: 'https://instagram.com/verdefolha.limpeza',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. IMOBILIÁRIA — Imobiliária boutique de alto padrão
  // ─────────────────────────────────────────────────────────────
  'imobiliaria': {
    slug: 'imobiliaria',
    tagline: 'Imóveis de alto padrão para quem não tem tempo a perder com portaria.',
    palette: {
      primary: '#0c3a4a',
      secondary: '#0e7490',
      accent: '#0891b2',
      surface: '#f0f9ff',
    },
    aboutText:
      'Boutique imobiliária com 14 anos de mercado, 18 consultores CRECI e 1.380 imóveis ativos. Atendemos São Paulo, Rio, litoral norte e Balneário Camboriú. Ticket médio de R$ 6,2 mi. Já fechamos 1.840 transações e 92% dos clientes indicam a gente nos primeiros 6 meses.',
    hero: {
      eyebrow: 'Compra · Venda · Aluguel de temporada',
      title: 'A imobiliária que atende cliente como cliente, não como lead.',
      subtitle: 'Carteira selecionada, consultor dedicado do primeiro café à entrega das chaves. Sem atendimento por chatbot.',
      ctaLabel: 'Falar com consultor sênior',
      ctaHref: '#contato',
      image: unsplash('1560518883-ce09059eeffa'),
    },
    services: [
      { icon: '🏠', name: 'Compra e venda', desc: 'Assessoria completa do cadastro à escritura, com due diligence jurídica e estrutural.' },
      { icon: '🔑', name: 'Aluguel de temporada', desc: 'Apartamentos mobiliados em Jardins, Vila Olímpia, Rio e Búzios. Rentabilidade média de 0,8%/mês.' },
      { icon: '📋', name: 'Administração de aluguel', desc: 'Gestão completa com repasse, vistoria, manutenção e atendimento ao inquilino.' },
      { icon: '📑', name: 'Regularização documental', desc: 'Habite-se, ITBI, inventário, usufruto e adequação de matrícula em cartório.' },
      { icon: '💼', name: 'Investimento imobiliário', desc: 'Análise de viabilidade, prospecção off-market e estruturação de permuta.' },
      { icon: '🏗️', name: 'Lançamento na planta', desc: 'Acesso a 22 incorporadoras parceiras com tabela VGV e condições diferenciadas.' },
    ],
    differentials: [
      { name: 'Carteira curada, não garagem de imóvel', desc: 'Só entramos em carteira após vistoria técnica, documental e análise de mercado. Recusamos 6 em cada 10.' },
      { name: 'Consultor CRECI fixo', desc: 'Mesmo profissional do primeiro telefonema à assinatura. Sem rodízio, sem "fulano que está de férias".' },
      { name: 'Acesso off-market', desc: '52% dos imóveis que vendemos nunca foram anunciados. Chegam antes pro cliente, depois pro mercado.' },
    ],
    stats: [
      { value: '1.840', label: 'transações fechadas' },
      { value: '1.380', label: 'imóveis ativos' },
      { value: 'R$ 6,2 mi', label: 'ticket médio' },
      { value: '92%', label: 'indicam em 6 meses' },
    ],
    testimonials: [
      {
        name: 'Família Bertelli',
        role: 'Compradores — cobertura em Jardins',
        text: 'Vimos 11 coberturas em 3 meses com 4 imobiliárias. Esta foi a única que entregou análise comparativa de condomínio.',
      },
      {
        name: 'Roberto Villaça',
        role: 'Investidor — 5 imóveis de temporada',
        text: 'Operam meus 5 imóveis há 6 anos. Rentabilidade 30% acima do que eu conseguiria com autogestão, sem dor de cabeça.',
      },
      {
        name: 'Mariana Whitaker',
        role: 'Vendedora — Vila Olímpia',
        text: 'Venderam meu apartamento em 41 dias por 96% do pedido. A campanha de marketing deles é outro nível.',
      },
    ],
    faq: [
      {
        q: 'Como funciona a comissão?',
        a: '6% sobre o valor de venda, com possibilidade de negociação em imóveis acima de R$ 8 mi. Tudo formalizado em contrato.',
      },
      {
        q: 'Atendem fora de São Paulo?',
        a: 'Sim, com equipe local: Rio de Janeiro, Balneário Camboriú, Búzios e Porto Alegre. Mesmo padrão de atendimento.',
      },
      {
        q: 'Vocês fazem locação residencial comum?',
        a: 'Não. Focamos em alto padrão, temporada e comercial. Para residencial comum, indicamos 3 parceiros sérios.',
      },
    ],
    products: [
      {
        name: 'Cobertura Duplex — Jardins',
        price: 'R$ 12,8 mi',
        desc: '4 suítes, 480 m², terraço com piscina privativa, vista para o Parque Trianon. 5 vagas.',
        image: unsplash('1600596542815-ffad4c1539a9', 800, 600),
      },
      {
        name: 'Apartamento — Vila Olímpia',
        price: 'R$ 4,6 mi',
        desc: '3 dorms (1 suíte), 180 m², varanda gourmet, lazer completo com piscina aquecida. 3 vagas.',
        image: unsplash('1600585154340-be6161a56a0c', 800, 600),
      },
      {
        name: 'Casa Térrea — Alphaville 1',
        price: 'R$ 7,2 mi',
        desc: '5 suítes, 720 m², terreno de 1.200 m² com piscina, home theater e adega. 4 vagas cobertas.',
        image: unsplash('1568605114967-8130f3a36994', 800, 600),
      },
    ],
    ctaTitle: 'Vamos achar o imóvel certo — não o primeiro da lista',
    ctaLabel: 'Falar com consultor sênior',
    whatsapp: '5511945674321',
    phone: '(11) 4567-4321',
    email: 'contato@villaimob.com.br',
    address: 'Rua Haddock Lobo, 595 — Cerqueira César, São Paulo/SP',
    hours: 'Seg–Sáb, 9h–20h · Dom, 14h–18h (com agendamento)',
    cnpj: '28.473.916/0001-52',
    instagram: 'https://instagram.com/villaimob',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. LOJA — Decoração/objetos com curadoria autoral
  // ─────────────────────────────────────────────────────────────
  'loja': {
    slug: 'loja',
    tagline: 'Peças com assinatura, feitas por gente que a gente conhece pelo nome.',
    palette: {
      primary: '#7c2d12',
      secondary: '#ea580c',
      accent: '#c2410c',
      surface: '#fff7ed',
    },
    aboutText:
      'Loja de bairro que virou referência. Trabalhamos com 84 designers e marcas autorais brasileiras e latino-americanas. Estoque rotativo, peças únicas e mostruário que troca todo mês. Fundada em 2014 por uma arquiteta cansada de ver a mesma coisa em todo shopping.',
    hero: {
      eyebrow: 'Decoração · Autoral · Curadoria',
      title: 'A casa que você quer não vai sair de uma loja de shopping.',
      subtitle: '84 designers, 1.200 peças em estoque, 1 loja física na Vila Madalena e 1 galeria no Havaí.',
      ctaLabel: 'Ver peças em estoque',
      ctaHref: '#produtos',
      image: unsplash('1567538096630-e0c55bd6374c'),
    },
    services: [
      { icon: '🛋️', name: 'Móveis sob medida', desc: 'Marcenaria autoral com 12 marceneiros parceiros. Do briefing à entrega em 35 dias.' },
      { icon: '💡', name: 'Iluminação autoral', desc: 'Luminárias assinadas por designers brasileiros e peças vintage restauradas na oficina.' },
      { icon: '🖼️', name: 'Arte e gravuras', desc: '38 artistas plásticos contemporâneos. Quadros, gravuras e esculturas em edição limitada.' },
      { icon: '🌿', name: 'Plantas e vasos', desc: 'Curadoria de vasos de cerâmica, cimento e pedra. Plantas raras para ambientes internos.' },
      { icon: '🪡', name: 'Têxtil e tapeçaria', desc: 'Tapetes persas restaurados, mantas de lã天然 e cortinas sob medida.' },
      { icon: '🎁', name: 'Lista de casamento', desc: 'Lista autoral com curadoria da arquiteta. Entrega na data do evento, sem correria.' },
    ],
    differentials: [
      { name: 'Curadoria da arquiteta', desc: 'Tudo que entra na loja é escolhido por Bia Monteiro, nossa fundadora. Nada passa por comitê.' },
      { name: 'Estoque rotativo', desc: 'A loja muda todo mês. Se viu e gostou, leva hoje. Semana que vem, talvez não esteja mais.' },
      { name: 'Entrega white-glove', desc: 'Equipe especializada em içar sofás por escada, montar móveis delicados e descartar embalagem.' },
      { name: 'Garantia de 1 ano', desc: 'Para defeito de fabricação, a peça é restaurada ou trocada. Sem burocracia, sem "análise técnica".' },
    ],
    stats: [
      { value: '84', label: 'designers parceiros' },
      { value: '1.200', label: 'peças em estoque' },
      { value: '12 anos', label: 'de história' },
      { value: '4,9/5', label: 'no Google (820 avaliações)' },
    ],
    testimonials: [
      {
        name: 'Renata Lins',
        role: 'Arquiteta — cliente recorrente',
        text: 'Compro para 90% dos meus projetos de interiores. Curadoria afiada, atendimento que entende briefing técnico.',
      },
      {
        name: 'Família Aguiar',
        role: 'Lista de casamento — 2024',
        text: 'A Bia montou a lista com a cara da nossa casa. Noivas que me perguntam, eu indico de olhos fechados.',
      },
      {
        name: 'Bruno Pessoa',
        role: 'Cliente — apê Vila Madalena',
        text: 'Comprei aparador, luminária e quadro. Tudo assinado, nada genérico. Sala virou a cara do que eu queria.',
      },
    ],
    faq: [
      {
        q: 'Vocês entregam para fora de São Paulo?',
        a: 'Sim, para todo o Brasil via transportadora. Frete por conta do cliente, com seguro incluso no valor.',
      },
      {
        q: 'As peças são únicas?',
        a: 'A maioria é edição limitada ou peça única. Vendemos o que está no mostruário — não fabricamos sob demanda.',
      },
      {
        q: 'Aceitam troca ou devolução?',
        a: 'Sim, em até 7 dias para peças prontas. Móveis sob medida não têm troca, com sinal não reembolsável.',
      },
    ],
    products: [
      {
        name: 'Aparador Ipê Maciço',
        price: 'R$ 4.200',
        desc: 'Madeira maciça de reflorestamento, 1,80m × 45cm. Assinado por Tomás Veras, edição de 12 unidades.',
        image: unsplash('1555041469-a586c61ea9bc', 800, 600),
      },
      {
        name: 'Luminária Pendular Tronco',
        price: 'R$ 1.180',
        desc: 'Fibra natural trançada, diâmetro 60cm, cabo de 2m. Designer Carolina Meirelles, 8 unidades.',
        image: unsplash('1513506003901-1e6a229e2d15', 800, 600),
      },
      {
        name: 'Vaso Cerâmica Atacama',
        price: 'R$ 720',
        desc: 'Pintura manual em tons de terracota, 52cm de altura. Atelier Mãos do Sul, 4 unidades disponíveis.',
        image: unsplash('1485955900006-10f4d324d411', 800, 600),
      },
    ],
    ctaTitle: 'A próxima peça da sua casa está esperando',
    ctaLabel: 'Visitar a loja',
    whatsapp: '5511987650099',
    phone: '(11) 3032-7766',
    email: 'oi@ateliecasa.com.br',
    address: 'Rua Aspicuelta, 412 — Vila Madalena, São Paulo/SP',
    hours: 'Ter–Sáb, 11h–20h · Dom, 12h–18h',
    cnpj: '19.482.730/0001-83',
    instagram: 'https://instagram.com/ateliecasa',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. RESTAURANTE — Cozinha autoral brasileira
  // ─────────────────────────────────────────────────────────────
  'restaurante': {
    slug: 'restaurante',
    tagline: 'Cozinha brasileira que o Brasil não sabia que merecia comer.',
    palette: {
      primary: '#450a0a',
      secondary: '#b91c1c',
      accent: '#dc2626',
      surface: '#fef2f2',
    },
    aboutText:
      'Restaurante com 12 anos de casa, à frente a chef Daniela Bertolucci. Ingredientes do território brasileiro, produtores locais que a gente conhece pelo nome, fermentações naturais e carta de 240 rótulos. Já fomos eleitos melhor cozinha autoral do Brasil por 4 guias diferentes. A casa tem 42 lugares e a fila, acredite, é grande.',
    hero: {
      eyebrow: 'Cozinha autoral · Carta de vinhos · Fermentações',
      title: 'Brasil no prato — sem sertanejo universitário, sem gastrofíseia chata.',
      subtitle: 'Menu degustação de 7 tempos que muda a cada 6 semanas. Produtos do Cerrado, da Amazônia, do Sul — sem frescura.',
      ctaLabel: 'Reservar para esta semana',
      ctaHref: '#contato',
      image: unsplash('1414235077428-338989a2e8c0'),
    },
    services: [
      { icon: '🍽️', name: 'Menu degustação 7 tempos', desc: 'R$ 290 por pessoa, harmonização opcional com 5 vinhos por R$ 220. Menu muda a cada 6 semanas.' },
      { icon: '🥂', name: 'Eventos privados', desc: 'Salão para até 40 pessoas, menu exclusivo da chef e carta de vinhos sob curadoria do sommelier.' },
      { icon: '🍷', name: 'Carta de vinhos', desc: '240 rótulos, com foco em pequenos produtores brasileiros, chilenos, argentinos e portugueses.' },
      { icon: '🧑‍🍳', name: 'Curso de gastronomia', desc: 'Workshops mensais com a chef. 12 vagas por turma, 4 horas de cozinha e vinho incluso.' },
      { icon: '🌿', name: 'Menu vegetariano', desc: 'Menu degustação 100% vegetariano, com mesma técnica e sofisticação do menu tradicional.' },
      { icon: '🎁', name: 'Vale-presente', desc: 'Voucher digital pelo site. Entrega imediata por e-mail, sem custo de envio.' },
    ],
    differentials: [
      { name: 'Chef reconhecida, não celebridade', desc: 'Daniela está na cozinha todo serviço, não só na foto do Instagram. Formada na École Lenôtre, Paris.' },
      { name: 'Produtor com nome e rosto', desc: '42 produtores parceiros identificados no menu. Você lê, pergunta, conversa.' },
      { name: 'Sem fila de 2 horas', desc: 'Reserva online confirmada em 2h. Chega, senta, come. Sem whisky de espera.' },
      { name: 'Carta que muda todo trimestre', desc: '240 rótulos hoje, 60% diferentes em 90 dias. Não tem vinho que virou "coringa".' },
    ],
    stats: [
      { value: '12 anos', label: 'de casa aberta' },
      { value: '240', label: 'rótulos na carta' },
      { value: '4 guias', label: 'nos elegeram melhor' },
      { value: '42', label: 'lugares por serviço' },
    ],
    testimonials: [
      {
        name: 'Marcos Olímpio',
        text: 'Melhor bobó de camarão que comi na vida — e olha que morei na Bahia 8 anos. O tucupi do menu é coisa de outro mundo.',
      },
      {
        name: 'Sandra Veríssimo',
        role: 'Crítica de gastronomia',
        text: 'É o tipo de restaurante que entende Brasil sem reduzi-lo a caipirinha. Técnica, afeto e território, sem clichê.',
      },
      {
        name: 'Família Mattos',
        role: 'Jantar de casamento — 32 pessoas',
        text: 'O evento privado mais bem organizado que já fizemos. Menu exclusivo, serviço impecável, 11 elogios por pessoa.',
      },
    ],
    faq: [
      {
        q: 'Tem opção para restrição alimentar?',
        a: 'Sim,菜单 vegetariano, sem glúten e sem lactose sob aviso de 48h. Sinalizamos alérgenos em todos os pratos.',
      },
      {
        q: 'Aceitam crianças?',
        a: 'Sim, a partir de 8 anos. Para menores, oferecemos menu kids com versão simplificada do prato principal.',
      },
      {
        q: 'Como funciona a reserva?',
        a: 'Online pelo site, com confirmação em 2h. Sinal de R$ 80 por pessoa, deduzido do consumo final.',
      },
    ],
    menu: [
      { name: 'Menu degustação 7 tempos', price: 'R$ 290', desc: 'Caminhada pelo Cerrado, Amazônia e Sul. Menu atualiza a cada 6 semanas.' },
      { name: 'Bobó de camarão com farofa de dendê', price: 'R$ 110', desc: 'Camarão do litoral de São Paulo, leite de coco fresco e dendê do Recôncavo Baiano.' },
      { name: 'Picanha maturada 28 dias', price: 'R$ 165', desc: 'Carne Angus do Pantanal, sal grosso de Castro/PR, tutano grelhado e vinagrete de butiá.' },
      { name: 'Risoto de cogumelos do Sul', price: 'R$ 130', desc: 'Shiitake, shimeji e moranga orgânicos de Gramado. Acabamento com manteiga noisette e parmesão de Vacaria.' },
      { name: 'Tartar de sururu com leche de tigre', price: 'R$ 96', desc: 'Sururu de Alagoas, leche de tigre cítrica, cebola roxa e chips de banana-da-terra.' },
      { name: 'Pato no tucupi com jambu', price: 'R$ 148', desc: 'Pato confitado 6 horas, tucupi fresco do Pará, jambu e arroz de açaí.' },
      { name: 'Petit gâteau de cacau do Pará', price: 'R$ 58', desc: 'Cacau nativo do Pará, sorvete de cupuaçu e crumble de castanha-do-Brasil.' },
      { name: 'Harmonização 5 vinhos', price: 'R$ 220', desc: 'Seleção do sommelier, 5 taças harmonizadas com o menu degustação.' },
    ],
    ctaTitle: 'A próxima mesa é sua',
    ctaLabel: 'Reservar agora',
    whatsapp: '5511965432100',
    phone: '(11) 3088-9090',
    email: 'reservas@casabertolucci.com.br',
    address: 'Rua Bela Cintra, 2200 — Consolação, São Paulo/SP',
    hours: 'Ter–Sáb, 12h–15h · 19h–23h · Dom, 12h–16h',
    cnpj: '17.936.482/0001-40',
    instagram: 'https://instagram.com/casabertolucci',
  },
};
