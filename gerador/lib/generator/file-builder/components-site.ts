/**
 * Gera os componentes do site exportado em components/site/.
 * Um arquivo por componente (não _bundle.tsx) — corrige o bug atual.
 * Cada componente é um React Server Component puro, sem estado.
 *
 * IMPORTANTE: os arquivos gerados NÃO usam template literals com ${...}
 * porque o esbuild do vitest pode interpretar isso como interpolação TS.
 * Usamos strings estáticas com concat em volta dos placeholders de runtime.
 */
import type { BuildOptions, FileMap } from './types';

export function buildSiteComponents(opts: BuildOptions): FileMap {
  const files: Record<string, string> = {};

  // Registry — mapeia nome → componente
  files['components/site/registry.tsx'] =
`import { Header } from './Header';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { HeroSimple } from './HeroSimple';
import { Services } from './Services';
import { Specialties } from './Specialties';
import { Differentials } from './Differentials';
import { About } from './About';
import { History } from './History';
import { Stats } from './Stats';
import { CTA } from './CTA';
import { Contact } from './Contact';
import { Map } from './Map';
import { Team } from './Team';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { Legal } from './Legal';
import { Gallery } from './Gallery';
import { Products } from './Products';
import { ProductList } from './ProductList';
import { Cases } from './Cases';
import { BlogList } from './BlogList';
import { Properties } from './Properties';
import { PropertyList } from './PropertyList';
import { MenuPreview } from './MenuPreview';
import { MenuFull } from './MenuFull';
import { Reservation } from './Reservation';

export const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  Header, Footer, Hero, HeroSimple,
  Services, Specialties, Differentials,
  About, History, Stats,
  CTA, Contact, Map,
  Team, Testimonials, FAQ, Legal,
  Gallery, Products, ProductList, Cases, BlogList,
  Properties, PropertyList, MenuPreview, MenuFull, Reservation,
};

export function renderComponent(name: string, props: any): React.ReactNode {
  const Component = COMPONENT_REGISTRY[name];
  if (!Component) return null;
  return <Component {...props} />;
}

export function getAvailableComponents() {
  return Object.keys(COMPONENT_REGISTRY);
}
`;

  files['components/site/Header.tsx'] = headerComponent();
  files['components/site/Footer.tsx'] = footerComponent();
  files['components/site/Hero.tsx'] = heroComponent();
  files['components/site/HeroSimple.tsx'] = heroSimpleComponent();
  files['components/site/Services.tsx'] = servicesComponent();
  files['components/site/Specialties.tsx'] = specialtiesComponent();
  files['components/site/Differentials.tsx'] = differentialsComponent();
  files['components/site/About.tsx'] = aboutComponent();
  files['components/site/History.tsx'] = historyComponent();
  files['components/site/Stats.tsx'] = statsComponent();
  files['components/site/CTA.tsx'] = ctaComponent();
  files['components/site/Contact.tsx'] = contactComponent();
  files['components/site/Map.tsx'] = mapComponent();
  files['components/site/Team.tsx'] = teamComponent();
  files['components/site/Testimonials.tsx'] = testimonialsComponent();
  files['components/site/FAQ.tsx'] = faqComponent();
  files['components/site/Legal.tsx'] = legalComponent();
  files['components/site/Gallery.tsx'] = galleryComponent();
  files['components/site/Products.tsx'] = productsComponent();
  files['components/site/ProductList.tsx'] = productsComponent().replace('Products', 'ProductList');
  files['components/site/Cases.tsx'] = casesComponent();
  files['components/site/BlogList.tsx'] = blogListComponent();
  files['components/site/Properties.tsx'] = propertiesComponent();
  files['components/site/PropertyList.tsx'] = propertiesComponent().replace('Properties', 'PropertyList');
  files['components/site/MenuPreview.tsx'] = menuPreviewComponent();
  files['components/site/MenuFull.tsx'] = menuPreviewComponent().replace('MenuPreview', 'MenuFull');
  files['components/site/Reservation.tsx'] = reservationComponent();

  return files;
}

// ────────────────────────────────────────────────────────────────
// Helpers compartilhados pelos componentes do site exportado
// ────────────────────────────────────────────────────────────────

function waLink(whatsapp: string | undefined, text?: string): string {
  const num = String(whatsapp || '').replace(/\D/g, '');
  if (!num) return '#';
  return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text || 'Olá!');
}

// ────────────────────────────────────────────────────────────────
// Componentes individuais
// ────────────────────────────────────────────────────────────────

function headerComponent(): string {
  return [
    "export function Header({ content, theme, nav, siteName }: any) {",
    "  const variant = content.variant || 'sticky-dark';",
    "  const isDark = variant.includes('dark');",
    "  const transparent = variant.includes('transparent') || variant.includes('sticky');",
    "  const bg = transparent ? 'transparent' : (isDark ? theme?.primary : theme?.surface);",
    "  const fg = isDark ? '#fff' : theme?.text;",
    "  return (",
    "    <header style={{ background: bg, color: fg, padding: '16px 0', position: transparent ? 'sticky' : 'static', top: 0, zIndex: 100 }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>",
    "        <a href=\"/\" style={{ fontWeight: 800, fontSize: 18, color: 'inherit', textDecoration: 'none' }}>{siteName}</a>",
    "        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>",
    "          {nav.map((l: any, i: number) => (",
    "            <a key={i} href={l.href} style={{ color: 'inherit', textDecoration: 'none', fontSize: 14, fontWeight: 500, opacity: 0.9 }}>{l.label}</a>",
    "          ))}",
    "          {content.cta && (",
    "            <a href={content.cta.href || '#'} style={{ background: theme?.accent, color: '#fff', padding: '8px 18px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{content.cta.label || 'Fale conosco'}</a>",
    "          )}",
    "        </nav>",
    "      </div>",
    "    </header>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function footerComponent(): string {
  return [
    "export function Footer({ content, theme, nav, siteName }: any) {",
    "  const year = new Date().getFullYear();",
    "  const wa = content.whatsapp;",
    "  return (",
    "    <>",
    "      {content.floatingWa && wa && (",
    "        <a href={'https://wa.me/' + String(wa).replace(/\\D/g, '') + '?text=' + encodeURIComponent(content.floatingWaText || 'Olá!')} target=\"_blank\" rel=\"noopener\"",
    "           style={{ position: 'fixed', bottom: 24, right: 24, background: '#25d366', color: '#fff', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.2)', zIndex: 99, textDecoration: 'none', fontSize: 28 }}>",
    "          💬",
    "        </a>",
    "      )}",
    "      <footer style={{ background: theme?.primary || '#0f172a', color: '#fff', padding: '64px 24px 32px' }}>",
    "        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>",
    "          <div>",
    "            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{siteName}</h3>",
    "            <p style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.6 }}>{content.tagline || ''}</p>",
    "          </div>",
    "          <div>",
    "            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.04em' }}>Páginas</h4>",
    "            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>",
    "              {nav.map((l: any, i: number) => <li key={i} style={{ marginBottom: 8 }}><a href={l.href} style={{ color: '#fff', opacity: 0.7, textDecoration: 'none', fontSize: 14 }}>{l.label}</a></li>)}",
    "            </ul>",
    "          </div>",
    "          <div>",
    "            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.04em' }}>Contato</h4>",
    "            {content.phone && <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 6px' }}>{content.phone}</p>}",
    "            {content.email && <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 6px' }}>{content.email}</p>}",
    "            {content.address && <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 6px' }}>{content.address}</p>}",
    "            {content.hours && <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 6px' }}>{content.hours}</p>}",
    "            {content.cnpj && <p style={{ opacity: 0.5, fontSize: 12, margin: '8px 0 0' }}>CNPJ: {content.cnpj}</p>}",
    "          </div>",
    "          <div>",
    "            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.04em' }}>Redes</h4>",
    "            {content.social?.instagram && <p style={{ margin: '0 0 6px' }}><a href={content.social.instagram} style={{ color: '#fff', opacity: 0.7, textDecoration: 'none', fontSize: 14 }}>Instagram</a></p>}",
    "            {content.social?.facebook && <p style={{ margin: '0 0 6px' }}><a href={content.social.facebook} style={{ color: '#fff', opacity: 0.7, textDecoration: 'none', fontSize: 14 }}>Facebook</a></p>}",
    "            {content.social?.youtube && <p style={{ margin: '0 0 6px' }}><a href={content.social.youtube} style={{ color: '#fff', opacity: 0.7, textDecoration: 'none', fontSize: 14 }}>YouTube</a></p>}",
    "            {content.social?.tiktok && <p style={{ margin: '0 0 6px' }}><a href={content.social.tiktok} style={{ color: '#fff', opacity: 0.7, textDecoration: 'none', fontSize: 14 }}>TikTok</a></p>}",
    "          </div>",
    "        </div>",
    "        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.12)', display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.6 }}>",
    "          <span>© {year} {siteName}. Todos os direitos reservados.</span>",
    "          <span>Gerado por Fábrica de Sites Real</span>",
    "        </div>",
    "      </footer>",
    "    </>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function heroComponent(): string {
  return [
    "export function Hero({ content, theme }: any) {",
    "  const variant = content.variant || 'split';",
    "  const headline = content.headline || '';",
    "  const sub = content.subheadline || content.sub || '';",
    "  const ctas = content.ctas || [];",
    "  const bg = content.background || theme?.background;",
    "  const fg = theme?.text;",
    "  const bgImage = content.bgImage;",
    "  const bgStyle = variant === 'image' && bgImage",
    "    ? { background: 'url(' + bgImage + ') center/cover' }",
    "    : { background: bg };",
    "  const fgColor = variant === 'image' ? '#fff' : fg;",
    "  return (",
    "    <section style={Object.assign({}, bgStyle, { color: fgColor, padding: '96px 24px', minHeight: 540, display: 'flex', alignItems: 'center', position: 'relative' })}>",
    "      {variant === 'image' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)' }} />}",
    "      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: variant === 'split' && content.image ? '1fr 1fr' : '1fr', gap: 40, alignItems: 'center' }}>",
    "        <div>",
    "          {content.kicker && <p style={{ fontSize: 13, fontWeight: 600, color: theme?.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{content.kicker}</p>}",
    "          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>{headline}</h1>",
    "          {sub && <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 24, lineHeight: 1.5 }}>{sub}</p>}",
    "          {ctas.length > 0 && (",
    "            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>",
    "              {ctas.map((c: any, i: number) => (",
    "                <a key={i} href={c.href || '#'} style={{ background: i === 0 ? (theme?.accent || '#f97316') : 'transparent', color: '#fff', border: i === 0 ? 'none' : '1px solid #fff', padding: '13px 26px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>",
    "                  {c.label}",
    "                </a>",
    "              ))}",
    "            </div>",
    "          )}",
    "        </div>",
    "        {variant === 'split' && content.image && (",
    "          <div><img src={content.image} alt={content.imageAlt || ''} style={{ width: '100%', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,.15)' }} /></div>",
    "        )}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function heroSimpleComponent(): string {
  return [
    "export function HeroSimple({ content, theme }: any) {",
    "  return (",
    "    <section style={{ background: theme?.primary, color: '#fff', padding: '64px 24px', textAlign: 'center' }}>",
    "      {content.breadcrumb && (",
    "        <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>{content.breadcrumb}</p>",
    "      )}",
    "      <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: 0 }}>{content.headline}</h1>",
    "      {content.subheadline && <p style={{ fontSize: 16, opacity: 0.85, marginTop: 12 }}>{content.subheadline}</p>}",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function servicesComponent(): string {
  return [
    "export function Services({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.surface }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        {content.title && <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 12px', color: theme?.text }}>{content.title}</h2>}",
    "        {content.subtitle && <p style={{ textAlign: 'center', color: theme?.textMuted || '#64748b', fontSize: 16, marginBottom: 48 }}>{content.subtitle}</p>}",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>",
    "          {items.map((item: any, i: number) => (",
    "            <div key={i} style={{ background: theme?.background, padding: 32, borderRadius: 12, border: '1px solid ' + borderColor }}>",
    "              {item.icon && <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>}",
    "              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: theme?.text }}>{item.title}</h3>",
    "              <p style={{ fontSize: 14, color: theme?.textMuted, lineHeight: 1.6 }}>{item.description}</p>",
    "            </div>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function specialtiesComponent(): string {
  return [
    "export function Specialties({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Especialidades'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>",
    "          {items.map((item: any, i: number) => (",
    "            <div key={i} style={{ padding: 24, borderRadius: 10, border: '2px solid ' + (theme?.accent || '#f97316'), textAlign: 'center' }}>",
    "              <h3 style={{ fontSize: 16, fontWeight: 700, color: theme?.text, margin: 0 }}>{item.title}</h3>",
    "            </div>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function differentialsComponent(): string {
  return [
    "export function Differentials({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.primary, color: '#fff' }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px' }}>{content.title || 'Por que nos escolher'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>",
    "          {items.map((item: any, i: number) => (",
    "            <div key={i} style={{ padding: 28, borderRadius: 12, background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)' }}>",
    "              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{item.title}</h3>",
    "              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>{item.description}</p>",
    "            </div>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function aboutComponent(): string {
  return [
    "export function About({ content, theme }: any) {",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>",
    "        {content.image && <img src={content.image} alt=\"\" style={{ borderRadius: 12, width: '100%' }} />}",
    "        <div>",
    "          {content.kicker && <p style={{ fontSize: 13, fontWeight: 600, color: theme?.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{content.kicker}</p>}",
    "          <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px', color: theme?.text }}>{content.title || 'Sobre nós'}</h2>",
    "          {(content.paragraphs || []).map((p: string, i: number) => <p key={i} style={{ fontSize: 16, color: theme?.textMuted, lineHeight: 1.7, marginBottom: 12 }}>{p}</p>)}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function historyComponent(): string {
  return [
    "export function History({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.surface }}>",
    "      <div style={{ maxWidth: 800, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Nossa história'}</h2>",
    "        <div style={{ position: 'relative' }}>",
    "          <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2, background: theme?.accent }} />",
    "          {items.map((item: any, i: number) => (",
    "            <div key={i} style={{ paddingLeft: 60, marginBottom: 32, position: 'relative' }}>",
    "              <div style={{ position: 'absolute', left: 8, top: 4, width: 18, height: 18, borderRadius: '50%', background: theme?.accent }} />",
    "              <p style={{ fontSize: 13, color: theme?.accent, fontWeight: 600, margin: '0 0 4px' }}>{item.year}</p>",
    "              <h3 style={{ fontSize: 18, fontWeight: 700, color: theme?.text, margin: '0 0 6px' }}>{item.title}</h3>",
    "              <p style={{ fontSize: 14, color: theme?.textMuted, lineHeight: 1.6 }}>{item.description}</p>",
    "            </div>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function statsComponent(): string {
  return [
    "export function Stats({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  return (",
    "    <section style={{ padding: '64px 24px', background: theme?.accent, color: '#fff' }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>",
    "        {items.map((item: any, i: number) => (",
    "          <div key={i}>",
    "            <p style={{ fontSize: 48, fontWeight: 800, margin: 0 }}>{item.value}</p>",
    "            <p style={{ fontSize: 14, opacity: 0.9, margin: '8px 0 0' }}>{item.label}</p>",
    "          </div>",
    "        ))}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function ctaComponent(): string {
  return [
    "export function CTA({ content, theme }: any) {",
    "  const wa = content.whatsapp;",
    "  const href = wa ? 'https://wa.me/' + String(wa).replace(/\\D/g, '') + '?text=' + encodeURIComponent(content.waText || 'Olá!') : (content.href || '#');",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.primary, color: '#fff', textAlign: 'center' }}>",
    "      <div style={{ maxWidth: 720, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px' }}>{content.title || 'Pronto para começar?'}</h2>",
    "        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 32 }}>{content.subtitle || ''}</p>",
    "        <a href={href} style={{ background: theme?.accent || '#f97316', color: '#fff', padding: '16px 36px', borderRadius: 8, textDecoration: 'none', fontSize: 16, fontWeight: 700, display: 'inline-block' }}>",
    "          {content.buttonLabel || 'Fale conosco'}",
    "        </a>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function contactComponent(): string {
  return [
    "export function Contact({ content, theme }: any) {",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.surface }}>",
    "      <div style={{ maxWidth: 720, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 16px', color: theme?.text }}>{content.title || 'Entre em contato'}</h2>",
    "        {content.subtitle && <p style={{ textAlign: 'center', color: theme?.textMuted, marginBottom: 40 }}>{content.subtitle}</p>}",
    "        <form style={{ display: 'grid', gap: 14, background: theme?.background, padding: 32, borderRadius: 12, border: '1px solid ' + borderColor }}>",
    "          <input placeholder=\"Nome\"\" style={{ padding: 12, borderRadius: 6, border: '1px solid ' + borderColor, fontSize: 14 }} />",
    "          <input placeholder=\"E-mail\" type=\"email\" style={{ padding: 12, borderRadius: 6, border: '1px solid ' + borderColor, fontSize: 14 }} />",
    "          <input placeholder=\"Telefone\" style={{ padding: 12, borderRadius: 6, border: '1px solid ' + borderColor, fontSize: 14 }} />",
    "          <textarea placeholder=\"Mensagem\" rows={5} style={{ padding: 12, borderRadius: 6, border: '1px solid ' + borderColor, fontSize: 14, fontFamily: 'inherit' }} />",
    "          <button type=\"button\" style={{ background: theme?.primary, color: '#fff', border: 'none', padding: 14, borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Enviar mensagem</button>",
    "        </form>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function mapComponent(): string {
  return [
    "export function Map({ content }: any) {",
    "  if (!content.embed) return null;",
    "  return (",
    "    <section style={{ padding: '0' }}>",
    "      <iframe src={content.embed} style={{ width: '100%', height: 400, border: 0 }} loading=\"lazy\" />",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function teamComponent(): string {
  return [
    "export function Team({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Nossa equipe'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>",
    "          {items.map((m: any, i: number) => (",
    "            <div key={i} style={{ textAlign: 'center' }}>",
    "              {m.photo && <img src={m.photo} alt={m.name} style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />}",
    "              <h3 style={{ fontSize: 16, fontWeight: 700, color: theme?.text, margin: '0 0 4px' }}>{m.name}</h3>",
    "              <p style={{ fontSize: 14, color: theme?.accent, margin: 0 }}>{m.role}</p>",
    "            </div>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function testimonialsComponent(): string {
  return [
    "export function Testimonials({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.surface }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'O que dizem nossos clientes'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>",
    "          {items.map((t: any, i: number) => (",
    "            <blockquote key={i} style={{ background: theme?.background, padding: 28, borderRadius: 12, border: '1px solid ' + borderColor, margin: 0 }}>",
    "              <p style={{ fontSize: 14, color: theme?.textMuted, lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>\"{t.content}\"</p>",
    "              <p style={{ fontSize: 14, fontWeight: 700, color: theme?.text, margin: 0 }}>— {t.author}{t.role ? ', ' + t.role : ''}</p>",
    "              {t.rating && <p style={{ color: theme?.accent, margin: '8px 0 0' }}>{'★'.repeat(t.rating)}</p>}",
    "            </blockquote>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function faqComponent(): string {
  return [
    "export function FAQ({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 800, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Perguntas frequentes'}</h2>",
    "        {items.map((f: any, i: number) => (",
    "          <details key={i} style={{ marginBottom: 14, padding: 20, borderRadius: 8, background: theme?.surface, border: '1px solid ' + borderColor }}>",
    "            <summary style={{ fontWeight: 700, color: theme?.text, cursor: 'pointer', fontSize: 16 }}>{f.question}</summary>",
    "            <p style={{ marginTop: 12, fontSize: 14, color: theme?.textMuted, lineHeight: 1.6 }}>{f.answer}</p>",
    "          </details>",
    "        ))}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function legalComponent(): string {
  return [
    "export function Legal({ content }: any) {",
    "  return (",
    "    <section style={{ padding: '40px 24px' }}>",
    "      <div style={{ maxWidth: 800, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{content.title || 'Informações'}</h2>",
    "        {(content.paragraphs || []).map((p: string, i: number) => <p key={i} style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>{p}</p>)}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function galleryComponent(): string {
  return [
    "export function Gallery({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Galeria'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>",
    "          {items.map((img: any, i: number) => (",
    "            <img key={i} src={img.url} alt={img.alt || ''} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8 }} />",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function productsComponent(): string {
  return [
    "export function Products({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Produtos'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>",
    "          {items.map((p: any, i: number) => (",
    "            <div key={i} style={{ background: theme?.surface, borderRadius: 12, overflow: 'hidden', border: '1px solid ' + borderColor }}>",
    "              {p.image && <img src={p.image} alt={p.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />}",
    "              <div style={{ padding: 20 }}>",
    "                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: theme?.text }}>{p.name}</h3>",
    "                {p.price && <p style={{ fontSize: 18, fontWeight: 800, color: theme?.accent, margin: '0 0 8px' }}>{p.price}</p>}",
    "                {p.description && <p style={{ fontSize: 13, color: theme?.textMuted, lineHeight: 1.5 }}>{p.description}</p>}",
    "              </div>",
    "            </div>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function casesComponent(): string {
  return [
    "export function Cases({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.surface }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 48px', color: theme?.text }}>{content.title || 'Cases'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>",
    "          {items.map((c: any, i: number) => (",
    "            <article key={i} style={{ background: theme?.background, borderRadius: 12, overflow: 'hidden', border: '1px solid ' + borderColor }}>",
    "              {c.image && <img src={c.image} alt={c.title} style={{ width: '100%', height: 220, objectFit: 'cover' }} />}",
    "              <div style={{ padding: 24 }}>",
    "                <p style={{ fontSize: 12, color: theme?.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px' }}>{c.tag}</p>",
    "                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: theme?.text }}>{c.title}</h3>",
    "                <p style={{ fontSize: 14, color: theme?.textMuted, lineHeight: 1.6 }}>{c.summary}</p>",
    "              </div>",
    "            </article>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function blogListComponent(): string {
  return [
    "export function BlogList({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1000, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 48px', color: theme?.text }}>{content.title || 'Blog'}</h2>",
    "        {items.map((p: any, i: number) => (",
    "          <article key={i} style={{ paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid ' + borderColor }}>",
    "            <p style={{ fontSize: 12, color: theme?.accent, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 6px' }}>{p.category || 'Artigo'}</p>",
    "            <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: theme?.text }}>{p.title}</h3>",
    "            <p style={{ fontSize: 14, color: theme?.textMuted, lineHeight: 1.6 }}>{p.excerpt}</p>",
    "          </article>",
    "        ))}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function propertiesComponent(): string {
  return [
    "export function Properties({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1200, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 48px', color: theme?.text }}>{content.title || 'Imóveis em destaque'}</h2>",
    "        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>",
    "          {items.map((p: any, i: number) => (",
    "            <article key={i} style={{ background: theme?.surface, borderRadius: 12, overflow: 'hidden', border: '1px solid ' + borderColor }}>",
    "              {p.image && <img src={p.image} alt={p.title} style={{ width: '100%', height: 220, objectFit: 'cover' }} />}",
    "              <div style={{ padding: 24 }}>",
    "                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: theme?.text }}>{p.title}</h3>",
    "                <p style={{ fontSize: 13, color: theme?.textMuted, margin: '0 0 8px' }}>{p.location}</p>",
    "                <p style={{ fontSize: 22, fontWeight: 800, color: theme?.accent, margin: 0 }}>{p.price}</p>",
    "              </div>",
    "            </article>",
    "          ))}",
    "        </div>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function menuPreviewComponent(): string {
  return [
    "export function MenuPreview({ content, theme }: any) {",
    "  const items = content.items || [];",
    "  const borderColor = theme?.border || '#e2e8f0';",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.background }}>",
    "      <div style={{ maxWidth: 1000, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 12px', color: theme?.text }}>{content.title || 'Cardápio'}</h2>",
    "        {content.subtitle && <p style={{ textAlign: 'center', color: theme?.textMuted, marginBottom: 48 }}>{content.subtitle}</p>}",
    "        {items.map((cat: any, i: number) => (",
    "          <div key={i} style={{ marginBottom: 40 }}>",
    "            <h3 style={{ fontSize: 22, fontWeight: 700, color: theme?.accent, marginBottom: 16 }}>{cat.category}</h3>",
    "            {(cat.items || []).map((it: any, j: number) => (",
    "              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed ' + borderColor }}>",
    "                <div>",
    "                  <p style={{ fontSize: 15, fontWeight: 600, color: theme?.text, margin: 0 }}>{it.name}</p>",
    "                  {it.description && <p style={{ fontSize: 13, color: theme?.textMuted, margin: '4px 0 0' }}>{it.description}</p>}",
    "                </div>",
    "                <p style={{ fontSize: 15, fontWeight: 700, color: theme?.accent }}>{it.price}</p>",
    "              </div>",
    "            ))}",
    "          </div>",
    "        ))}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}

function reservationComponent(): string {
  return [
    "export function Reservation({ content, theme }: any) {",
    "  return (",
    "    <section style={{ padding: '80px 24px', background: theme?.primary, color: '#fff', textAlign: 'center' }}>",
    "      <div style={{ maxWidth: 600, margin: '0 auto' }}>",
    "        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px' }}>{content.title || 'Reserve sua mesa'}</h2>",
    "        <p style={{ opacity: 0.9, marginBottom: 32 }}>{content.subtitle || ''}</p>",
    "        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>",
    "          <input placeholder=\"Nome\"\" style={{ padding: 12, borderRadius: 6, border: 'none', fontSize: 14 }} />",
    "          <input placeholder=\"Telefone\"\" style={{ padding: 12, borderRadius: 6, border: 'none', fontSize: 14 }} />",
    "          <input type=\"date\" style={{ padding: 12, borderRadius: 6, border: 'none', fontSize: 14 }} />",
    "          <input type=\"time\" style={{ padding: 12, borderRadius: 6, border: 'none', fontSize: 14 }} />",
    "          <button type=\"button\" style={{ gridColumn: '1 / -1', background: theme?.accent, color: '#fff', border: 'none', padding: 14, borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Reservar</button>",
    "        </form>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join('\n');
}