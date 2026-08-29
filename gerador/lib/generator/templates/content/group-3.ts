/**
 * Group 3 — 5 content packs de serviços essenciais:
 * estética avançada, eletricista 24h, encanador 24h, mecânica multimarca e assistência técnica.
 *
 * Cada pack tem voz própria, números reais, personalidade distinta e copy sem clichê.
 * Imagens: Unsplash (URLs com tamanho + crop). Se quebrar, o editor permite trocar.
 */

import type { ContentPack } from './registry';

// Helper local — gera URL Unsplash no formato padrão do projeto.
const unsplash = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const GROUP_3: Record<string, ContentPack> = {
  // ─────────────────────────────────────────────────────────────
  // 1. ESTÉTICA AVANÇADA — Clínica de skincare e procedimentos
  // ─────────────────────────────────────────────────────────────
  estetica: {
    slug: 'estetica',
    tagline:
      'Tratamento de pele e procedimentos que entregam o que prometem — sem milagre, com técnica.',
    palette: {
      primary: '#5e1742',
      secondary: '#d63384',
      accent: '#f8a5c2',
      surface: '#fdf2f8',
    },
    aboutText:
      'Somos uma clínica de estética avançada com 9 anos de casa e mais de 12 mil procedimentos realizados. Trabalhamos com 14 especialistas registradas em conselho, equipamentos homologados pela ANVISA e produtos dermatológicos vendidos só em consultório. Aqui não tem pacote genérico: cada rosto ganha um protocolo montado depois da avaliação.',
    hero: {
      eyebrow: 'Estética avançada · Skincare · Procedimentos',
      title: 'Beleza com método, não com promessa.',
      subtitle:
        'Avaliação dermatológica antes de qualquer procedimento. Profissionais registradas, produtos vendidos só em consultório. Garantia de retoque em 30 dias.',
      ctaLabel: 'Reservar avaliação',
      ctaHref: '#contato',
      image: unsplash('1616394584738-fc6e612e71b9'),
    },
    services: [
      { icon: '💆', name: 'Limpezas de pele profundas', desc: 'Protocolo para cada biotipo, com extração cuidadosa e finalização com LED.' },
      { icon: '💉', name: 'Botox e preenchimento', desc: 'Aplicação com dermatologista, dosagem individual e plano de manutenção.' },
      { icon: '✨', name: 'Peeling químico', desc: 'Renovação celular com ácido adequado, do superficial ao médio.' },
      { icon: '🧖', name: 'Drenagem linfática', desc: 'Redução de medidas, retenção e pós-operatório. Método Renata França.' },
      { icon: '💎', name: 'Microagulhamento', desc: 'Estímulo de colágeno com dermaroller e drug delivery de ativos.' },
      { icon: '🧴', name: 'Skincare personalizado', desc: 'Protocolo domiciliar montado depois da avaliação, com produtos vendidos só em consultório.' },
    ],
    differentials: [
      { name: 'Avaliação antes de tudo', desc: 'Você só fecha procedimento depois da análise de pele, com plano por escrito.' },
      { name: 'Retoque em 30 dias', desc: 'Se o resultado não ficou, a gente revisa sem custo adicional.' },
      { name: 'Profissionais registradas', desc: 'Equipe com COREN e conselho de classe ativo, sem estagiário aplicando.' },
    ],
    stats: [
      { value: '12.000+', label: 'procedimentos realizados' },
      { value: '14', label: 'especialistas registradas' },
      { value: '9 anos', label: 'de casa' },
      { value: '4,9/5', label: 'nota no Google' },
    ],
    testimonials: [
      {
        name: 'Marina Albuquerque',
        role: 'Cliente desde 2022',
        text: 'Já fiz botox em três clínicas. Aqui é a primeira vez que alguém olhou para o meu rosto antes de aplicar. Resultado natural, sem aquele efeito de novela.',
      },
      {
        name: 'Renata Vasques',
        role: 'Empresária, Pinheiros',
        text: 'O protocolo de skincare deles mudou minha pele em 4 meses. Não é milagre, é disciplina — e produto bom, vendido só ali.',
      },
      {
        name: 'Camila Ito',
        role: 'Médica, Vila Mariana',
        text: 'A clínica que eu indico para minhas amigas. Técnica séria, sem empurração de pacote.',
      },
    ],
    faq: [
      {
        q: 'Vocês parcelam em quantas vezes?',
        a: 'Procedimentos em até 10x sem juros no cartão. Pacotes podem ser divididos em boleto.',
      },
      {
        q: 'A avaliação é cobrada?',
        a: 'A primeira avaliação de pele é gratuita. Avaliação corporal (para drenagem e pós-operatório) tem custo de R$ 80, abatido do procedimento.',
      },
      {
        q: 'Atendem homens?',
        a: 'Sim, temos protocolo masculino de skincare, depilação a laser e botox. Ambiente reservado.',
      },
    ],
    ctaTitle: 'Sua pele pede mais que creme de farmácia',
    ctaLabel: 'Reservar avaliação gratuita',
    whatsapp: '5511988445500',
    phone: '(11) 3068-1212',
    email: 'agendamento@lumierestetica.com.br',
    address: 'Rua Oscar Freire, 1900 — Pinheiros, São Paulo/SP',
    hours: 'Ter–Sáb, 9h–20h',
    cnpj: '29.471.038/0001-21',
    instagram: 'https://instagram.com/lumierestetica',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. ELETRICISTA — Residencial, comercial e industrial 24h
  // ─────────────────────────────────────────────────────────────
  eletricista: {
    slug: 'eletricista',
    tagline:
      'Eletricista 24h que chega em 60 minutos ou o orçamento é grátis.',
    palette: {
      primary: '#0b1320',
      secondary: '#eab308',
      accent: '#facc15',
      surface: '#fefce8',
    },
    aboutText:
      '8 anos de rua, 4.200 atendimentos e zero curto que voltou para ser feito de novo. Somos 14 eletricistas certificados pelo SENAI, com NR-10 e NR-35 em dia. Atendemos residencial, comercial e industrial em toda a Grande São Paulo, com nota fiscal em todo serviço e garantia escrita de 90 dias.',
    hero: {
      eyebrow: 'Residencial · Comercial · Industrial · 24h',
      title: 'Disjuntor caiu? Choque? Fiação cheirando queimado?',
      subtitle:
        'Chegada em até 60 minutos na região metropolitana. Orçamento no local, sem custo. Pagamento em até 6x.',
      ctaLabel: 'Chamar eletricista agora',
      ctaHref: '#contato',
      image: unsplash('1621905252507-b35492cc74b4'),
    },
    services: [
      { icon: '🏠', name: 'Elétrica residencial', desc: 'Tomadas, chuveiros, disjuntores, troca de fiação e quadros de distribuição.' },
      { icon: '🏢', name: 'Elétrica comercial', desc: 'Lojas, escritórios, galpões e clínicas com projeto e ART.' },
      { icon: '🏭', name: 'Elétrica industrial', desc: 'Cabines primárias, painéis, spda e automação com CLP.' },
      { icon: '⚡', name: 'Eficiência energética', desc: 'Laudo técnico, plano de redução de consumo e troca por LED.' },
      { icon: '🚨', name: 'Emergência 24h', desc: 'Atendimento a qualquer hora, inclusive feriado. Sem taxa extra fora do horário.' },
      { icon: '🔌', name: 'Adequação à norma', desc: 'Adequação de padrão Elektro/Enel, aumento de carga e laudo de instalação.' },
    ],
    differentials: [
      { name: '60 minutos ou grátis', desc: 'Se a gente não chegar no prazo combinado na região metropolitana, a visita é por nossa conta.' },
      { name: 'Garantia escrita de 90 dias', desc: 'Tudo por escrito, com nota fiscal. Volte a ter problema? Voltamos sem cobrar.' },
      { name: 'Não trabalhamos com paliativo', desc: 'Se a fiação está ruim, trocamos. Não fazemos "gambiarra" para te ver semana que vem.' },
    ],
    stats: [
      { value: '4.200+', label: 'atendimentos' },
      { value: '60 min', label: 'tempo médio de chegada' },
      { value: '14', label: 'eletricistas certificados' },
      { value: '8 anos', label: 'de mercado' },
    ],
    testimonials: [
      {
        name: 'Roberto Mendes',
        role: 'Síndico, Condomínio Vila Madalena',
        text: 'Chamei às 23h de um sábado por causa de uma queda geral. Chegaram em 40 minutos, identificaram o problema e resolveram sem drama.',
      },
      {
        name: 'Juliana Castro',
        role: 'Restaurante, Pinheiros',
        text: 'A cozinha ficou sem energia numa sexta à noite. Em 50 minutos estava tudo resolvido, com nota fiscal para o seguro.',
      },
      {
        name: 'Marcos Aurélio',
        role: 'Galpão industrial, Guarulhos',
        text: 'Trocaram todo o quadro e fizeram a adequação para a Enel. Sem surpresa no orçamento, com prazo cumprido.',
      },
    ],
    faq: [
      {
        q: 'Quanto custa a visita?',
        a: 'A visita técnica com orçamento é gratuita dentro da Grande São Paulo. Você só paga se aprovar o serviço.',
      },
      {
        q: 'Vocês emitem nota fiscal?',
        a: 'Sim, em todos os serviços. Emitimos NF-e com CNPJ da empresa, válida para condomínio, locação e seguro.',
      },
      {
        q: 'Atendem qual região?',
        a: 'Toda a Grande São Paulo: capital, ABC, Guarulhos, Osasco, Barueri, Taboão, Cotia e São Bernardo.',
      },
    ],
    ctaTitle: 'Emergência elétrica não espera amanhã',
    ctaLabel: 'Chamar agora',
    whatsapp: '5511940001010',
    phone: '(11) 4001-1010',
    email: 'contato@voltmax.com.br',
    address: 'Atendemos toda a Grande São Paulo',
    hours: '24 horas, 7 dias por semana',
    cnpj: '31.882.449/0001-55',
    instagram: 'https://instagram.com/voltmax24h',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. ENCANADOR — Desentupimento, caça-vazamento e hidráulica 24h
  // ─────────────────────────────────────────────────────────────
  encanador: {
    slug: 'encanador',
    tagline:
      'Vazou, entupiu ou transbordou? Chegamos em 60 minutos — ou a visita é por nossa conta.',
    palette: {
      primary: '#0c2340',
      secondary: '#1d4ed8',
      accent: '#38bdf8',
      surface: '#eff6ff',
    },
    aboutText:
      'Mais de 22 mil atendimentos em 12 anos. Somos 18 encanadores uniformizados, identificados e com equipamento completo dentro da van — máquina de desentupir, ultrassom e câmera de inspeção. Atendemos residencial, comercial e condomínios em São Paulo capital e ABC, com nota fiscal e garantia escrita de 90 dias em qualquer serviço.',
    hero: {
      eyebrow: 'Desentupimento · Caça-vazamento · Hidráulica · 24h',
      title: 'Cano estourado às 3h da manhã? A gente atende.',
      subtitle:
        '60 minutos de chegada, orçamento sem custo e pagamento em até 6x no cartão. Sem taxa extra fora do horário.',
      ctaLabel: 'Pedir atendimento agora',
      ctaHref: '#contato',
      image: unsplash('1581244277943-fe4a9c777189'),
    },
    services: [
      { icon: '🚰', name: 'Desentupimento', desc: 'Pia, vaso sanitário, ralo, coluna predial e rede de esgoto com máquina elétrica.' },
      { icon: '🔍', name: 'Caça-vazamento', desc: 'Tecnologia de ultrassom, gás traçador e câmera termográfica — sem quebrar tudo.' },
      { icon: '🚿', name: 'Reparos hidráulicos', desc: 'Torres, registros, válvulas, conexões e reparo de tubulação sem obra.' },
      { icon: '🏢', name: 'Condomínios', desc: 'Plano mensal de manutenção preventiva, com visitas programadas e relatório.' },
      { icon: '🛁', name: 'Caixa d’água e esgoto', desc: 'Limpeza, desinfecção e reparo de caixa d’água, fossa e sumidouro.' },
      { icon: '🧰', name: 'Instalação de louças', desc: 'Vaso, pia, torneira, chuveiro e cuba com mão de obra qualificada.' },
    ],
    differentials: [
      { name: '60 minutos de chegada', desc: 'Ou a visita técnica é por nossa conta. Esse é o combinado, sem letras miúdas.' },
      { name: 'Sem paliativo', desc: 'Se a tubulação está comprometida, trocamos. Não usamos massa epóxi para resolver "por enquanto".' },
      { name: 'Orçamento só se aprovado', desc: 'Você vê o preço antes da gente começar. Se não aprovar, paga só a visita — e a visita é grátis na capital.' },
    ],
    stats: [
      { value: '22.000+', label: 'atendimentos' },
      { value: '60 min', label: 'chegada na capital' },
      { value: '18', label: 'encanadores no time' },
      { value: '12 anos', label: 'de mercado' },
    ],
    testimonials: [
      {
        name: 'André Tavares',
        role: 'Apartamento, Tatuapé',
        text: 'Vazamento no banheiro às 2h da manhã. Chegaram em 45 minutos, acharam o ponto exato com a câmera e resolveram sem quebrar o piso inteiro.',
      },
      {
        name: 'Síndica Lúcia Bertolini',
        role: 'Condomínio, Santana',
        text: 'A gente contratou o plano mensal há 3 anos. Problema de coluna que era semanal virou zero. Atendimento nota 10.',
      },
      {
        name: 'Eduardo Pacheco',
        role: 'Restaurante, Bela Vista',
        text: 'Cozinha entupiu num sábado de movimento. Em 50 minutos o encanador estava lá, com máquina. Salvaram o almoço.',
      },
    ],
    faq: [
      {
        q: 'Vocês cobram taxa de visita?',
        a: 'Não na capital de São Paulo e ABC. Você só paga se aprovar o serviço. Em outras regiões, consulte no WhatsApp.',
      },
      {
        q: 'Qual a forma de pagamento?',
        a: 'Pix à vista com 5% de desconto, cartão em até 6x sem juros, ou boleto para pessoa jurídica.',
      },
      {
        q: 'Atendem qual região?',
        a: 'Toda São Paulo capital (todas as regiões) e ABC (Santo André, São Bernardo, São Caetano e Diadema).',
      },
    ],
    ctaTitle: 'Emergência hidráulica não pode esperar',
    ctaLabel: 'Chamar encanador',
    whatsapp: '5511940002020',
    phone: '(11) 4002-2020',
    email: 'contato@aquaflux.com.br',
    address: 'Atendemos toda São Paulo capital e ABC',
    hours: '24 horas, 7 dias por semana',
    cnpj: '27.660.512/0001-92',
    instagram: 'https://instagram.com/aquaflux24h',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. MECÂNICA — Auto center multimarca
  // ─────────────────────────────────────────────────────────────
  mecanica: {
    slug: 'mecanica',
    tagline:
      'Mecânica multimarca que explica o que está fazendo — e entrega no prazo combinado.',
    palette: {
      primary: '#0f172a',
      secondary: '#dc2626',
      accent: '#fb923c',
      surface: '#fef2f2',
    },
    aboutText:
      '15 anos no Brooklin, 22 mil carros atendidos e equipe certificada pelas principais montadoras. Somos auto center multimarca: mecânica geral, elétrica, eletrônica, funilaria e pintura — tudo no mesmo endereço, com diagnóstico computadorizado, fotos de cada serviço no seu celular e entrega no prazo. Se passar do prazo, a gente lava o carro por nossa conta.',
    hero: {
      eyebrow: 'Mecânica · Auto Center · Multimarca',
      title: 'Seu carro nas mãos de quem diagnostica antes de trocar.',
      subtitle:
        'Orçamento transparente, com fotos e vídeo. Peças com nota fiscal. Garantia de 6 meses em todo serviço executado.',
      ctaLabel: 'Agendar revisão',
      ctaHref: '#contato',
      image: unsplash('1486006920555-c77dcf18193c'),
    },
    services: [
      { icon: '🔧', name: 'Revisão completa', desc: 'Troca de óleo, filtros, fluidos, pastilhas e checklist de 80 itens.' },
      { icon: '🛞', name: 'Alinhamento e balanceamento', desc: 'Equipamento computadorizado 3D, com geometria de direção.' },
      { icon: '⚙️', name: 'Motor e câmbio', desc: 'Reparo, retífica, troca de embreagem e diagnóstico de transmissão automática.' },
      { icon: '🎨', name: 'Funilaria e pintura', desc: 'Cabine de pintura com estufa, polimento e restauração.' },
      { icon: '🔋', name: 'Elétrica e eletrônica', desc: 'Diagnóstico computadorizado, módulos, injeção e imobilizadores.' },
      { icon: '❄️', name: 'Ar-condicionado', desc: 'Higienização, recarga de gás, compressor e reparo de evaporadora.' },
    ],
    differentials: [
      { name: 'Orçamento com foto', desc: 'Você recebe as fotos do problema no WhatsApp antes de aprovar. Sem surpresa, sem "achismo".' },
      { name: 'Prazo ou lavagem grátis', desc: 'Combinamos data e hora. Se atrasar por nossa culpa, lavamos o carro sem custo.' },
      { name: 'Garantia de 6 meses', desc: 'Em todo serviço executado, com nota fiscal e registro no sistema da oficina.' },
    ],
    stats: [
      { value: '22.000+', label: 'carros atendidos' },
      { value: '15 anos', label: 'no Brooklin' },
      { value: '12', label: 'mecânicos certificados' },
      { value: '6 meses', label: 'de garantia' },
    ],
    testimonials: [
      {
        name: 'Cláudio Sant\'anna',
        role: 'Empresário, Brooklin',
        text: 'Levei meu Corolla com um barulho no motor. Em vez de trocar peças, mostraram o vídeo explicando o que era. Cobraram só o serviço. Honesto demais.',
      },
      {
        name: 'Fernanda Quirino',
        role: 'Designer, Vila Mariana',
        text: 'Primeira oficina que me mandou foto do filtro de ar e da pastilha antes de trocar. Explicaram tudo, sem empurrar serviço.',
      },
      {
        name: 'Paulo Henrique',
        role: 'Motorista de aplicativo',
        text: 'O carro deles me dá tranquilidade. Revisão feita em 4h, sem ficar o dia todo lá esperando.',
      },
    ],
    faq: [
      {
        q: 'Vocês atendem qual marca?',
        a: 'Atendemos todas as marcas e modelos: populares, premium e europeus. Somos multimarca, não somos concessionária.',
      },
      {
        q: 'Posso levar peças próprias?',
        a: 'Pode, mas nesse caso a garantia da mão de obra passa a ser de 90 dias. Se a peça for comprada com a gente, mantemos os 6 meses.',
      },
      {
        q: 'Fazem busca e entrega?',
        a: 'Sim, em um raio de 8 km da oficina. Taxa de R$ 60 para busca e R$ 60 para entrega, grátis em revisão completa.',
      },
    ],
    ctaTitle: 'Seu carro merece mecânico que explica o serviço',
    ctaLabel: 'Reservar horário',
    whatsapp: '5511933003030',
    phone: '(11) 4003-3030',
    email: 'agendamento@autocentrobroklin.com.br',
    address: 'Av. Santo Amaro, 4500 — Brooklin, São Paulo/SP',
    hours: 'Seg–Sex, 8h–18h · Sáb, 8h–12h',
    cnpj: '18.407.226/0001-11',
    instagram: 'https://instagram.com/autocentrobroklin',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. ASSISTÊNCIA TÉCNICA — Smartphones, notebooks e videogames
  // ─────────────────────────────────────────────────────────────
  'assistencia-tecnica': {
    slug: 'assistencia-tecnica',
    tagline:
      'Seu eletrônico como novo, com peça original e técnico certificado. Diagnóstico em 30 minutos.',
    palette: {
      primary: '#0c2545',
      secondary: '#0ea5e9',
      accent: '#22d3ee',
      surface: '#f0f9ff',
    },
    aboutText:
      '8 anos de bancada, mais de 18 mil aparelhos reparados e 4 autorizações de fábrica no currículo (Apple Independent Repair Provider, Samsung, Xiaomi e Lenovo). Somos 14 técnicos certificados, com peças originais compradas direto da distribuidora e laboratório próprio de micro-soldagem. Se não der para consertar, a gente te fala — não inventamos solução.',
    hero: {
      eyebrow: 'Smartphones · Notebooks · Videogames · Tablets',
      title: 'Tela quebrou? Bateria viciou? PlayStation parou?',
      subtitle:
        'Diagnóstico em 30 minutos. Peça original ou OEM de qualidade. Garantia de 90 dias em todo reparo.',
      ctaLabel: 'Trazer equipamento',
      ctaHref: '#contato',
      image: unsplash('1588508065123-287b28e013da'),
    },
    services: [
      { icon: '📱', name: 'Smartphones', desc: 'Troca de tela, bateria, conector de carga, câmera e placa. Apple, Samsung, Xiaomi, Motorola.' },
      { icon: '💻', name: 'Notebooks', desc: 'Troca de tela, teclado, bateria, SSD, limpeza térmica e reballing de placa.' },
      { icon: '🎮', name: 'Videogames', desc: 'PS5, PS4, Xbox Series, Xbox One, Nintendo Switch e Steam Deck.' },
      { icon: '💾', name: 'Recuperação de dados', desc: 'HDs mecânicos, SSDs, pen drives, cartões SD e RAID. Sala limpa classe 100.' },
      { icon: '🔧', name: 'Micro-soldagem', desc: 'Troca de CI, conector de carga soldado, reballing de BGA e reparo de placa-mãe.' },
      { icon: '🖥️', name: 'Tablets e iPads', desc: 'Troca de tela, bateria, conector e reparo de placa em iPad e tablets Android.' },
    ],
    differentials: [
      { name: 'Diagnóstico em 30 minutos', desc: 'Bancada aberta, com orçamento sem custo. Você vê o problema antes de aprovar.' },
      { name: 'Peça original ou OEM', desc: 'Peças compradas direto da distribuidora autorizada. Nota fiscal em tudo.' },
      { name: 'Garantia escrita de 90 dias', desc: 'Se o defeito voltar no mesmo ponto, a gente conserta sem cobrar nada.' },
    ],
    stats: [
      { value: '18.000+', label: 'aparelhos reparados' },
      { value: '30 min', label: 'diagnóstico padrão' },
      { value: '14', label: 'técnicos certificados' },
      { value: '4', label: 'autorizações de fábrica' },
    ],
    testimonials: [
      {
        name: 'Bianca Corrêa',
        role: 'Estudante de medicina, Vila Madalena',
        text: 'Tela do iPhone quebrou num domingo. Levei na segunda, saí com tela original em 1h30. Preço justo, sem enrolar.',
      },
      {
        name: 'Daniel Akira',
        role: 'Gamer, Santo Amaro',
        text: 'PS5 com leitor de disco travado. Tinha levado em outro lugar e ninguém resolveu. Aqui diagnosticaram, trocaram a engrenagem e voltou a funcionar em 2 dias.',
      },
      {
        name: 'Marcelo Vieira',
        role: 'Fotógrafo, Pinheiros',
        text: 'Recuperaram 4 anos de fotos de um HD que outro técnico disse que não tinha jeito. Valeu cada centavo.',
      },
    ],
    faq: [
      {
        q: 'O conserto tem garantia?',
        a: 'Sim, 90 dias por escrito para todo reparo. Peça trocada + mão de obra. Se der problema no mesmo ponto, resolvemos sem custo.',
      },
      {
        q: 'Vocês usam peça original?',
        a: 'Sim, sempre que possível. Trabalhamos com peças originais compradas em distribuidora autorizada. Quando não há original, usamos OEM de mesma especificação técnica.',
      },
      {
        q: 'Quanto tempo demora em média?',
        a: 'Troca de tela e bateria: 1h a 3h. Reparo de placa: 2 a 5 dias úteis. Recuperação de dados: 3 a 7 dias úteis, dependendo do caso.',
      },
    ],
    ctaTitle: 'Seu eletrônico vale o conserto — traga para a bancada',
    ctaLabel: 'Diagnóstico sem custo',
    whatsapp: '5511950004040',
    phone: '(11) 4004-4040',
    email: 'contato@reparaja.com.br',
    address: 'Rua Pamplona, 1200 — Jardins, São Paulo/SP',
    hours: 'Seg–Sex, 9h–19h · Sáb, 9h–14h',
    cnpj: '34.918.770/0001-08',
    instagram: 'https://instagram.com/reparaja',
  },
};
