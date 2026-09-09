/**
 * /lp — Landing page pública da Social Marketing BR.
 *
 * Server component. Pré-qualifica o lead: explica o serviço, mostra 5 modelos
 * prontos (cards com iframe do /api/template-preview), e empurra pra WhatsApp.
 * Sem auth — o middleware deixa passar via PUBLIC_PATHS.
 */
import type { Metadata } from 'next';
import { waLink, WHATSAPP } from './wa';
import { PUBLIC_MODELS } from './data';
import { ModelCardPublic } from './_components/ModelCardPublic';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Social Marketing BR — Sites prontos em 48h por R$ 197',
  description:
    'Sites profissionais, responsivos, com domínio e hospedagem inclusos. 5 modelos prontos, prontos em menos de 48h, sem mensalidade. R$ 197.',
};

const MSG_HERO = 'Olá! Vi o site da Social Marketing BR e quero fazer meu site por R$ 197 (pronto em 48h). Pode me passar mais informações?';
const MSG_FOOTER = 'Olá! Quero fazer um site institucional com a Social Marketing BR. Pode me passar mais informações sobre o serviço de R$ 197?';

const FEATURES = [
  {
    emoji: '📱',
    title: '100% responsivo',
    desc: 'Funciona perfeito em celular, tablet e desktop. Hoje 80% dos acessos vêm do mobile — o seu site vai estar pronto.',
  },
  {
    emoji: '⚡',
    title: 'Pronto em 48h',
    desc: 'Após o briefing, seu site fica pronto em menos de 48 horas. Você aprova antes de publicar.',
  },
  {
    emoji: '🌐',
    title: 'Domínio + hospedagem',
    desc: 'Domínio .com.br e 1 ano de hospedagem inclusos. Você não precisa se preocupar com nada técnico.',
  },
];

const STEPS = [
  { n: '1', title: 'Briefing rápido', desc: 'Você me conta o que precisa por WhatsApp (5-10 min).' },
  { n: '2', title: 'Produção em 48h', desc: 'A gente monta seu site com base em um dos modelos prontos.' },
  { n: '3', title: 'Aprovação e entrega', desc: 'Você vê, aprova e o site vai pro ar. Domínio e hospedagem inclusos.' },
];

const INCLUDED = [
  'Domínio .com.br no primeiro ano',
  '1 ano de hospedagem inclusa',
  'Design responsivo (mobile, tablet, desktop)',
  'Botão de WhatsApp flutuante',
  'Formulário de contato',
  'SEO básico (título, descrição, sitemap)',
  'Integração com Google Analytics',
  'SSL (cadeado de segurança) grátis',
];

export default function LpPage() {
  const heroHref = waLink(WHATSAPP, MSG_HERO);
  const footerHref = waLink(WHATSAPP, MSG_FOOTER);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-violet-500/20">
              S
            </div>
            <span className="font-semibold text-base tracking-tight">
              Social Marketing <span className="text-violet-400">BR</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#modelos" className="hover:text-white transition-colors">Modelos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#preco" className="hover:text-white transition-colors">Preço</a>
          </nav>
          <a
            href={heroHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20"
          >
            💬 Falar agora
          </a>
        </div>
      </header>

      <main id="top" className="max-w-6xl mx-auto px-5">
        {/* Hero */}
        <section className="pt-16 pb-20 md:pt-24 md:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
            Sites profissionais por R$ 197 · prontos em 48h
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Seu site sai por{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              R$ 197
            </span>{' '}
            e fica pronto em 48h.
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Site profissional, responsivo, com domínio e hospedagem inclusos. Sem mensalidade,
            sem complicação. Você aprova antes de publicar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={heroHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-base font-semibold transition-colors shadow-lg shadow-emerald-500/30 w-full sm:w-auto justify-center"
            >
              💬 Quero meu site por R$ 197
            </a>
            <a
              href="#modelos"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-100 text-base font-medium transition-colors w-full sm:w-auto justify-center"
            >
              Ver 5 modelos prontos →
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs md:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">⚡ Site pronto em 48h</span>
            <span className="flex items-center gap-1.5">💰 R$ 197 (sem mensalidade)</span>
            <span className="flex items-center gap-1.5">🌐 Domínio + hospedagem inclusos</span>
          </div>
        </section>

        {/* O que você recebe */}
        <section className="pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">O que você recebe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center text-2xl mb-4">
                  {f.emoji}
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5 modelos prontos */}
        <section id="modelos" className="pb-20 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">5 modelos prontos pra você escolher</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Todos funcionais. Clique num card pra ver o site real, ou já chama no WhatsApp pra
              adaptar pro seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PUBLIC_MODELS.map((m) => (
              <ModelCardPublic key={m.slug} model={m} />
            ))}
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="pb-20 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur p-6 relative"
              >
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-violet-500/30">
                  {s.n}
                </div>
                <h3 className="font-semibold text-slate-100 mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Por que R$ 197 */}
        <section id="preco" className="pb-20 scroll-mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 via-slate-900/50 to-indigo-500/10 border border-violet-500/30 backdrop-blur p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Por que R$ 197?</h2>
            <p className="text-slate-300 text-center mb-8 text-sm md:text-base">
              Pagamento único. Sem mensalidade, sem renovação obrigatória.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                R$ 197
              </div>
              <p className="text-slate-400 text-sm mb-6">pagamento único · sem mensalidade</p>
              <a
                href={heroHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-base font-semibold transition-colors shadow-lg shadow-emerald-500/30"
              >
                💬 Quero meu site agora
              </a>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="pb-20">
          <div className="rounded-3xl bg-gradient-to-br from-[#25D366] to-[#1DA851] p-8 md:p-12 text-center shadow-2xl shadow-emerald-500/20">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
              Pronto pra ter seu site no ar em 48h?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-2xl mx-auto">
              Manda um oi no WhatsApp, te respondo na hora com um orçamento detalhado.
            </p>
            <a
              href={heroHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1DA851] text-lg font-bold transition-transform hover:scale-105 shadow-2xl"
            >
              💬 Falar no WhatsApp agora
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Social Marketing BR · Sites que convertem
          </div>
          <a
            href="/admin"
            className="text-slate-600 hover:text-slate-400 transition-colors"
          >
            admin
          </a>
        </div>
      </footer>
    </div>
  );
}
