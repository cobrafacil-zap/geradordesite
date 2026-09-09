/**
 * Group 7 — Landing pages de conversão.
 *
 * Slugs `lp-*` — voltados para captura de lead e venda direta.
 * Copy agressiva, 1 CTA principal, sem menu de navegação completo.
 * Layout FIXO em layouts.ts (case 'landing') — não sorteado.
 *
 * Imagens: placeholders cinza (landing pages de conversão normalmente
 * carregam mockups do produto, não foto genérica — não vale a pena inventar).
 */

import type { ContentPack } from './registry';

export const GROUP_7: Record<string, ContentPack> = {
  // ─────────────────────────────────────────────────────────────
  // 1. LP LEAD MAGNET — captura e-mail (ebook, webinar, free trial)
  // ─────────────────────────────────────────────────────────────
  'lp-lead-magnet': {
    slug: 'lp-lead-magnet',
    tagline: 'Receba o material gratuito no seu e-mail em 60 segundos.',
    palette: {
      primary: '#0a0a0f',
      secondary: '#7c3aed',
      accent: '#22d3ee',
      surface: '#f5f3ff',
    },
    mode: 'light',
    aboutText:
      'Material gratuito com 47 páginas de conteúdo aplicável: frameworks, checklists e estudos de caso reais. Produzido pelo time que atende 320+ empresas no Brasil.',
    hero: {
      eyebrow: 'Ebook gratuito · 47 páginas',
      title: 'O guia que faltava para você parar de perder venda todos os dias.',
      subtitle: 'Em 60 segundos você recebe o material no e-mail. Sem custo, sem cartão, sem enrolação.',
      ctaLabel: 'Quero o material',
      ctaHref: '#captura',
      image: '',
      imageAlt: '',
    },
    services: [
      { icon: '📘', name: '47 páginas de conteúdo', desc: 'Frameworks, checklists e 8 estudos de caso reais com números.' },
      { icon: '🎯', name: 'Aplicable no dia 1', desc: 'Cada capítulo termina com uma ação concreta para você fazer hoje.' },
      { icon: '🧠', name: 'Curadoria séria', desc: 'Conteúdo escrito por gente que opera, não por agência de marketing.' },
    ],
    differentials: [
      { name: 'Sem custo, sem pegadinha', desc: 'Ebook 100% gratuito. Sem cartão, sem trial, sem letras miúdas.' },
      { name: 'Entrega em 60 segundos', desc: 'Você recebe no e-mail imediatamente após preencher o formulário.' },
      { name: 'Pode cancelar quando quiser', desc: '1 clique para descadastrar. A gente nem fica chateado.' },
    ],
    stats: [
      { value: '12.847', label: 'profissionais já baixaram' },
      { value: '4.9 ★', label: 'de 2.340 avaliações' },
      { value: '320+', label: 'empresas aplicam' },
    ],
    testimonials: [
      { name: 'Marina Couto', role: 'Head de Growth, Méliuz', text: 'Apliquei o framework do capítulo 3 e em 2 semanas meu CAC caiu 23%. Material denso, sem enrolação.' },
      { name: 'Felipe Andrade', role: 'CEO, Pipefy', text: 'Distribuí para todo o time de marketing. Virou referência interna.' },
    ],
    faq: [
      { q: 'O material é realmente gratuito?', a: 'Sim. Sem cartão, sem trial. Você só deixa o e-mail.' },
      { q: 'Em quanto tempo recebo?', a: 'Imediatamente após preencher o formulário. Em até 60 segundos no seu inbox.' },
      { q: 'Posso compartilhar com meu time?', a: 'Pode. Pedimos só que não redistribua publicamente.' },
      { q: 'Vocês vão ficar mandando e-mail?', a: 'No máximo 1 e-mail por semana com conteúdo relevante. Descadastro em 1 clique.' },
    ],
    ctaTitle: 'Garanta o seu exemplar gratuito',
    ctaLabel: 'Quero receber agora',
    whatsapp: '5511988887777',
    phone: '(11) 4002-8922',
    email: 'contato@leadmagnet.com.br',
    address: '',
    hours: '',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. LP PRODUTO ÚNICO — vende 1 produto/serviço com preço
  // ─────────────────────────────────────────────────────────────
  'lp-produto-unico': {
    slug: 'lp-produto-unico',
    tagline: 'O produto que resolve o problema X de verdade — sem enrolação.',
    palette: {
      primary: '#111118',
      secondary: '#f97316',
      accent: '#facc15',
      surface: '#fffbeb',
    },
    mode: 'light',
    aboutText:
      'Construímos este produto ao longo de 3 anos, com 14 iterações e feedback de 2.800 clientes pagantes. É a versão final, sem cortes.',
    hero: {
      eyebrow: 'Lançamento · Edição limitada',
      title: 'O [Produto] que faz [resultado concreto] em [tempo curto].',
      subtitle: 'Garantia de 30 dias. Frete grátis para todo o Brasil. Entrega em até 5 dias úteis.',
      ctaLabel: 'Comprar agora',
      ctaHref: '#comprar',
      image: '',
      imageAlt: '',
    },
    services: [
      { icon: '⚡', name: 'Resultado em 7 dias', desc: 'Aplicação imediata. Você vê diferença na primeira semana.' },
      { icon: '🛡️', name: 'Garantia total', desc: '30 dias pra testar. Não gostou? Devolvemos 100% do valor.' },
      { icon: '🚚', name: 'Entrega rápida', desc: 'Frete grátis + entrega em até 5 dias úteis em todo Brasil.' },
    ],
    differentials: [
      { name: 'Feito pra durar', desc: 'Material premium, acabamento impecável, garantia estendida.' },
      { name: 'Suporte humano', desc: 'Dúvidas? Fala direto com nosso time por WhatsApp.' },
      { name: '+14.000 clientes', desc: 'Quase 15 mil pessoas confiam. Veja os depoimentos abaixo.' },
    ],
    stats: [
      { value: '14.2k', label: 'clientes ativos' },
      { value: '4.8 ★', label: 'média de avaliação' },
      { value: '97%', label: 'recomendariam' },
    ],
    testimonials: [
      { name: 'Carla Marques', role: 'Cliente desde 2023', text: 'Comprei sem muita expectativa e me surpreendi. Já indiquei pra 6 amigas. Vale cada centavo.' },
      { name: 'Bruno Watanabe', role: 'Cliente desde 2024', text: 'Qualidade absurda. O atendimento é outro nível. Recomendo sem pensar.' },
    ],
    faq: [
      { q: 'Como funciona a garantia?', a: 'Você tem 30 dias pra testar. Se não gostar, é só mandar um e-mail e devolvemos 100%.' },
      { q: 'Qual o prazo de entrega?', a: '5 dias úteis para todo o Brasil. Frete grátis.' },
      { q: 'Parcela em quantas vezes?', a: 'Em até 12x sem juros no cartão.' },
    ],
    ctaTitle: 'Aproveite antes que acabe',
    ctaLabel: 'Garantir o meu',
    whatsapp: '5511988887777',
    phone: '(11) 4002-8922',
    email: 'vendas@produto.com.br',
    address: '',
    hours: '',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. LP WAITLIST — "entre na lista de espera"
  // ─────────────────────────────────────────────────────────────
  'lp-waitlist': {
    slug: 'lp-waitlist',
    tagline: 'Estamos abrindo lista de espera. Vagas limitadas.',
    palette: {
      primary: '#0c0a09',
      secondary: '#fb923c',
      accent: '#fbbf24',
      surface: '#fef3c7',
    },
    mode: 'light',
    aboutText:
      'Lançamento previsto para Q1/2025. Quem está na lista de espera ganha acesso antecipado de 48h e 30% de desconto.',
    hero: {
      eyebrow: 'Lista de espera · Vagas limitadas',
      title: 'Algo grande está chegando. Garanta seu lugar antes de todo mundo.',
      subtitle: 'Inscritos na lista recebem acesso 48h antes do público e 30% de desconto na pré-venda.',
      ctaLabel: 'Entrar na lista',
      ctaHref: '#waitlist',
      image: '',
      imageAlt: '',
    },
    services: [
      { icon: '🚀', name: 'Acesso 48h antes', desc: 'Você entra antes do público geral. Sem fila, sem corrida.' },
      { icon: '💰', name: '30% de desconto', desc: 'Pré-venda exclusiva só para quem está na lista de espera.' },
      { icon: '🎁', name: 'Brinde de boas-vindas', desc: 'Os 500 primeiros inscritos ganham um kit exclusivo.' },
    ],
    differentials: [
      { name: 'Lista limitada', desc: 'Vamos abrir só 1.000 vagas neste primeiro lote.' },
      { name: 'Sem spam', desc: 'Você recebe só e-mails sobre o lançamento. Pode cancelar quando quiser.' },
      { name: 'Comunidade fechada', desc: 'Acesso ao grupo VIP com atualizações semanais até o lançamento.' },
    ],
    stats: [
      { value: '742/1000', label: 'vagas preenchidas' },
      { value: 'Q1/2025', label: 'previsão de lançamento' },
      { value: '30%', label: 'desconto pré-venda' },
    ],
    testimonials: [],
    faq: [
      { q: 'Quando recebo o acesso?', a: 'Os 48h antes do lançamento oficial. Vamos mandar e-mail com as instruções.' },
      { q: 'A lista é gratuita?', a: 'Sim. 100% gratuita, sem custo agora nem depois.' },
      { q: 'Posso sair da lista?', a: 'Quando quiser. É só clicar em descadastrar no e-mail.' },
    ],
    ctaTitle: 'Garanta sua vaga na lista',
    ctaLabel: 'Quero entrar',
    // LP de waitlist usa só e-mail — whatsapp fica vazio mas precisa ser string
    whatsapp: '0000000000000', // placeholder (validado pelo regex de dígitos)
    email: 'lista@waitlist.com.br',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. LP AGENDAMENTO — booking de serviço/consulta via WhatsApp
  // ─────────────────────────────────────────────────────────────
  'lp-agendamento': {
    slug: 'lp-agendamento',
    tagline: 'Agende seu horário em 60 segundos pelo WhatsApp.',
    palette: {
      primary: '#16a34a',
      secondary: '#052e16',
      accent: '#22c55e',
      surface: '#f0fdf4',
    },
    mode: 'light',
    aboutText:
      'Atendimento presencial e online. Agenda aberta de segunda a sábado. Confirmação em até 2 horas.',
    hero: {
      eyebrow: 'Agenda aberta · Resposta em 2h',
      title: 'Agende seu atendimento agora. Resposta em até 2 horas.',
      subtitle: 'Escolha o melhor horário, mande sua dúvida e a gente confirma o agendamento.',
      ctaLabel: 'Agendar pelo WhatsApp',
      ctaHref: '#agendar',
      image: '',
      imageAlt: '',
    },
    services: [
      { icon: '📅', name: 'Agenda aberta', desc: 'Horários disponíveis de segunda a sábado. Manhã, tarde e noite.' },
      { icon: '⚡', name: 'Resposta em 2h', desc: 'Você manda, a gente responde. Sem ficar esperando 3 dias.' },
      { icon: '📍', name: 'Presencial ou online', desc: 'Você escolhe. Atendimento por vídeo ou no consultório.' },
    ],
    differentials: [
      { name: 'Sem fila', desc: 'Atendimento por agenda. Você chega e é atendido na hora marcada.' },
      { name: 'Confirmação rápida', desc: 'Mensagem automática na hora + lembrete 24h antes.' },
      { name: 'Política de cancelamento', desc: 'Cancele até 12h antes sem custo. A gente entende.' },
    ],
    stats: [
      { value: '8.2k', label: 'agendamentos em 2024' },
      { value: '2h', label: 'tempo médio de resposta' },
      { value: '4.9 ★', label: 'de 1.840 avaliações' },
    ],
    testimonials: [
      { name: 'Patrícia Lima', role: 'Cliente desde 2023', text: 'Agendei pelo WhatsApp, recebi confirmação em 30 minutos. Atendimento impecável.' },
      { name: 'Ricardo Tavares', role: 'Cliente desde 2024', text: 'Prático, rápido e sem burocracia. Voltarei com certeza.' },
    ],
    faq: [
      { q: 'Como funciona o agendamento?', a: 'Você clica no botão, manda sua preferência de data/horário e a gente confirma por WhatsApp.' },
      { q: 'Posso remarcar?', a: 'Sim, até 12h antes do horário marcado, sem custo.' },
      { q: 'Atende online?', a: 'Sim, por videochamada. Link enviado após confirmação.' },
    ],
    ctaTitle: 'Garanta seu horário esta semana',
    ctaLabel: 'Agendar agora',
    whatsapp: '5511988887777',
    phone: '(11) 4002-8922',
    email: 'agenda@agendamento.com.br',
    address: '',
    hours: 'Seg–Sáb, 9h–20h',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. LP EVENTO — conferência/workshop com data, local, programação
  // ─────────────────────────────────────────────────────────────
  'lp-evento': {
    slug: 'lp-evento',
    tagline: 'O evento que reúne os maiores especialistas do Brasil.',
    palette: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#a855f7',
      surface: '#faf5ff',
    },
    mode: 'light',
    aboutText:
      '1 dia inteiro, 14 palestrantes, 600 participantes. O ponto de encontro anual da comunidade.',
    hero: {
      eyebrow: '15 de março de 2025 · São Paulo',
      title: 'O maior encontro do ano está de volta. 600 vagas.',
      subtitle: '1 dia · 14 palestrantes · 4 trilhas paralelas. Último lote até 28 de fevereiro.',
      ctaLabel: 'Garantir meu ingresso',
      ctaHref: '#ingresso',
      image: '',
      imageAlt: '',
    },
    services: [
      { icon: '🎤', name: '14 palestrantes', desc: 'Os maiores especialistas do Brasil compartilhando o que funciona.' },
      { icon: '📚', name: '4 trilhas paralelas', desc: 'Negócios, produto, marketing e tech. Escolha sua trilha.' },
      { icon: '🤝', name: 'Networking real', desc: 'Coffee breaks, almoço e after para você fazer as conexões certas.' },
    ],
    differentials: [
      { name: 'Coffee e almoço inclusos', desc: 'Comida boa, gente boa, conversa boa. Tudo pago.' },
      { name: 'Material pós-evento', desc: 'Gravações de todas as palestras enviadas em até 7 dias.' },
      { name: 'Certificado', desc: '12 horas de carga horária. PDF para LinkedIn.' },
    ],
    stats: [
      { value: '600', label: 'vagas' },
      { value: '14', label: 'palestrantes' },
      { value: '4', label: 'trilhas paralelas' },
    ],
    testimonials: [
      { name: 'Camila Rocha', role: 'Participante 2024', text: 'Melhor evento do ano, sem exagero. Saí com 12 novas conexões e 3 possíveis parcerias.' },
      { name: 'Diego Martins', role: 'Participante 2023', text: 'O conteúdo é denso, sem panelinha. Palestrantes acessíveis no after. Vale o investimento.' },
    ],
    faq: [
      { q: 'Onde é o evento?', a: 'Centro de Convenções — Av. Paulista, 1000 — São Paulo/SP.' },
      { q: 'Tem estacionamento?', a: 'Sim, com 400 vagas. Grátis para participantes.' },
      { q: 'Posso cancelar?', a: 'Até 7 dias antes do evento com reembolso integral.' },
      { q: 'Tem versão online?', a: 'Não. Este evento é 100% presencial — networking é parte do valor.' },
    ],
    ctaTitle: 'Garanta seu lugar antes do último lote',
    ctaLabel: 'Quero meu ingresso',
    whatsapp: '5511988887777',
    phone: '(11) 4002-8922',
    email: 'ingresso@evento.com.br',
    address: 'Centro de Convenções — Av. Paulista, 1000 — São Paulo/SP',
    hours: '15 de março de 2025, das 8h às 19h',
  },
};
