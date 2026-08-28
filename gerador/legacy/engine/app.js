/* ==========================================================================
   APP — Aplicação principal (Dashboard, Editor, Modo Apresentação, Exportação)
   ========================================================================== */

const STATE = {
  page:'dashboard',
  currentProject:null,
  editorStep:'info',
  device:'desktop',
  filter:'all',
  projects:[],
  clients:[],
  media:[],
  references:[],
};

const STORAGE_KEY='geradorSites_v2';

/* ---------- PERSIST ---------- */
function loadState(){
  try{
    const s=localStorage.getItem(STORAGE_KEY);
    if(s){
      const j=JSON.parse(s);
      STATE.projects=j.projects||[];
      STATE.clients=j.clients||[];
      STATE.media=j.media||[];
      STATE.references=j.references||[];
    }
  }catch(e){}
  if(STATE.projects.length===0) seed();
  if(STATE.clients.length===0) seedClients();
}
function saveState(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({
    projects:STATE.projects,clients:STATE.clients,media:STATE.media,references:STATE.references
  }))}catch(e){}
}
function seed(){
  STATE.projects.push({
    id:uid(),name:'Demo ABC Climatização',client:'João Silva',company:'ABC Climatização',
    segment:'Climatização',city:'Londrina',modelId:'mechanic',templateId:'servicos-gerais',
    status:'done',createdAt:Date.now()-86400000,
    data:defaultData('ABC Climatização','João Silva','Climatização','Londrina')
  });
}
function seedClients(){
  STATE.clients=[
    {id:uid(),name:'João Silva',company:'ABC Climatização',phone:'(43) 99999-1111',email:'joao@abc.com',segment:'Climatização',notes:'Cliente indicado',createdAt:Date.now()-86400000*2},
    {id:uid(),name:'Maria Santos',company:'Studio MS',phone:'(11) 98888-2222',email:'maria@studioms.com',segment:'Fotografia',notes:'',createdAt:Date.now()-86400000*5},
  ];
}

/* ---------- DEFAULTS ---------- */
function defaultData(company='',client='',segment='',city=''){
  return {
    company,trade:company,slogan:'',
    segment:segment||'Serviços',city:city||'Sua cidade',state:'SP',
    whatsapp:'(00) 00000-0000',phone:'(00) 0000-0000',email:'contato@empresa.com',
    address:'Rua Principal, 123 - Centro',instagram:'@empresa',facebook:'facebook.com/empresa',
    cnpj:'',hours:'Segunda a Sexta — 08:00 às 18:00',
    about:'',
    services:[],
    products:[],
    testimonials:[],
    differentials:[],
    team:[],
    faq:[],
    ctaText:'Fale Conosco',ctaSecondary:'Saiba Mais',whatsappMessage:'Olá, gostaria de saber mais sobre os serviços.',
    ctaPrimary:'Fale Conosco',ctaSecondary:'Saiba Mais',
    primaryColor:'#0f172a',secondaryColor:'#475569',accentColor:'#22c55e',style:'moderno',
    logo:null,images:[],image:null
  };
}

// Aplica o preset de um modelo aos dados do projeto (após defaultData + applyTemplateDefaults)
function applyModelPreset(project, modelId){
  const p = (MODEL_PRESETS && MODEL_PRESETS[modelId]) || {};
  const d = project.data || (project.data = {});
  // Nome sugerido: SEMPRE preenche se o usuário não digitou nada (ou se veio vazio do defaultData)
  if(p.company && !d.company) d.company = p.company;
  if(!d.trade) d.trade = d.company || p.company || '';
  if(p.slogan && !d.slogan) d.slogan = p.slogan;
  if(p.about && !d.about) d.about = p.about;
  if(p.segment) d.segment = p.segment;
  if(p.city && !d.city) d.city = p.city;
  if(p.state && !d.state) d.state = p.state;
  if(p.heroStyle) d.heroStyle = p.heroStyle;
  if(p.image && !d.image) d.image = p.image;
  if(p.services && p.services.length && (!d.services||d.services.length===0)){
    d.services = p.services.map((s,i)=>Object.assign({icon:['⚡','★','✓','◆','●','✦'][i%6]},s));
  }
  if(p.differentials && p.differentials.length && (!d.differentials||d.differentials.length===0)){
    // O editor salva differentials como {title,desc} — converter
    d.differentials = p.differentials.map(x=>({title:x.name,desc:x.desc}));
  }
  if(p.team && p.team.length && (!d.team||d.team.length===0)){
    d.team = p.team;
  }
  if(p.testimonials && p.testimonials.length && (!d.testimonials||d.testimonials.length===0)){
    d.testimonials = p.testimonials;
  }
  if(p.faq && p.faq.length && (!d.faq||d.faq.length===0)){
    d.faq = p.faq;
  }
}

/* ---------- UTILS ---------- */
const $ = (q,p=document)=>p.querySelector(q);
const $$ = (q,p=document)=>[...p.querySelectorAll(q)];
const uid = ()=>Math.random().toString(36).slice(2,9);
const esc = s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtDate = d=>new Date(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
const fmtTime = d=>new Date(d).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});

function toast(msg,type='success'){
  const t=document.createElement('div');
  t.className='toast '+type;
  t.innerHTML=(type==='success'?'✓ ':type==='error'?'✕ ':type==='warn'?'⚠ ':'ℹ ')+msg;
  $('#toasts').appendChild(t);
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300)},3000);
}

/* ---------- NAV ---------- */
function goPage(p){STATE.page=p;render()}
function setPageTitle(t,s=''){$('#pageTitle').textContent=t;$('#pageSubtitle').textContent=s}

function render(){
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===STATE.page));
  const c=$('#content');
  switch(STATE.page){
    case 'dashboard': renderDashboard(c); break;
    case 'clients':   renderClients(c); break;
    case 'models':    renderModels(c); break;
    case 'projects':  renderProjects(c); break;
    case 'media':     renderMedia(c); break;
    case 'components':renderComponents(c); break;
    case 'admin':     renderAdmin(c); break;
    case 'settings':  renderSettings(c); break;
    case 'editor':    renderEditor(c); break;
    default: renderDashboard(c);
  }
  // Após render, ajusta o scale dos mini-sites dentro dos cards
  requestAnimationFrame(()=>fitMiniSites());
}

/* ---------- MINI-SITE SCALE ----------
   Cada card do modelo mostra um site real renderizado em viewport 1280px.
   Esta função aplica o transform: scale para caber no card (~300px de largura).
*/
function fitMiniSites(){
  const REAL_W = 1280;
  const cards = document.querySelectorAll('.model-mini');
  cards.forEach(el=>{
    const card = el.closest('.model-preview');
    if(!card) return;
    const cardWidth = card.clientWidth || 300;
    const scale = cardWidth / REAL_W;
    el.style.transform = `scale(${scale})`;
    // Após scale, o card-preview fica com altura real = altura natural * scale
    // Ajustamos para que apareça o hero inteiro (limitamos a altura do conteúdo real).
  });
}
window.addEventListener('resize', fitMiniSites);

/* ---------- DASHBOARD ---------- */
function renderDashboard(c){
  setPageTitle('Dashboard','Visão geral da sua fábrica de sites');
  const recent=[...STATE.projects].sort((a,b)=>b.createdAt-a.createdAt).slice(0,6);
  const cStats = {
    projects: STATE.projects.length,
    clients: STATE.clients.length,
    media: STATE.media.length,
    ready: STATE.projects.filter(p=>p.status==='ready'||p.status==='done'||p.status==='exported').length,
  };
  c.innerHTML=`
    <div class="hero-section">
      <div>
        <h1>Fábrica de Sites</h1>
        <p>Crie sites completos e funcionais para apresentar durante suas calls. Exporte projetos Next.js ou estáticos com painel administrativo incluso.</p>
      </div>
      <button class="btn btn-primary btn-lg" onclick="startNewProject()">+ Novo Projeto</button>
    </div>
    <div class="demo-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:32px">
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name" style="font-size:24px">${cStats.projects}</div><div class="demo-meta">Projetos criados</div></div></div>
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name" style="font-size:24px">${cStats.clients}</div><div class="demo-meta">Clientes</div></div></div>
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name" style="font-size:24px">${cStats.media}</div><div class="demo-meta">Assets em mídia</div></div></div>
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name" style="font-size:24px">${cStats.ready}</div><div class="demo-meta">Prontos / Exportados</div></div></div>
    </div>
    <div class="section-title">Projetos recentes <small>${STATE.projects.length} no total</small></div>
    <div class="demo-grid">
      ${recent.length===0?'<div class="empty"><div class="ico">▦</div><h3>Nenhum projeto ainda</h3></div>':''}
      ${recent.map(d=>projectCard(d)).join('')}
    </div>
    <div class="section-title" style="margin-top:24px">Modelos em destaque <small>${MODELS.length} disponíveis</small></div>
    <div class="models-grid">${MODELS.slice(0,6).map(m=>modelCard(m)).join('')}</div>
  `;
}

function projectCard(d){
  return `<div class="demo-card" onclick="openProject('${d.id}')">
    <div class="demo-thumb"><div class="demo-thumb-mock"></div></div>
    <div class="demo-body">
      <div class="demo-name">${esc(d.name)}</div>
      <div class="demo-meta">
        <span>${esc(d.company||'—')}</span>·<span>${fmtDate(d.createdAt)}</span>
        <span class="status-pill status-${d.status}">${statusLabel(d.status)}</span>
      </div>
      <div class="demo-actions">
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openProject('${d.id}')">Editar</button>
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();duplicateProject('${d.id}')">Duplicar</button>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();presentProject('${d.id}')">▶ Apresentar</button>
      </div>
    </div>
  </div>`;
}
function statusLabel(s){return{draft:'Rascunho',generating:'Gerando',ready:'Pronto',error:'Erro',exported:'Exportado',archived:'Arquivado'}[s]||s}

/* ---------- MODELS GALLERY ---------- */
function renderModels(c){
  setPageTitle('Modelos','Galeria completa — 28 modelos disponíveis');
  const counts={all:MODELS.length,institucional:MODELS.filter(m=>m.cat==='institucional').length,
    servicos:MODELS.filter(m=>m.cat==='servicos').length,vendas:MODELS.filter(m=>m.cat==='vendas').length,
    profissionais:MODELS.filter(m=>m.cat==='profissionais').length};
  const filtered = STATE.filter==='all'?MODELS:MODELS.filter(m=>m.cat===STATE.filter);
  c.innerHTML=`
    <div class="filter-bar">
      ${CATS.map(cat=>`<div class="filter-chip ${STATE.filter===cat.id?'active':''}" onclick="setFilter('${cat.id}')">${cat.name}<span class="count">${counts[cat.id]||0}</span></div>`).join('')}
    </div>
    <div class="models-grid">${filtered.map(m=>modelCard(m)).join('')}</div>
  `;
}
function setFilter(f){STATE.filter=f;render()}

function modelCard(m){
  const preset = (typeof MODEL_PRESETS!=='undefined' && MODEL_PRESETS[m.id])||{};
  const slogan = preset.slogan||'';
  const about = preset.about||'';
  const seg = preset.segment||'';
  const city = preset.city||'';
  const company = preset.company||m.name;
  // Render real do site com os dados do preset (mini-versão dentro do card)
  const miniHTML = modelMiniSite(m, preset);
  return `<div class="model-card">
    <div class="model-preview" data-layout="${m.mockLayout||'split'}">
      <span class="model-tag">${catName(m.cat)}</span>
      <div class="model-name-large">${m.name}</div>
      <div class="model-mini" data-model="${m.id}">${miniHTML}</div>
      <div class="model-card-actions">
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();previewModel('${m.id}')" title="Ver site em tela cheia">
          👁 Preview
        </button>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();useModel('${m.id}')" title="Abrir este modelo no editor">
          ✏ Editar
        </button>
      </div>
    </div>
    <div class="model-body" onclick="useModel('${m.id}')" style="cursor:pointer">
      <div class="model-name">${m.name}</div>
      <div class="model-desc">${m.desc} · ${esc(seg)}</div>
      ${slogan?`<div class="model-slogan-sm">"${esc(slogan.slice(0,80))}${slogan.length>80?'…':''}"</div>`:''}
    </div>
  </div>`;
}

// Gera um mini-site real (HTML renderizado por SiteGenerator) para mostrar no card.
// Usa os dados do preset: company, slogan, about, services, differentials, heroStyle.
function modelMiniSite(m, preset){
  const tplId = (typeof MODEL_TO_TEMPLATE!=='undefined' && MODEL_TO_TEMPLATE[m.id]) || 'empresa-corporativa';
  const tpl = (typeof TEMPLATES!=='undefined' && TEMPLATES[tplId]) || null;
  const theme = {
    colors:{
      primary:m.primary,
      secondary:m.secondary||m.primary,
      accent:m.accent,
      background:'#ffffff',
      surface:'#f8f8fa',
      text:'#0f172a',
      textMuted:'#64748b',
      border:'#e5e7eb',
    },
    typography:{heading:'Inter, system-ui, sans-serif',body:'Inter, system-ui, sans-serif'},
    radius:'6px', spacing:'6px',
    style:m.style||'moderno',
  };
  const fakeProject = {
    modelId:m.id, templateId:tplId, template:tpl,
    data:{
      company: preset.company || m.name,
      trade: preset.company || m.name,
      slogan: preset.slogan || '',
      segment: preset.segment || '',
      city: preset.city || '',
      state: preset.state || 'SP',
      whatsapp:'(00) 00000-0000',phone:'(00) 0000-0000',email:'contato@empresa.com',
      address:'Rua Principal, 123',instagram:'@empresa',facebook:'facebook.com/empresa',
      cnpj:'',hours:'Seg a Sex — 8h às 18h',
      about: preset.about || '',
      services: (preset.services||[]).slice(0,3),
      products: (preset.products||[]).slice(0,3),
      differentials: (preset.differentials||[]).slice(0,3),
      team: (preset.team||[]).slice(0,2),
      testimonials: (preset.testimonials||[]).slice(0,2),
      faq: (preset.faq||[]).slice(0,2),
      ctaText:'Fale Conosco',ctaSecondary:'Saiba Mais',
      whatsappMessage:'Olá, gostaria de saber mais.',
      primaryColor:m.primary,secondaryColor:m.secondary||m.primary,accentColor:m.accent,
      style:m.style||'moderno',
      logo:null,images:[], image: preset.image || null,
      heroStyle: preset.heroStyle || 'A',
    }
  };
  if(typeof SiteGenerator==='undefined') return '';
  try{
    const home = (tpl && tpl.pages && tpl.pages[0]) || {sections:['header','hero','services','about','differentials','cta','footer']};
    const html = SiteGenerator.renderPageHTML(home, fakeProject, theme, SiteGenerator.buildProjectContent(fakeProject), []);
    const css = SiteGenerator.sharedCSS ? SiteGenerator.sharedCSS(theme) : '';
    return `<style>${css}
/* ===== override card preview — site real dentro de ~300px ===== */
body{margin:0;font-family:Inter,system-ui,sans-serif;background:#fff;color:#222}
.wrap{max-width:1280px;margin:0 auto;padding:0 40px}
section{padding:28px 0}
.alt{background:#f8f8fa}
.site-header{position:relative;background:#fff;padding:10px 0;border-bottom:1px solid #e5e7eb}
.site-header .wrap{display:flex;align-items:center;justify-content:space-between;gap:20px}
.site-header .logo{font-weight:700;font-size:14px;color:var(--primary,#0f172a)}
.site-header .menu{display:flex;gap:14px}
.site-header .menu a{color:#222;text-decoration:none;font-size:11px;font-weight:500}
.site-header .btn{padding:6px 12px;font-size:11px;border-radius:6px;background:var(--primary);color:#fff;text-decoration:none}
.hero{padding:40px 0;color:var(--text)}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:center}
.hero h1{font-size:36px;line-height:1.1;margin:8px 0;font-weight:800;color:var(--text,#0f172a)}
.hero p{font-size:13px;color:var(--text-muted,#64748b);margin:8px 0;line-height:1.55}
.hero-img{aspect-ratio:4/3;border-radius:14px;background:var(--surface,#f8f8fa);border:1px solid var(--border,#e5e7eb);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:80px;font-weight:800;color:var(--primary);margin:0 auto}
.hero-img img{width:100%;height:100%;object-fit:cover;border-radius:14px}
.hero .pill{display:inline-block;background:var(--surface);border:1px solid var(--border);padding:4px 10px;border-radius:99px;font-size:10px;font-weight:600;color:var(--text);letter-spacing:.5px;text-transform:uppercase}
.hero .btn{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.hero .btn.btn-p{background:var(--primary);color:#fff}
.hero .btn.btn-s{background:transparent;color:var(--text);border:1px solid var(--border)}
.hero-cta{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}
.hero-center{text-align:center;max-width:760px;margin:0 auto}
.hero-center .pill-center{display:inline-block;margin-bottom:12px}
.hero-center .lead{font-size:15px}
.hero-mag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px}
.hero-mag-card{background:#fff;border:1px solid var(--border);border-radius:10px;padding:16px;text-align:left}
.hero-mag-icon{width:32px;height:32px;border-radius:8px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:8px}
.hero-svc-grid{display:grid;gap:8px}
.hero-svc-item{background:#fff;border:1px solid var(--border);border-radius:8px;padding:10px 12px;display:flex;gap:10px;align-items:flex-start}
.hero-svc-num{width:22px;height:22px;flex:none;background:var(--accent);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
.hero-svc-item strong{display:block;font-size:12px;margin-bottom:2px;color:var(--text)}
.hero-svc-item p{font-size:11px;color:var(--text-muted);margin:0}
.hero-prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px}
.hero-prop-card{background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden}
.hero-prop-img{height:90px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:var(--primary);overflow:hidden}
.hero-prop-img img{width:100%;height:100%;object-fit:cover}
.hero-prop-card h3{font-size:12px;margin:10px 12px 4px;color:var(--text)}
.hero-prop-card p{font-size:10.5px;color:var(--text-muted);margin:0 12px 12px;line-height:1.4}
.hero-gallery{display:flex;gap:12px;margin-top:24px;justify-content:center;flex-wrap:wrap}
.polaroid{width:90px;height:110px;background:#fff;border:1px solid #ddd;box-shadow:0 4px 12px rgba(0,0,0,.08);border-radius:2px;padding:5px;display:flex;flex-direction:column;gap:2px;transform:rotate(var(--r,-2deg))}
.polaroid.p1{--r:-4deg}.polaroid.p2{--r:2deg}.polaroid.p3{--r:-1deg}.polaroid.p4{--r:3deg}
.polaroid div{flex:1;background:var(--surface);border-radius:1px}
.polaroid span{font-size:8px;color:#666;text-align:center;padding:2px 0}
.product-img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--surface);border-radius:12px;font-size:80px;font-weight:800;color:var(--primary)}
.product-spot{aspect-ratio:1;display:flex}
.sec-head{text-align:center;margin-bottom:18px}
.sec-head h2{font-size:24px;font-weight:700;margin:0 0 4px;color:var(--text)}
.sec-head p{font-size:13px;color:var(--text-muted);margin:0}
.kicker{font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.card{background:#fff;border:1px solid var(--border);border-radius:10px;padding:16px;text-align:left}
.card .ico{width:32px;height:32px;border-radius:8px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:8px}
.card h3{font-size:13px;margin:0 0 4px;color:var(--text)}
.card p{font-size:11px;color:var(--text-muted);margin:0;line-height:1.5}
.about-grid{display:grid;grid-template-columns:280px 1fr;gap:28px;align-items:center}
.about-img{width:200px;height:200px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:60px;font-weight:800;color:var(--primary)}
.lead{font-size:14px;color:var(--text)}
.site-footer{background:var(--primary);color:#fff;padding:28px 0 14px}
.site-footer .logo{font-weight:700;font-size:14px;color:#fff}
.site-footer h4{font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;color:rgba(255,255,255,.7)}
.site-footer p,.site-footer a{font-size:11px;color:rgba(255,255,255,.85);margin:3px 0;text-decoration:none}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:24px;margin-bottom:18px}
.footer-bot{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.65);padding-top:12px;border-top:1px solid rgba(255,255,255,.15)}
.wa-float{position:fixed;bottom:14px;right:14px;width:36px;height:36px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.hero-simple{padding:32px 0;text-align:center}
.hero-simple h1{font-size:32px;font-weight:800;color:var(--text)}
</style>${html}`;
  }catch(e){
    return `<div style="padding:20px;color:#888;font-size:12px">Erro: ${esc(e.message)}</div>`;
  }
}

// 8 layouts SVG distintos para o card preview — cada modelo com mockLayout
function modelMockSVG(m){
  const L = m.mockLayout||'split';
  const p = m.primary, s = m.secondary||m.primary, a = m.accent;
  const initial = (m.name||'?').charAt(0).toUpperCase();

  // 1. SPLIT — clássico: copy à esquerda, bloco visual à direita
  if(L==='split'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <defs><linearGradient id="g${m.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${p}"/><stop offset="100%" stop-color="${s}"/></linearGradient></defs>
      <rect width="320" height="220" fill="url(#g${m.id})"/>
      <rect width="320" height="38" fill="rgba(0,0,0,.3)"/>
      <circle cx="18" cy="19" r="4" fill="${a}"/>
      <rect x="30" y="14" width="48" height="9" rx="2" fill="#fff" opacity=".85"/>
      <g transform="translate(28,80)">
        <rect width="170" height="16" rx="3" fill="#fff"/>
        <rect y="28" width="130" height="6" rx="2" fill="#fff" opacity=".55"/>
        <rect y="42" width="90" height="6" rx="2" fill="#fff" opacity=".4"/>
        <rect y="64" width="62" height="22" rx="4" fill="${a}"/>
      </g>
      <g transform="translate(218,68)">
        <rect width="84" height="100" rx="8" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" stroke-width="1"/>
        <text x="42" y="64" font-size="40" font-weight="800" fill="#fff" text-anchor="middle" opacity=".85">${initial}</text>
      </g>
    </svg>`;
  }

  // 2. CENTERED / CENTERED-LIGHT — copy centralizada, fundo cor sólida ou claro
  if(L==='centered'||L==='centered-light'){
    const dark = L==='centered-light';
    const bg = dark ? '#ffffff' : p;
    const fg = dark ? p : '#fff';
    const muted = dark ? p : s;
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="220" fill="${bg}"/>
      <rect width="320" height="34" fill="${dark?s:'rgba(0,0,0,.25)'}"/>
      <circle cx="18" cy="17" r="4" fill="${a}"/>
      <rect x="30" y="12" width="48" height="9" rx="2" fill="${fg}" opacity=".85"/>
      <g transform="translate(160,128)" text-anchor="middle">
        <text y="-50" font-size="10" font-weight="700" fill="${a}" letter-spacing="2">${esc(m.segment||(m.cat==='institucional'?'INSTITUCIONAL':m.cat==='servicos'?'SERVIÇOS':'PROFISSIONAL'))}</text>
        <rect x="-110" y="-38" width="220" height="18" rx="3" fill="${dark?p:fg}"/>
        <rect x="-90" y="-12" width="180" height="5" rx="2" fill="${muted}" opacity=".55"/>
        <rect x="-70" y="0" width="140" height="5" rx="2" fill="${muted}" opacity=".4"/>
        <rect x="-35" y="22" width="70" height="22" rx="11" fill="${a}"/>
      </g>
    </svg>`;
  }

  // 3. MAGAZINE — header + 3 colunas
  if(L==='magazine'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="118" fill="${p}"/>
      <rect width="320" height="30" fill="rgba(0,0,0,.32)"/>
      <circle cx="18" cy="15" r="4" fill="${a}"/>
      <rect x="30" y="10" width="54" height="9" rx="2" fill="#fff" opacity=".85"/>
      <g transform="translate(20,52)">
        <rect width="160" height="12" rx="2" fill="#fff"/>
        <rect y="22" width="120" height="5" rx="2" fill="#fff" opacity=".55"/>
        <rect y="34" width="80" height="5" rx="2" fill="#fff" opacity=".4"/>
      </g>
      <g transform="translate(220,42)">
        <circle r="22" fill="${a}" opacity=".9"/>
        <text font-size="20" fill="#fff" text-anchor="middle" y="6">★</text>
      </g>
      <g transform="translate(16,134)">
        <rect width="92" height="78" rx="6" fill="${s}"/>
        <rect x="14" y="14" width="22" height="22" rx="4" fill="${a}"/>
        <rect x="14" y="48" width="60" height="5" rx="2" fill="#fff" opacity=".75"/>
        <rect x="14" y="58" width="40" height="4" rx="2" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(114,138)">
        <rect width="92" height="74" rx="6" fill="${s}" opacity=".85"/>
        <rect x="14" y="14" width="22" height="22" rx="4" fill="${a}" opacity=".85"/>
        <rect x="14" y="48" width="60" height="5" rx="2" fill="#fff" opacity=".7"/>
        <rect x="14" y="58" width="36" height="4" rx="2" fill="#fff" opacity=".45"/>
      </g>
      <g transform="translate(212,142)">
        <rect width="92" height="70" rx="6" fill="${s}" opacity=".7"/>
        <rect x="14" y="14" width="22" height="22" rx="4" fill="${a}" opacity=".7"/>
        <rect x="14" y="48" width="60" height="5" rx="2" fill="#fff" opacity=".55"/>
        <rect x="14" y="58" width="32" height="4" rx="2" fill="#fff" opacity=".35"/>
      </g>
    </svg>`;
  }

  // 4. SERVICE-GRID — copy à esquerda, lista compacta à direita
  if(L==='service-grid'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="220" fill="${p}"/>
      <rect width="320" height="30" fill="rgba(0,0,0,.32)"/>
      <circle cx="18" cy="15" r="4" fill="${a}"/>
      <rect x="30" y="10" width="54" height="9" rx="2" fill="#fff" opacity=".85"/>
      <g transform="translate(18,58)">
        <rect width="130" height="12" rx="2" fill="#fff"/>
        <rect y="22" width="100" height="5" rx="2" fill="#fff" opacity=".55"/>
        <rect y="34" width="80" height="5" rx="2" fill="#fff" opacity=".4"/>
      </g>
      <g transform="translate(160,52)">
        <rect width="148" height="38" rx="6" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)"/>
        <circle cx="20" cy="19" r="10" fill="${a}"/>
        <rect x="38" y="13" width="60" height="6" rx="1" fill="#fff"/>
        <rect x="38" y="22" width="84" height="4" rx="1" fill="#fff" opacity=".55"/>
      </g>
      <g transform="translate(160,96)">
        <rect width="148" height="38" rx="6" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)"/>
        <circle cx="20" cy="19" r="10" fill="${a}" opacity=".9"/>
        <rect x="38" y="13" width="56" height="6" rx="1" fill="#fff"/>
        <rect x="38" y="22" width="80" height="4" rx="1" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(160,140)">
        <rect width="148" height="38" rx="6" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)"/>
        <circle cx="20" cy="19" r="10" fill="${a}" opacity=".8"/>
        <rect x="38" y="13" width="64" height="6" rx="1" fill="#fff"/>
        <rect x="38" y="22" width="76" height="4" rx="1" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(18,128)">
        <rect width="130" height="32" rx="16" fill="${a}"/>
      </g>
    </svg>`;
  }

  // 5. PROPERTY — header + 3 cards de imóveis
  if(L==='property'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="98" fill="${p}"/>
      <rect width="320" height="28" fill="rgba(0,0,0,.32)"/>
      <circle cx="18" cy="14" r="4" fill="${a}"/>
      <rect x="30" y="9" width="54" height="9" rx="2" fill="#fff" opacity=".85"/>
      <g transform="translate(20,48)">
        <rect width="180" height="13" rx="2" fill="#fff"/>
        <rect y="22" width="130" height="5" rx="2" fill="#fff" opacity=".55"/>
      </g>
      <g transform="translate(232,40)">
        <rect width="68" height="22" rx="11" fill="${a}"/>
      </g>
      <g transform="translate(16,116)">
        <rect width="92" height="94" rx="6" fill="${s}"/>
        <rect width="92" height="58" rx="6" fill="rgba(255,255,255,.15)"/>
        <text x="46" y="38" font-size="22" font-weight="800" fill="#fff" text-anchor="middle" opacity=".85">${initial}</text>
        <rect x="10" y="70" width="60" height="5" rx="2" fill="#fff" opacity=".8"/>
        <rect x="10" y="80" width="40" height="4" rx="2" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(114,118)">
        <rect width="92" height="92" rx="6" fill="${s}" opacity=".88"/>
        <rect width="92" height="56" rx="6" fill="rgba(255,255,255,.13)"/>
        <text x="46" y="36" font-size="20" font-weight="800" fill="#fff" text-anchor="middle" opacity=".7">${initial}</text>
        <rect x="10" y="68" width="56" height="5" rx="2" fill="#fff" opacity=".7"/>
        <rect x="10" y="78" width="36" height="4" rx="2" fill="#fff" opacity=".4"/>
      </g>
      <g transform="translate(212,120)">
        <rect width="92" height="90" rx="6" fill="${s}" opacity=".75"/>
        <rect width="92" height="54" rx="6" fill="rgba(255,255,255,.1)"/>
        <rect x="10" y="66" width="60" height="5" rx="2" fill="#fff" opacity=".55"/>
        <rect x="10" y="76" width="40" height="4" rx="2" fill="#fff" opacity=".35"/>
      </g>
    </svg>`;
  }

  // 6. PRODUCT — copy à esquerda, produto/placeholder à direita
  if(L==='product'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="220" fill="${p}"/>
      <rect width="320" height="28" fill="rgba(0,0,0,.32)"/>
      <circle cx="18" cy="14" r="4" fill="${a}"/>
      <rect x="30" y="9" width="54" height="9" rx="2" fill="#fff" opacity=".85"/>
      <g transform="translate(20,62)">
        <rect width="160" height="13" rx="2" fill="#fff"/>
        <rect y="22" width="120" height="5" rx="2" fill="#fff" opacity=".55"/>
        <rect y="34" width="90" height="5" rx="2" fill="#fff" opacity=".4"/>
      </g>
      <g transform="translate(20,118)">
        <rect width="86" height="24" rx="4" fill="${a}"/>
      </g>
      <g transform="translate(116,118)">
        <rect width="62" height="24" rx="12" fill="none" stroke="#fff" stroke-width="1.4"/>
      </g>
      <g transform="translate(200,40)">
        <rect width="104" height="160" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)"/>
        <circle cx="52" cy="62" r="20" fill="${a}" opacity=".85"/>
        <rect x="22" y="92" width="64" height="6" rx="2" fill="#fff" opacity=".7"/>
        <rect x="32" y="104" width="44" height="4" rx="2" fill="#fff" opacity=".5"/>
        <rect x="32" y="120" width="40" height="4" rx="2" fill="#fff" opacity=".4"/>
      </g>
    </svg>`;
  }

  // 7. GALLERY — polaroids para fotógrafo
  if(L==='gallery'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="220" fill="#0a0a0a"/>
      <rect width="320" height="28" fill="rgba(255,255,255,.06)"/>
      <circle cx="18" cy="14" r="4" fill="${a}"/>
      <rect x="30" y="9" width="54" height="9" rx="2" fill="#fff" opacity=".85"/>
      <text x="20" y="62" font-size="17" font-weight="800" fill="#fff">${esc(m.name)}</text>
      <rect x="20" y="72" width="100" height="5" rx="2" fill="${a}"/>
      <g font-family="Inter" font-size="6" fill="#666">
        <g transform="rotate(-4 40 160) translate(8,124)">
          <rect width="62" height="70" fill="#fff"/>
          <rect x="4" y="4" width="54" height="52" fill="${s}"/>
          <text x="31" y="64" text-anchor="middle">ensaio</text>
        </g>
        <g transform="rotate(2 130 160) translate(94,118)">
          <rect width="62" height="70" fill="#fff"/>
          <rect x="4" y="4" width="54" height="52" fill="${s}" opacity=".85"/>
          <text x="31" y="64" text-anchor="middle">casamento</text>
        </g>
        <g transform="rotate(-1 200 160) translate(170,124)">
          <rect width="62" height="70" fill="#fff"/>
          <rect x="4" y="4" width="54" height="52" fill="${s}" opacity=".7"/>
          <text x="31" y="64" text-anchor="middle">marca</text>
        </g>
        <g transform="rotate(3 270 160) translate(248,120)">
          <rect width="62" height="70" fill="#fff"/>
          <rect x="4" y="4" width="54" height="52" fill="${s}" opacity=".55"/>
          <text x="31" y="64" text-anchor="middle">evento</text>
        </g>
      </g>
    </svg>`;
  }

  // 8. MENU — cardápio para restaurante
  if(L==='menu'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="220" fill="${p}"/>
      <rect width="320" height="34" fill="rgba(0,0,0,.3)"/>
      <circle cx="18" cy="17" r="4" fill="${a}"/>
      <rect x="30" y="12" width="54" height="9" rx="2" fill="#fff" opacity=".85"/>
      <text x="160" y="76" font-size="20" font-weight="800" fill="#fff" text-anchor="middle" font-family="Georgia,serif">${esc(m.name)}</text>
      <text x="160" y="94" font-size="9" fill="${a}" text-anchor="middle">★ ★ ★</text>
      <g font-family="Georgia,serif" font-size="9" fill="rgba(255,255,255,.92)">
        <line x1="30" y1="120" x2="290" y2="120" stroke="rgba(255,255,255,.4)" stroke-width="0.5"/>
        <text x="32" y="114" font-weight="700">Entrada</text>
        <line x1="30" y1="146" x2="290" y2="146" stroke="rgba(255,255,255,.4)" stroke-width="0.5"/>
        <text x="32" y="140" font-weight="700">Principal</text>
        <line x1="30" y1="172" x2="290" y2="172" stroke="rgba(255,255,255,.4)" stroke-width="0.5"/>
        <text x="32" y="166" font-weight="700">Sobremesa</text>
        <line x1="30" y1="198" x2="290" y2="198" stroke="rgba(255,255,255,.4)" stroke-width="0.5"/>
        <text x="32" y="192" font-weight="700">Bebidas</text>
      </g>
    </svg>`;
  }

  // 9. SPLIT-BOLD — oferta com botão grande
  if(L==='split-bold'){
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" class="mock-svg">
      <rect width="320" height="220" fill="${p}"/>
      <rect width="320" height="36" fill="${s}"/>
      <circle cx="18" cy="18" r="5" fill="${a}"/>
      <rect x="32" y="14" width="58" height="9" rx="2" fill="#fff" opacity=".9"/>
      <rect x="220" y="14" width="80" height="9" rx="4" fill="${a}"/>
      <g transform="translate(20,72)">
        <rect width="180" height="14" rx="3" fill="#fff"/>
        <rect y="24" width="140" height="6" rx="2" fill="#fff" opacity=".55"/>
        <rect y="38" width="110" height="6" rx="2" fill="#fff" opacity=".4"/>
      </g>
      <g transform="translate(20,128)">
        <rect width="92" height="28" rx="14" fill="${a}"/>
        <text x="46" y="18" font-size="11" font-weight="800" fill="${p}" text-anchor="middle">GARANTIR</text>
      </g>
      <g transform="translate(120,128)">
        <rect width="48" height="28" rx="14" fill="none" stroke="#fff" stroke-width="1.6"/>
        <text x="24" y="18" font-size="9" fill="#fff" text-anchor="middle">info</text>
      </g>
      <g transform="translate(218,72)">
        <rect width="86" height="84" rx="10" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.32)" stroke-width="1"/>
        <text x="43" y="56" font-size="40" font-weight="800" fill="${a}" text-anchor="middle">!</text>
      </g>
    </svg>`;
  }

  // fallback split
  return modelMockSVG(Object.assign({},m,{mockLayout:'split'}));
}

/* ---------- PROJECTS ---------- */
function renderProjects(c){
  setPageTitle('Projetos','Todos os projetos');
  c.innerHTML=`
    <div class="section-title">Todos os projetos <small>${STATE.projects.length}</small></div>
    <div class="demo-grid">
      ${STATE.projects.length===0?'<div class="empty"><div class="ico">▦</div><h3>Nenhum projeto</h3></div>':''}
      ${STATE.projects.map(d=>projectCard(d)).join('')}
    </div>
  `;
}

/* ---------- CLIENTS ---------- */
function renderClients(c){
  setPageTitle('Clientes','Sua base');
  c.innerHTML=`
    <div class="hero-section">
      <div><h1 style="font-size:22px">Clientes</h1><p>Gerencie sua base de clientes.</p></div>
      <button class="btn btn-primary" onclick="addClient()">+ Novo Cliente</button>
    </div>
    <div class="demo-grid">
      ${STATE.clients.map(cl=>`
        <div class="demo-card">
          <div class="demo-thumb" style="background:linear-gradient(135deg,#7c5cff,#5b8bff);color:#fff;font-size:36px;font-weight:700">${esc(cl.name.charAt(0).toUpperCase())}</div>
          <div class="demo-body">
            <div class="demo-name">${esc(cl.name)}</div>
            <div class="demo-meta">${esc(cl.company)} · ${esc(cl.segment||'—')}</div>
            <div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">${cl.phone||''}<br>${cl.email||''}</div>
            <div class="demo-actions">
              <button class="btn btn-secondary btn-sm" onclick="startProjectForClient('${cl.id}')">Novo projeto</button>
              <button class="btn btn-primary btn-sm" onclick="editClient('${cl.id}')">Editar</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
function addClient(){
  showModal('Novo cliente',`
    <div class="field"><label>Nome</label><input id="cName"></div>
    <div class="field"><label>Empresa</label><input id="cCompany"></div>
    <div class="field-row">
      <div class="field"><label>Telefone</label><input id="cPhone"></div>
      <div class="field"><label>Segmento</label><input id="cSegment"></div>
    </div>
    <div class="field"><label>E-mail</label><input id="cEmail"></div>
    <div class="field"><label>Observações</label><textarea id="cNotes"></textarea></div>
  `,[
    {label:'Cancelar',cls:'btn-secondary',action:closeModal},
    {label:'Salvar',cls:'btn-primary',action:()=>{
      const cl={id:uid(),name:$('#cName').value,company:$('#cCompany').value,phone:$('#cPhone').value,email:$('#cEmail').value,segment:$('#cSegment').value,notes:$('#cNotes').value,createdAt:Date.now()};
      if(!cl.name){toast('Nome obrigatório','error');return}
      STATE.clients.push(cl);saveState();closeModal();toast('Cliente adicionado');render();
    }}
  ]);
}
function editClient(id){
  const cl=STATE.clients.find(x=>x.id===id);if(!cl)return;
  showModal('Editar cliente',`
    <div class="field"><label>Nome</label><input id="cName" value="${esc(cl.name)}"></div>
    <div class="field"><label>Empresa</label><input id="cCompany" value="${esc(cl.company)}"></div>
    <div class="field-row">
      <div class="field"><label>Telefone</label><input id="cPhone" value="${esc(cl.phone)}"></div>
      <div class="field"><label>Segmento</label><input id="cSegment" value="${esc(cl.segment)}"></div>
    </div>
    <div class="field"><label>E-mail</label><input id="cEmail" value="${esc(cl.email)}"></div>
    <div class="field"><label>Observações</label><textarea id="cNotes">${esc(cl.notes||'')}</textarea></div>
  `,[
    {label:'Excluir',cls:'btn-danger',action:()=>{STATE.clients=STATE.clients.filter(x=>x.id!==id);saveState();closeModal();render();toast('Cliente excluído')}},
    {label:'Cancelar',cls:'btn-secondary',action:closeModal},
    {label:'Salvar',cls:'btn-primary',action:()=>{
      Object.assign(cl,{name:$('#cName').value,company:$('#cCompany').value,phone:$('#cPhone').value,email:$('#cEmail').value,segment:$('#cSegment').value,notes:$('#cNotes').value});
      saveState();closeModal();render();toast('Cliente atualizado');
    }}
  ]);
}

/* ---------- MEDIA LIBRARY ---------- */
function renderMedia(c){
  setPageTitle('Mídia','Biblioteca de imagens e assets');
  c.innerHTML=`
    <div class="hero-section">
      <div><h1 style="font-size:22px">Mídia</h1><p>Imagens do projeto, logos e assets externos.</p></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" onclick="document.getElementById('mediaUpload').click()">+ Upload</button>
        <input id="mediaUpload" type="file" accept="image/*" multiple style="display:none" onchange="uploadMedia(event)">
        <button class="btn btn-primary" onclick="openAddReference()">+ URL de referência</button>
      </div>
    </div>
    ${STATE.references.length?`
      <div class="section-title">Referências externas <small>${STATE.references.length}</small></div>
      <div style="margin-bottom:24px">
        ${STATE.references.map((r,i)=>`
          <div class="reference-item">
            <div class="reference-thumb">${r.thumb?`<img src="${r.thumb}">`:'🌐'}</div>
            <div class="reference-info">
              <div class="reference-name">${esc(r.name||r.url)}</div>
              <div class="reference-url">${esc(r.url)}</div>
            </div>
            <div class="reference-actions">
              <span class="tag tag-reference">Referência</span>
              <button class="btn btn-ghost btn-sm" onclick="removeReference(${i})">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `:''}
    <div class="section-title">Biblioteca <small>${STATE.media.length} itens</small></div>
    <div class="media-grid">
      ${STATE.media.length===0?'<div class="empty" style="grid-column:1/-1"><div class="ico">▣</div><h3>Biblioteca vazia</h3><p>Faça upload de imagens ou use referências externas</p></div>':''}
      ${STATE.media.map((m,i)=>`
        <div class="media-item" onclick="insertMedia('${m.id}')">
          <img src="${m.data}">
          ${m.replaceBeforePublish?'<div class="replace-tag">Substituir</div>':''}
          <div class="meta">
            <div class="name">${esc(m.name)}</div>
            <div class="origin ${m.origin==='external'?'external':''}">
              <span class="tag tag-${m.origin==='upload'?'upload':m.origin==='ai'?'ai':'external'}">${m.origin==='upload'?'Upload':m.origin==='ai'?'IA':'Externa'}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
function uploadMedia(e){
  Array.from(e.target.files).forEach(f=>{
    const r=new FileReader();
    r.onload=ev=>{
      STATE.media.push({id:uid(),name:f.name,data:ev.target.result,origin:'upload',replaceBeforePublish:false,createdAt:Date.now()});
      saveState();render();
      toast('Imagem adicionada à biblioteca');
    };
    r.readAsDataURL(f);
  });
}
function openAddReference(){
  showModal('Adicionar referência externa',`
    <div class="field"><label>Nome (opcional)</label><input id="refName" placeholder="Ex: Site do concorrente"></div>
    <div class="field"><label>URL</label><input id="refUrl" placeholder="https://exemplo.com"></div>
    <p style="font-size:12px;color:var(--text-3);margin-top:8px;line-height:1.5">A página será analisada para extrair cores, textos e estrutura como referência visual. Não copiamos conteúdo protegido.</p>
  `,[
    {label:'Cancelar',cls:'btn-secondary',action:closeModal},
    {label:'Adicionar',cls:'btn-primary',action:async()=>{
      const url=$('#refUrl').value.trim();
      if(!url){toast('URL obrigatória','error');return}
      closeModal();
      toast('Analisando referência...','warn');
      try{
        // Tenta extrair domínio como thumb
        const u=new URL(url);
        const thumb=`https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
        // Tenta fetch com proxy (pode falhar por CORS)
        let analysis=null;
        try{
          const r=await fetch('https://api.allorigins.win/raw?url='+encodeURIComponent(url));
          if(r.ok){
            const html=await r.text();
            const titleMatch=html.match(/<title>([^<]+)<\/title>/);
            const descMatch=html.match(/<meta name="description" content="([^"]+)"/);
            const colorMatches=html.match(/#[0-9a-fA-F]{6}/g)||[];
            const colors=[...new Set(colorMatches)].slice(0,6);
            const imgMatches=html.match(/<img[^>]+src=["']([^"']+)["']/g)||[];
            analysis={title:titleMatch?titleMatch[1]:'',desc:descMatch?descMatch[1]:'',colors,images:imgMatches.length};
            toast('Referência analisada: '+analysis.title.slice(0,40));
          }
        }catch(e){
          toast('Referência adicionada (sem análise por CORS)','warn');
        }
        STATE.references.push({id:uid(),url,name:$('#refName').value||url,thumb,analysis,createdAt:Date.now()});
        saveState();render();
      }catch(e){toast('URL inválida','error')}
    }}
  ]);
}
function removeReference(i){STATE.references.splice(i,1);saveState();render()}
function insertMedia(id){
  const m=STATE.media.find(x=>x.id===id);if(!m)return;
  if(STATE.currentProject){
    STATE.currentProject.data.images.push(m.data);
    saveCurrent();render();toast('Imagem inserida no projeto');
  } else toast('Abra um projeto para usar esta imagem','warn');
}

/* ---------- EDITOR ---------- */
function renderEditor(c){
  const proj = STATE.currentProject;
  setPageTitle('Editor', proj.data.company?`Projeto · ${proj.data.company}`:'Novo projeto');
  if(!proj){startNewProject();return}
  const modelName = (MODELS.find(m=>m.id===proj.modelId)||{}).name || 'Personalizado';
  const modelColor = (MODELS.find(m=>m.id===proj.modelId)||{}).primary || '#7c5cff';
  c.innerHTML=`
    <div class="flow-steps">
      <div class="step done"><div class="step-num">✓</div>Modelo</div>
      <div class="step-sep"></div>
      <div class="step ${STATE.editorStep==='info'?'active':''}"><div class="step-num">1</div>Informações</div>
      <div class="step-sep"></div>
      <div class="step ${STATE.editorStep==='visual'?'active':''}"><div class="step-num">2</div>Identidade Visual</div>
      <div class="step-sep"></div>
      <div class="step ${STATE.editorStep==='content'?'active':''}"><div class="step-num">3</div>Conteúdo</div>
      <div class="step-sep"></div>
      <div class="step ${STATE.editorStep==='pages'?'active':''}"><div class="step-num">4</div>Páginas</div>
      <div class="step-sep"></div>
      <div class="step"><div class="step-num">5</div>Gerar</div>
    </div>
    <div class="editor">
      <div class="editor-panel" id="editorPanel">${editorPanelHTML()}</div>
      <div class="editor-canvas">
        <div class="canvas-toolbar">
          <div class="canvas-toolbar-left">
            <span class="model-pill" style="--mc:${modelColor}">
              <span class="dot"></span>${esc(modelName)}
            </span>
            <span class="page-pill">${(TEMPLATES[proj.templateId]||{}).pages?.length || 0} páginas</span>
            <span class="status-dot ${proj.status||'draft'}"></span>
          </div>
          <div class="device-bar">
            <div class="device-btn ${STATE.device==='desktop'?'active':''}" onclick="setEditorDevice('desktop')">🖥</div>
            <div class="device-btn ${STATE.device==='tablet'?'active':''}" onclick="setEditorDevice('tablet')">▭</div>
            <div class="device-btn ${STATE.device==='mobile'?'active':''}" onclick="setEditorDevice('mobile')">▯</div>
          </div>
          <div class="canvas-toolbar-right">
            <button class="btn btn-ghost btn-sm" onclick="saveCurrent()">💾</button>
            <button class="btn btn-ghost btn-sm" onclick="undoVersion()">↶</button>
            <button class="btn btn-ghost btn-sm" onclick="redoVersion()">↷</button>
            <button class="btn btn-secondary btn-sm" onclick="presentProject('${proj.id}')" title="Preview em tela cheia">👁 Preview</button>
            <button class="btn btn-primary btn-sm" onclick="openExport()">⤓ Exportar</button>
          </div>
        </div>
        <div class="canvas-frame ${STATE.device}" id="canvasFrame">${renderPreview()}</div>
        <div class="canvas-bottom">
          <div class="canvas-hint">Edite ao lado · preview atualiza em tempo real</div>
          <button class="btn btn-primary" onclick="generateProject()">✦ GERAR PROJETO COMPLETO</button>
        </div>
      </div>
    </div>
  `;
}

function setEditorDevice(d){
  STATE.device=d;
  $$('.device-btn').forEach(b=>b.classList.toggle('active',b.dataset.device===d||b.dataset.device===undefined&&b.textContent.toLowerCase().includes(d==='desktop'?'desktop':d==='tablet'?'tablet':'mobile')));
  const f=$('#canvasFrame');if(f)f.className='canvas-frame '+d;
}

function editorPanelHTML(){
  const d=STATE.currentProject.data;
  return `
    <div class="editor-tabs">
      <div class="editor-tab ${STATE.editorStep==='info'?'active':''}" onclick="setEditorStep('info')">Info</div>
      <div class="editor-tab ${STATE.editorStep==='visual'?'active':''}" onclick="setEditorStep('visual')">Visual</div>
      <div class="editor-tab ${STATE.editorStep==='content'?'active':''}" onclick="setEditorStep('content')">Conteúdo</div>
      <div class="editor-tab ${STATE.editorStep==='pages'?'active':''}" onclick="setEditorStep('pages')">Páginas</div>
    </div>
    ${STATE.editorStep==='info'?editorInfoTab(d):''}
    ${STATE.editorStep==='visual'?editorVisualTab(d):''}
    ${STATE.editorStep==='content'?editorContentTab(d):''}
    ${STATE.editorStep==='pages'?editorPagesTab():''}
    <div class="form-section" style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px">
      <h3>Edição com IA</h3>
      <div class="ai-prompt-box">
        <textarea id="aiPrompt" placeholder="Ex: 'Deixe mais sofisticado', 'Adicione FAQ', 'Coloque o WhatsApp em destaque'"></textarea>
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:8px" onclick="applyAI()">✦ Aplicar Alteração</button>
    </div>
  `;
}
function setEditorStep(s){STATE.editorStep=s;render()}

function editorInfoTab(d){
  return `
    <div class="form-section">
      <h3>Empresa</h3>
      <div class="field"><label>Nome da empresa <span style="color:var(--danger)">*</span></label><input value="${esc(d.company)}" oninput="updField('company',this.value)"></div>
      <div class="field"><label>Nome comercial</label><input value="${esc(d.trade)}" oninput="updField('trade',this.value)"></div>
      <div class="field"><label>Slogan</label><input value="${esc(d.slogan)}" oninput="updField('slogan',this.value)"></div>
      <div class="field-row">
        <div class="field"><label>Segmento</label><input value="${esc(d.segment)}" oninput="updField('segment',this.value)"></div>
        <div class="field"><label>Cidade</label><input value="${esc(d.city)}" oninput="updField('city',this.value)"></div>
      </div>
      <div class="field"><label>Estado</label><input value="${esc(d.state)}" oninput="updField('state',this.value)"></div>
      <div class="field"><label>CNPJ</label><input value="${esc(d.cnpj)}" oninput="updField('cnpj',this.value)"></div>
    </div>
    <div class="form-section">
      <h3>Imagem de capa</h3>
      <p style="font-size:11.5px;color:var(--text-3);margin-bottom:8px;line-height:1.5">Esta imagem aparece no hero e na seção "Sobre" do site gerado. Use uma foto horizontal do seu negócio.</p>
      <div class="upload-zone" onclick="document.getElementById('heroImgInput').click()">
        ${d.image?`<div class="img-thumb" style="margin:0 auto;max-width:240px"><img src="${esc(d.image)}"><div class="x" onclick="event.stopPropagation();updField('image',null);render()">✕</div></div>`:`<div class="upload-icon">⬆</div><div class="upload-text">Enviar imagem do hero</div><div class="upload-hint">JPG ou PNG · proporção horizontal</div>`}
        <input id="heroImgInput" type="file" accept="image/*" style="display:none" onchange="uploadHeroImage(event)">
      </div>
      <div class="field" style="margin-top:8px"><label>Ou cole uma URL</label><input value="${esc(d.image||'')}" placeholder="https://..." oninput="updField('image',this.value||null)"></div>
    </div>
    <div class="form-section">
      <h3>Contato</h3>
      <div class="field"><label>WhatsApp <span style="color:var(--danger)">*</span></label><input value="${esc(d.whatsapp)}" oninput="updField('whatsapp',this.value)"></div>
      <div class="field"><label>Telefone</label><input value="${esc(d.phone)}" oninput="updField('phone',this.value)"></div>
      <div class="field"><label>E-mail</label><input value="${esc(d.email)}" oninput="updField('email',this.value)"></div>
      <div class="field"><label>Endereço</label><input value="${esc(d.address)}" oninput="updField('address',this.value)"></div>
      <div class="field"><label>Horário de atendimento</label><input value="${esc(d.hours)}" oninput="updField('hours',this.value)"></div>
      <div class="field-row">
        <div class="field"><label>Instagram</label><input value="${esc(d.instagram)}" oninput="updField('instagram',this.value)"></div>
        <div class="field"><label>Facebook</label><input value="${esc(d.facebook)}" oninput="updField('facebook',this.value)"></div>
      </div>
    </div>
    <div class="form-section">
      <h3>Sobre a empresa</h3>
      <div class="field"><textarea oninput="updField('about',this.value)" rows="4">${esc(d.about)}</textarea></div>
    </div>
    <div class="form-section">
      <h3>Logo</h3>
      <div class="upload-zone" onclick="this.querySelector('input').click()">
        <div class="upload-icon">⬆</div>
        <div class="upload-text">Enviar logo</div>
        <div class="upload-hint">PNG, JPG ou SVG</div>
        <input type="file" accept="image/*" onchange="uploadLogo(event)">
      </div>
      ${d.logo?`<div class="img-preview"><div class="img-thumb"><img src="${d.logo}"><div class="x" onclick="removeLogo()">✕</div></div></div>`:''}
    </div>
  `;
}

function uploadHeroImage(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{STATE.currentProject.data.image=ev.target.result;render();toast('Imagem do hero atualizada')};
  r.readAsDataURL(f);
}

function editorVisualTab(d){
  return `
    <div class="form-section">
      <h3>Estilo</h3>
      <div class="style-grid">
        ${['moderno','minimalista','elegante','premium','corporativo','criativo','impactante','popular'].map(s=>`<div class="style-chip ${d.style===s?'active':''}" onclick="setStyle('${s}')">${s.charAt(0).toUpperCase()+s.slice(1)}</div>`).join('')}
      </div>
    </div>
    <div class="form-section">
      <h3>Cores</h3>
      <div class="color-row"><input value="${d.primaryColor}" oninput="updField('primaryColor',this.value)"><input type="color" value="${d.primaryColor}" oninput="updField('primaryColor',this.value)"></div>
      <div class="color-row"><input value="${d.secondaryColor}" oninput="updField('secondaryColor',this.value)"><input type="color" value="${d.secondaryColor}" oninput="updField('secondaryColor',this.value)"></div>
      <div class="color-row"><input value="${d.accentColor}" oninput="updField('accentColor',this.value)"><input type="color" value="${d.accentColor}" oninput="updField('accentColor',this.value)"></div>
      <button class="btn btn-secondary btn-block" style="margin-top:8px" onclick="autoSuggestColors()">✦ Escolher automaticamente</button>
    </div>
  `;
}

function editorContentTab(d){
  return `
    <div class="form-section">
      <h3>Serviços <button class="btn btn-sm btn-ghost" onclick="addService()">+</button></h3>
      ${(d.services||[]).map((s,i)=>`
        <div class="repeater">
          <div class="repeater-head"><div class="repeater-title">${esc(s.name)}</div><div class="x" onclick="removeService(${i})">✕</div></div>
          <div class="field"><label>Nome</label><input value="${esc(s.name)}" oninput="updService(${i},'name',this.value)"></div>
          <div class="field"><label>Descrição</label><textarea oninput="updService(${i},'desc',this.value)">${esc(s.desc)}</textarea></div>
          <div class="field"><label>Ícone</label><input value="${esc(s.icon)}" oninput="updService(${i},'icon',this.value)"></div>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addService()">+ Adicionar serviço</button>
    </div>
    <div class="form-section">
      <h3>Produtos <button class="btn btn-sm btn-ghost" onclick="addProduct()">+</button></h3>
      ${(d.products||[]).map((s,i)=>`
        <div class="repeater">
          <div class="repeater-head"><div class="repeater-title">${esc(s.name)}</div><div class="x" onclick="removeProduct(${i})">✕</div></div>
          <div class="field"><label>Nome</label><input value="${esc(s.name)}" oninput="updProduct(${i},'name',this.value)"></div>
          <div class="field"><label>Descrição</label><textarea oninput="updProduct(${i},'desc',this.value)">${esc(s.desc)}</textarea></div>
          <div class="field"><label>Preço (opcional)</label><input value="${esc(s.price||'')}" oninput="updProduct(${i},'price',this.value)"></div>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addProduct()">+ Adicionar produto</button>
    </div>
    <div class="form-section">
      <h3>Diferenciais</h3>
      ${(d.differentials||[]).map((s,i)=>`
        <div class="repeater">
          <div class="repeater-head"><div class="repeater-title">${esc(s.title)}</div><div class="x" onclick="removeDifferential(${i})">✕</div></div>
          <div class="field"><label>Título</label><input value="${esc(s.title)}" oninput="updDifferential(${i},'title',this.value)"></div>
          <div class="field"><label>Descrição</label><textarea oninput="updDifferential(${i},'desc',this.value)">${esc(s.desc)}</textarea></div>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addDifferential()">+ Adicionar</button>
    </div>
    <div class="form-section">
      <h3>Equipe <button class="btn btn-sm btn-ghost" onclick="addTeam()">+</button></h3>
      ${(d.team||[]).map((s,i)=>`
        <div class="repeater">
          <div class="repeater-head"><div class="repeater-title">${esc(s.name)}</div><div class="x" onclick="removeTeam(${i})">✕</div></div>
          <div class="field"><label>Nome</label><input value="${esc(s.name)}" oninput="updTeam(${i},'name',this.value)"></div>
          <div class="field"><label>Cargo</label><input value="${esc(s.role||'')}" oninput="updTeam(${i},'role',this.value)"></div>
          <div class="field"><label>Bio</label><textarea oninput="updTeam(${i},'bio',this.value)">${esc(s.bio||'')}</textarea></div>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addTeam()">+ Adicionar membro</button>
    </div>
    <div class="form-section">
      <h3>FAQ <button class="btn btn-sm btn-ghost" onclick="addFAQ()">+</button></h3>
      ${(d.faq||[]).map((s,i)=>`
        <div class="repeater">
          <div class="repeater-head"><div class="repeater-title">${esc(s.q).slice(0,30)}</div><div class="x" onclick="removeFAQ(${i})">✕</div></div>
          <div class="field"><label>Pergunta</label><input value="${esc(s.q)}" oninput="updFAQ(${i},'q',this.value)"></div>
          <div class="field"><label>Resposta</label><textarea oninput="updFAQ(${i},'a',this.value)">${esc(s.a)}</textarea></div>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addFAQ()">+ Adicionar FAQ</button>
    </div>
    <div class="form-section">
      <h3>Depoimentos <small style="color:var(--text-3);font-weight:400;text-transform:none;letter-spacing:0">Adicione manualmente</small></h3>
      ${(d.testimonials||[]).map((s,i)=>`
        <div class="repeater">
          <div class="repeater-head"><div class="repeater-title">${esc(s.name||'Depoimento')}</div><div class="x" onclick="removeTestimonial(${i})">✕</div></div>
          <div class="field"><label>Nome</label><input value="${esc(s.name)}" oninput="updTestimonial(${i},'name',this.value)"></div>
          <div class="field"><label>Cargo (opcional)</label><input value="${esc(s.role||'')}" oninput="updTestimonial(${i},'role',this.value)"></div>
          <div class="field"><label>Depoimento</label><textarea oninput="updTestimonial(${i},'text',this.value)">${esc(s.text)}</textarea></div>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addTestimonial()">+ Adicionar</button>
    </div>
    <div class="form-section">
      <h3>Imagens <small style="color:var(--text-3);font-weight:400;text-transform:uppercase">${(d.images||[]).length}/10</small></h3>
      <div class="upload-zone" onclick="this.querySelector('input').click()">
        <div class="upload-icon">⬆</div>
        <div class="upload-text">Adicionar imagens</div>
        <div class="upload-hint">As imagens vão para o projeto</div>
        <input type="file" accept="image/*" multiple onchange="uploadProjectImage(event)">
      </div>
      <div class="img-preview">
        ${(d.images||[]).map((img,i)=>`<div class="img-thumb"><img src="${img}"><div class="x" onclick="removeProjectImage(${i})">✕</div></div>`).join('')}
      </div>
    </div>
    <div class="form-section">
      <h3>CTA / Conversão</h3>
      <div class="field"><label>Texto do botão principal</label><input value="${esc(d.ctaText)}" oninput="updField('ctaText',this.value)"></div>
      <div class="field"><label>Texto secundário</label><input value="${esc(d.ctaSecondary)}" oninput="updField('ctaSecondary',this.value)"></div>
      <div class="field"><label>Mensagem WhatsApp</label><input value="${esc(d.whatsappMessage)}" oninput="updField('whatsappMessage',this.value)"></div>
    </div>
  `;
}

function editorPagesTab(){
  const tpl=TEMPLATES[STATE.currentProject.templateId]||TEMPLATES['empresa-corporativa'];
  return `
    <div class="form-section">
      <h3>Estrutura do site</h3>
      <p style="font-size:12px;color:var(--text-3);margin-bottom:12px">Template: <strong>${esc(tpl.name)}</strong> · ${tpl.pages.length} páginas geradas</p>
      <div style="display:grid;gap:6px">
        ${tpl.pages.map(p=>`
          <div style="padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:7px;display:flex;align-items:center;gap:10px">
            <span style="font-family:monospace;font-size:12px;color:var(--text-3);min-width:160px">${esc(p.slug)}</span>
            <span style="font-weight:500;font-size:13px;flex:1">${esc(p.name)}</span>
            <span style="font-size:11px;color:var(--text-3)">${p.sections.length} seções</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ---------- FIELD UPDATES ---------- */
function updField(k,v){STATE.currentProject.data[k]=v;refreshCanvas()}
function updService(i,k,v){STATE.currentProject.data.services[i][k]=v;refreshCanvas()}
function updProduct(i,k,v){STATE.currentProject.data.products[i][k]=v;refreshCanvas()}
function updDifferential(i,k,v){STATE.currentProject.data.differentials[i][k]=v;refreshCanvas()}
function updTeam(i,k,v){STATE.currentProject.data.team[i][k]=v;refreshCanvas()}
function updFAQ(i,k,v){STATE.currentProject.data.faq[i][k]=v;refreshCanvas()}
function updTestimonial(i,k,v){STATE.currentProject.data.testimonials[i][k]=v;refreshCanvas()}

function addService(){STATE.currentProject.data.services.push({name:'Novo serviço',desc:'Descrição',icon:'✓'});render()}
function removeService(i){STATE.currentProject.data.services.splice(i,1);render()}
function addProduct(){STATE.currentProject.data.products.push({name:'Novo produto',desc:'Descrição',price:''});render()}
function removeProduct(i){STATE.currentProject.data.products.splice(i,1);render()}
function addDifferential(){STATE.currentProject.data.differentials.push({title:'Novo diferencial',desc:'Descrição'});render()}
function removeDifferential(i){STATE.currentProject.data.differentials.splice(i,1);render()}
function addTeam(){STATE.currentProject.data.team.push({name:'Nome',role:'Cargo',bio:''});render()}
function removeTeam(i){STATE.currentProject.data.team.splice(i,1);render()}
function addFAQ(){STATE.currentProject.data.faq.push({q:'Nova pergunta?',a:'Resposta'});render()}
function removeFAQ(i){STATE.currentProject.data.faq.splice(i,1);render()}
function addTestimonial(){STATE.currentProject.data.testimonials.push({name:'Nome',role:'',text:'Depoimento aqui.'});render()}
function removeTestimonial(i){STATE.currentProject.data.testimonials.splice(i,1);render()}

function setStyle(s){
  const presets={moderno:{p:'#0f172a',s:'#334155',a:'#22c55e'},minimalista:{p:'#18181b',s:'#71717a',a:'#f59e0b'},elegante:{p:'#1e293b',s:'#64748b',a:'#d4af37'},premium:{p:'#0c0a09',s:'#44403c',a:'#f59e0b'},corporativo:{p:'#1e3a8a',s:'#1e293b',a:'#0ea5e9'},criativo:{p:'#7c3aed',s:'#1e1b4b',a:'#f59e0b'},impactante:{p:'#dc2626',s:'#0f172a',a:'#fbbf24'},popular:{p:'#16a34a',s:'#064e3b',a:'#f59e0b'}};
  const c=presets[s]||presets.moderno;
  const d=STATE.currentProject.data;
  d.style=s;d.primaryColor=c.p;d.secondaryColor=c.s;d.accentColor=c.a;
  render();
}
function autoSuggestColors(){
  const seg=(STATE.currentProject.data.segment||'').toLowerCase();
  let pick='moderno';
  if(/cl[ií]nica|sa[uú]de|m[eé]dic/.test(seg))pick='elegante';
  else if(/el[eé]tric/.test(seg))pick='impactante';
  else if(/mec[aâ]nic/.test(seg))pick='impactante';
  else if(/imobili/.test(seg))pick='premium';
  else if(/advog/.test(seg))pick='premium';
  else if(/fot[oó]g/.test(seg))pick='elegante';
  else if(/criativ|ag[eê]ncia/.test(seg))pick='criativo';
  setStyle(pick);toast('Identidade visual sugerida');
}

function uploadLogo(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{STATE.currentProject.data.logo=ev.target.result;render();toast('Logo enviada')};
  r.readAsDataURL(f);
}
function removeLogo(){STATE.currentProject.data.logo=null;render()}
function uploadProjectImage(e){
  Array.from(e.target.files).forEach(f=>{
    const r=new FileReader();
    r.onload=ev=>{STATE.currentProject.data.images.push(ev.target.result);render();toast('Imagem adicionada')};
    r.readAsDataURL(f);
  });
}
function removeProjectImage(i){STATE.currentProject.data.images.splice(i,1);render()}

function refreshCanvas(){
  const f=$('#canvasFrame');
  if(f)f.innerHTML=renderPreview();
}

/* ---------- PREVIEW (single-page, multi-sections) ---------- */
function renderPreview(){
  const d=STATE.currentProject.data;
  const tpl=TEMPLATES[STATE.currentProject.templateId]||TEMPLATES['empresa-corporativa'];
  const home = tpl.pages[0];
  const theme=SiteGenerator.buildTheme(d);
  const html=SiteGenerator.renderPageHTML(home,STATE.currentProject,theme,SiteGenerator.buildProjectContent(STATE.currentProject),[]);
  // Editor preview: sharedCSS escopado em .canvas-frame para não conflitar com o :root do app
  const css = SiteGenerator.sharedCSS ? SiteGenerator.sharedCSS(theme, '.canvas-frame') : '';
  return `<style>${css}
/* ===== editor canvas overrides — site real dentro do frame ===== */
.canvas-frame, .canvas-frame *{box-sizing:border-box}
.canvas-frame{margin:0;font-family:Inter,system-ui,sans-serif;color:#111}
.canvas-frame .wrap{max-width:1100px;margin:0 auto;padding:0 32px}
.canvas-frame section{padding:60px 0}
.canvas-frame .alt{background:#f8f8fa}
.canvas-frame .site-header{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fff;position:relative}
.canvas-frame .site-header .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px}
.canvas-frame .site-header .logo{font-weight:700;font-size:15px;color:var(--secondary,#0f172a)}
.canvas-frame .site-header .menu{display:flex;gap:14px}
.canvas-frame .site-header .menu a{color:#222;text-decoration:none;font-size:12px;font-weight:500}
.canvas-frame .site-header .btn{padding:6px 14px;font-size:12px;border-radius:6px;background:var(--primary,#0f172a);color:#fff;text-decoration:none;font-weight:500}
</style>${html}`;
}

/* ---------- PROJECT LIFECYCLE ---------- */
function startNewProject(){
  const p={
    id:uid(),name:'Novo projeto',client:'',company:'',segment:'',city:'',
    modelId:'modern',templateId:'empresa-corporativa',status:'draft',createdAt:Date.now(),
    data:defaultData(),versions:[]
  };
  STATE.currentProject=p;
  STATE.page='editor';STATE.editorStep='info';render();
}
function startProjectForClient(id){
  const cl=STATE.clients.find(x=>x.id===id);if(!cl)return;
  const data=defaultData(cl.company,cl.name,cl.segment,cl.city||'');
  data.whatsapp=cl.phone;data.email=cl.email;
  STATE.currentProject={
    id:uid(),name:'Projeto '+cl.company,client:cl.name,company:cl.company,segment:cl.segment,
    modelId:'modern',templateId:MODEL_TO_TEMPLATE['modern']||'empresa-corporativa',
    status:'draft',createdAt:Date.now(),data,versions:[]
  };
  applyTemplateDefaults(STATE.currentProject);
  STATE.page='editor';render();
}
function useModel(id){
  const m=MODELS.find(x=>x.id===id);if(!m)return;
  const preset = (typeof MODEL_PRESETS!=='undefined' && MODEL_PRESETS[id])||{};
  const seg = preset.segment||m.desc.split(' ')[0]||'';
  const city = preset.city||'';
  const company = preset.company||'';
  const suggestedName = company ? `Site ${company}` : `Projeto ${m.name}`;
  STATE.currentProject={
    id:uid(),
    name:suggestedName,
    client:'',
    company:company,
    segment:seg,
    city:city,
    modelId:id,
    templateId:MODEL_TO_TEMPLATE[id]||'empresa-corporativa',
    status:'draft',
    createdAt:Date.now(),
    data:defaultData(company,'',seg,city),
    versions:[]
  };
  // Aplica preset ANTES do template default (preset é mais rico)
  applyModelPreset(STATE.currentProject, id);
  applyTemplateDefaults(STATE.currentProject);
  // Garante que o company foi setado (caso defaultData tenha retornado sem)
  if(!STATE.currentProject.data.company && preset.company) STATE.currentProject.data.company = preset.company;
  if(!STATE.currentProject.data.trade) STATE.currentProject.data.trade = STATE.currentProject.data.company;
  STATE.page='editor';render();
}
function applyTemplateDefaults(p){
  const tpl=TEMPLATES[p.templateId];
  if(!tpl)return;
  const d=p.data;
  d.primaryColor=tpl.defaultTheme.primary;
  d.secondaryColor=tpl.defaultTheme.secondary;
  d.accentColor=tpl.defaultTheme.accent;
  d.style=tpl.defaultTheme.style;
  // popular conteúdo específico por template
  if(tpl.archetype==='clinica'&&(!d.services||d.services.length===0)){
    d.services=[{name:'Consulta Geral',desc:'Atendimento clínico completo e personalizado.',icon:'🩺'},{name:'Exames',desc:'Exames laboratoriais e de imagem.',icon:'🧪'},{name:'Especialidades',desc:'Diversas especialidades médicas.',icon:'⚕'}];
  }
  if(tpl.archetype==='imobiliaria'&&(!d.products||d.products.length===0)){
    d.products=[{name:'Apartamento 2 quartos',desc:'Apartamento moderno em localização privilegiada.',price:'R$ 450.000'},{name:'Casa 3 quartos',desc:'Casa com jardim e garagem.',price:'R$ 680.000'},{name:'Cobertura',desc:'Cobertura duplex com vista panorâmica.',price:'R$ 1.200.000'}];
  }
  if(tpl.archetype==='restaurante'&&(!d.services||d.services.length===0)){
    d.services=[{name:'Pratos principais',desc:'Variedade de pratos preparados com ingredientes selecionados.',icon:'🍽'},{name:'Sobremesas',desc:'Doces artesanais e sobremesas especiais.',icon:'🍰'},{name:'Bebidas',desc:'Drinks, sucos e vinhos selecionados.',icon:'🥤'}];
  }
}
function openProject(id){
  const p=STATE.projects.find(x=>x.id===id);if(!p)return;
  STATE.currentProject=JSON.parse(JSON.stringify(p));
  if(!STATE.currentProject.versions)STATE.currentProject.versions=[];
  STATE.page='editor';render();
}
function duplicateProject(id){
  const p=STATE.projects.find(x=>x.id===id);if(!p)return;
  const c=JSON.parse(JSON.stringify(p));
  c.id=uid();c.name=p.name+' (cópia)';c.createdAt=Date.now();c.status='draft';c.versions=[];
  STATE.projects.push(c);saveState();toast('Projeto duplicado');render();
}
function saveCurrent(){
  if(!STATE.currentProject)return;
  const p=STATE.currentProject;
  p.name=p.data.company?`Site ${p.data.company}`:'Novo projeto';
  p.client=p.data.company;p.company=p.data.company;p.segment=p.data.segment;p.city=p.data.city;
  p.updatedAt=Date.now();
  const idx=STATE.projects.findIndex(x=>x.id===p.id);
  if(idx>=0)STATE.projects[idx]=JSON.parse(JSON.stringify(p));
  else STATE.projects.push(JSON.parse(JSON.stringify(p)));
  saveState();toast('Projeto salvo');
}
function saveVersion(){
  if(!STATE.currentProject)return;
  const p=STATE.currentProject;
  if(!p.versions)p.versions=[];
  p.versions.push({id:uid(),data:JSON.parse(JSON.stringify(p.data)),createdAt:Date.now(),label:'v'+(p.versions.length+1)});
  if(p.versions.length>20)p.versions.shift();
  p.historyIndex=p.versions.length-1;
  saveCurrent();
}
function undoVersion(){
  const p=STATE.currentProject;if(!p||!p.versions||!p.versions.length){toast('Nada para desfazer','warn');return}
  p.historyIndex=Math.max(0,(p.historyIndex??p.versions.length)-1);
  p.data=JSON.parse(JSON.stringify(p.versions[p.historyIndex].data));
  render();toast('Versão restaurada');
}
function redoVersion(){
  const p=STATE.currentProject;if(!p||!p.versions||!p.versions.length){toast('Nada para refazer','warn');return}
  p.historyIndex=Math.min(p.versions.length-1,(p.historyIndex??-1)+1);
  p.data=JSON.parse(JSON.stringify(p.versions[p.historyIndex].data));
  render();toast('Versão refeita');
}
function openVersions(){
  const p=STATE.currentProject;
  if(!p||!p.versions||!p.versions.length){toast('Nenhuma versão salva','warn');return}
  showModal('Histórico de versões',
    p.versions.map((v,i)=>`<div class="version-item ${i===(p.historyIndex??-1)?'current':''}">
      <div class="version-info"><div class="version-num">${v.label}</div><div class="version-time">${fmtTime(v.createdAt)}</div></div>
      <button class="btn btn-secondary btn-sm" onclick="restoreVersion(${i})">Restaurar</button>
    </div>`).join(''),
    [{label:'Fechar',cls:'btn-primary',action:closeModal}]
  );
}
function restoreVersion(i){
  const p=STATE.currentProject;
  p.historyIndex=i;p.data=JSON.parse(JSON.stringify(p.versions[i].data));
  closeModal();render();toast('Versão restaurada');
}

/* ---------- AI EDIT ---------- */
function applyAI(){
  const p=($('#aiPrompt')?.value||'').trim();
  if(!p){toast('Digite uma instrução','warn');return}
  const d=STATE.currentProject.data;
  const s=p.toLowerCase();
  if(/mais sofistic|elegante|premium/.test(s)){
    setStyle('premium');toast('Estilo premium aplicado');
  }
  if(/mais modern|tecnolog/.test(s)){
    setStyle('moderno');toast('Estilo moderno aplicado');
  }
  if(/mais criativ|colorid/.test(s)){
    setStyle('criativo');toast('Estilo criativo aplicado');
  }
  if(/whatsapp.*destaque/.test(s)||/destaque.*whatsapp/.test(s)){
    d.ctaText='Fale conosco pelo WhatsApp';
    d.ctaSecondary='Atendimento rápido';
    toast('WhatsApp em destaque');
  }
  if(/adicion.*faq/.test(s)&&(!d.faq||d.faq.length===0)){
    d.faq=[{q:'Como posso entrar em contato?',a:'Você pode nos contatar pelo WhatsApp ou formulário no site.'},{q:'Qual o horário de atendimento?',a:d.hours||'Segunda a Sexta, das 8h às 18h.'},{q:'Vocês fazem orçamento?',a:'Sim, fazemos orçamento sem compromisso.'}];
    toast('FAQ adicionado');
  }
  if(/adicion.*depoiment/.test(s)&&(!d.testimonials||d.testimonials.length===0)){
    d.testimonials.push({name:'Cliente',role:'',text:'Adicione os depoimentos reais dos seus clientes aqui.'});
    toast('Slot de depoimento criado');
  }
  if(/mais servi[cç]o/.test(s)&&d.services.length<6){
    d.services.push({name:'Serviço adicional',desc:'Descrição do novo serviço.',icon:'✓'});
  }
  if(/muda.*slogan|novo slogan/.test(s)){
    d.slogan='Excelência e compromisso em cada detalhe';
    toast('Slogan atualizado');
  }
  saveVersion();render();
}

/* ---------- GENERATE & EXPORT ---------- */
async function generateProject(){
  if(!STATE.currentProject)return;
  const d=STATE.currentProject.data;
  if(!d.company){toast('Preencha o nome da empresa','error');STATE.editorStep='info';render();return}
  if(!d.whatsapp){toast('Preencha o WhatsApp','error');STATE.editorStep='info';render();return}
  showLoading();
  const steps=['Estruturando projeto...','Validando páginas e seções...','Aplicando tema...','Incorporando assets...','Renderizando HTML/CSS...','Gerando painel administrativo...','Empacotando arquivos...'];
  let i=0;
  while(i<steps.length){
    setLoadingStep(steps[i],i+1,steps.length);
    await new Promise(r=>setTimeout(r,200));
    i++;
  }
  saveVersion();
  STATE.currentProject.status='ready';
  saveCurrent();
  hideLoading();
  toast('Site gerado com sucesso!');
  openExport();
}

let loadingInterval=null;
function showLoading(){
  $('#loadingOverlay').classList.remove('hidden');
  setLoadingStep('Iniciando...',0,1);
}
function setLoadingStep(text,current,total){
  $('#loadingStep') && ($('#loadingStep').textContent=text);
  $('#loadingBar') && ($('#loadingBar').style.width=(current/total*100)+'%');
}
function hideLoading(){$('#loadingOverlay').classList.add('hidden')}

/* ---------- PRESENTATION ---------- */
function previewModel(id){
  const m=MODELS.find(x=>x.id===id);if(!m)return;
  const preset = (typeof MODEL_PRESETS!=='undefined' && MODEL_PRESETS[id])||{};
  const seg = preset.segment||m.desc.split(' ')[0]||'';
  const city = preset.city||'';
  const company = preset.company||m.name;
  const suggestedName = company ? `Site ${company}` : `Projeto ${m.name}`;
  STATE.currentProject={
    id:'preview-'+uid(),
    name:suggestedName,
    client:'',
    company:company,
    segment:seg,
    city:city,
    modelId:id,
    templateId:MODEL_TO_TEMPLATE[id]||'empresa-corporativa',
    status:'draft',
    createdAt:Date.now(),
    data:defaultData(company,'',seg,city),
    versions:[]
  };
  applyModelPreset(STATE.currentProject, id);
  applyTemplateDefaults(STATE.currentProject);
  if(!STATE.currentProject.data.company && preset.company) STATE.currentProject.data.company = preset.company;
  if(!STATE.currentProject.data.trade) STATE.currentProject.data.trade = STATE.currentProject.data.company;
  presentProject(STATE.currentProject.id);
}
function presentProject(id){
  const proj=id?STATE.projects.find(x=>x.id===id):STATE.currentProject;
  if(!proj)return;
  STATE.currentProject=proj;
  $('#presentationClient').textContent=proj.company||'Demonstração';
  $('#presentationMode').classList.remove('hidden');
  $('#sidebar').style.display='none';
  renderPresentation();
}
function exitPresentation(){
  $('#presentationMode').classList.add('hidden');
  $('#sidebar').style.display='';
}
function renderPresentation(){
  const p=STATE.currentProject;
  const tpl=TEMPLATES[p.templateId]||TEMPLATES['empresa-corporativa'];
  const home=tpl.pages[0];
  const html=SiteGenerator.renderPageHTML(home,p,SiteGenerator.buildTheme(p.data),SiteGenerator.buildProjectContent(p),[]);
  $('#presentationCanvas').innerHTML=`<div class="presentation-frame" id="presentationFrame">${html}</div>`;
}
function setDevice(d){
  STATE.device=d;
  $$('.presentation-bar .device-toggle button').forEach(b=>b.classList.toggle('active',b.dataset.device===d));
  const pf=$('#presentationFrame');
  if(pf){pf.className='presentation-frame';if(d!=='desktop')pf.classList.add(d)}
}

/* ---------- EXPORT ---------- */
async function openExport(){
  if(!STATE.currentProject)return;
  const p=STATE.currentProject;
  // gera ambos formatos para preview
  showModal('Exportar projeto','<div style="padding:32px;text-align:center;color:var(--text-3)">Gerando preview dos formatos...</div>',[]);
  const staticFiles=SiteGenerator.buildStatic(p);
  const nextFiles=SiteGenerator.buildNext(p);
  const staticVal=SiteValidator.validate(staticFiles,p,'static');
  const nextVal=SiteValidator.validate(nextFiles,p,'next');

  const body=`
    <div class="export-grid">
      <div class="export-option selected" data-format="next" onclick="selectExportFormat('next')">
        <span class="badge-next">RECOMENDADO</span>
        <h4>Next.js + Painel Admin</h4>
        <p>Site completo com painel administrativo funcional (/admin), autenticação segura, API routes, TypeScript. Hospede na Vercel ou similar.</p>
        <div style="margin-top:10px;font-size:11px;color:var(--text-3)">${nextFiles.size} arquivos · ${nextVal.summary.oks} ok · ${nextVal.summary.errors} erros · ${nextVal.summary.warns} avisos</div>
      </div>
      <div class="export-option" data-format="static" onclick="selectExportFormat('static')">
        <span class="badge-static">ESTÁTICO</span>
        <h4>HTML/CSS/JS Estático</h4>
        <p>Site estático sem painel admin. Múltiplas páginas HTML. Funciona em qualquer hospedagem (cPanel, FTP, Apache, Nginx).</p>
        <div style="margin-top:10px;font-size:11px;color:var(--text-3)">${staticFiles.size} arquivos · ${staticVal.summary.oks} ok · ${staticVal.summary.errors} erros · ${staticVal.summary.warns} avisos</div>
      </div>
    </div>
    <div id="exportPreview"></div>
  `;
  showModal('Exportar projeto — '+p.data.company, body, [
    {label:'Cancelar',cls:'btn-secondary',action:closeModal},
    {label:'⤓ Baixar ZIP',cls:'btn-primary',action:()=>doExport()},
  ]);
  STATE._exportFiles={next:nextFiles,static:staticFiles};
  STATE._exportFormat='next';
  renderExportPreview();
}

function selectExportFormat(fmt){
  STATE._exportFormat=fmt;
  $$('.export-option').forEach(o=>o.classList.toggle('selected',o.dataset.format===fmt));
  renderExportPreview();
}

function renderExportPreview(){
  const fmt=STATE._exportFormat;
  const files=STATE._exportFiles[fmt];
  const p=STATE.currentProject;
  const val=SiteValidator.validate(files,p,fmt);

  const tree=ZipExport.buildTree(files);
  const validationHTML=val.issues.slice(0,12).map(i=>`<div class="validation-item ${i.level}">${i.level==='ok'?'✓':i.level==='warn'?'⚠':'✕'} ${esc(i.message)}</div>`).join('');
  const more=val.issues.length>12?`<div class="validation-item ok">+ ${val.issues.length-12} verificações adicionais</div>`:'';

  $('#exportPreview').innerHTML=`
    <div class="form-section">
      <h3>Estrutura do projeto (${files.size} arquivos)</h3>
      <div class="file-tree">${tree}</div>
    </div>
    <div class="form-section">
      <h3>Validação <span class="status-pill ${val.summary.errors?'status-error':'status-ready'}">${val.summary.errors?'Bloqueado':'Pronto'}</span></h3>
      <div class="validation-list">${validationHTML}${more}</div>
      ${val.summary.errors?`<p style="color:var(--danger);font-size:12px;margin-top:10px">⚠ Corrija os erros antes de exportar.</p>`:''}
    </div>
  `;
}

async function doExport(){
  const fmt=STATE._exportFormat||'next';
  const files=STATE._exportFiles[fmt];
  const p=STATE.currentProject;
  const val=SiteValidator.validate(files,p,fmt);
  if(val.summary.errors>0){toast('Corrija os erros antes de exportar','error');return}
  p.status='exported';
  saveCurrent();
  toast('Gerando ZIP...');
  const blob=await ZipExport.buildZIP(files,p.data.company);
  const filename=ZipExport.slugify(p.data.company)+'-site.zip';
  ZipExport.downloadBlob(blob,filename);
  p.status='ready';
  saveCurrent();
  closeModal();
  toast('ZIP baixado: '+filename);
}

/* ---------- OTHER PAGES ---------- */
function renderComponents(c){
  setPageTitle('Componentes','Biblioteca interna de blocos');
  const groups=[
    {n:'Headers',l:['Header Moderno','Header Corporativo','Header Premium','Header Minimal','Header Criativo']},
    {n:'Hero',l:['Hero Moderno','Hero Premium','Hero Corporativo','Hero com Imagem','Hero Produto','Hero Serviço','Hero Local','Hero Impactante']},
    {n:'Services',l:['Grid 3 colunas','Lista Vertical','Cards Coloridos','Serviços com Ícone','Serviços com Imagem','Serviços Premium']},
    {n:'Products',l:['Card Produto','Grid Catálogo','Vitrine','Produto Destaque','Lista Produtos']},
    {n:'About',l:['Sobre Clássico','Sobre Premium','Sobre com Stats','Sobre Moderno']},
    {n:'Benefits',l:['Benefícios Grid','Benefícios Linha','Ícones Grandes','Cards','Premium']},
    {n:'Testimonials',l:['Carrossel','Grid 3','Destaque Único','Lista']},
    {n:'Gallery',l:['Galeria Grid','Masonry','Galeria Slider','Portfólio']},
    {n:'FAQ',l:['Acordeão','Lista','Premium']},
    {n:'CTA',l:['WhatsApp','Orçamento','Contato','Produto','Premium','Localizado']},
    {n:'Footer',l:['Completo','Minimal','Premium','Corporativo','Moderno']},
  ];
  c.innerHTML=`
    <p style="color:var(--text-2);margin-bottom:20px">Componentes reutilizáveis disponíveis para montagem dos sites.</p>
    <div class="demo-grid">${groups.map(g=>`<div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name" style="margin-bottom:10px">${g.n}</div><div style="font-size:12.5px;color:var(--text-3);line-height:1.8">${g.l.map(i=>`<div>• ${i}</div>`).join('')}</div><div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);font-size:11px;color:var(--text-3)">${g.l.length} variações</div></div></div>`).join('')}</div>
  `;
}

function renderAdmin(c){
  setPageTitle('Administração','Painel administrativo');
  c.innerHTML=`
    <div class="demo-grid">
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name">Modelos</div><div class="demo-meta">${MODELS.length} modelos · ${Object.keys(TEMPLATES).length} templates</div><button class="btn btn-secondary btn-sm btn-block" style="margin-top:12px" onclick="goPage('models')">Gerenciar</button></div></div>
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name">Projetos</div><div class="demo-meta">${STATE.projects.length} projetos</div><button class="btn btn-secondary btn-sm btn-block" style="margin-top:12px" onclick="goPage('projects')">Ver todos</button></div></div>
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name">Mídia</div><div class="demo-meta">${STATE.media.length} assets · ${STATE.references.length} referências</div><button class="btn btn-secondary btn-sm btn-block" style="margin-top:12px" onclick="goPage('media')">Biblioteca</button></div></div>
      <div class="demo-card" style="cursor:default"><div class="demo-body"><div class="demo-name">Componentes</div><div class="demo-meta">11 categorias</div><button class="btn btn-secondary btn-sm btn-block" style="margin-top:12px" onclick="goPage('components')">Gerenciar</button></div></div>
    </div>
  `;
}

function renderSettings(c){
  setPageTitle('Configurações','Preferências do sistema');
  c.innerHTML=`
    <div class="form-section" style="background:var(--bg-2);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:20px">
      <h3 style="font-size:14px;margin-bottom:16px">Integrações futuras</h3>
      <div style="display:grid;gap:8px">
        <div style="padding:12px;background:var(--surface);border-radius:8px;display:flex;justify-content:space-between"><span>Vercel (deploy)</span><span style="font-size:12px;color:var(--text-3)">Pronto</span></div>
        <div style="padding:12px;background:var(--surface);border-radius:8px;display:flex;justify-content:space-between"><span>Supabase (banco)</span><span style="font-size:12px;color:var(--text-3)">Pronto</span></div>
        <div style="padding:12px;background:var(--surface);border-radius:8px;display:flex;justify-content:space-between"><span>IA</span><span style="font-size:12px;color:var(--text-3)">Pronto</span></div>
      </div>
    </div>
    <div class="form-section" style="background:var(--bg-2);border:1px solid var(--border);border-radius:12px;padding:24px">
      <h3 style="font-size:14px;margin-bottom:16px">Dados</h3>
      <button class="btn btn-danger" onclick="if(confirm('Limpar todos os dados?')){localStorage.clear();location.reload()}">Limpar dados locais</button>
    </div>
  `;
}

/* ---------- MODAL ---------- */
function showModal(title,body,buttons=[]){
  $('#modalTitle').textContent=title;
  $('#modalBody').innerHTML=body;
  $('#modalFoot').innerHTML='';
  buttons.forEach(b=>{
    const btn=document.createElement('button');
    btn.className='btn '+b.cls;btn.textContent=b.label;btn.onclick=b.action;
    $('#modalFoot').appendChild(btn);
  });
  $('#modal').classList.remove('hidden');
}
function closeModal(){$('#modal').classList.add('hidden')}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();if(!$('#presentationMode').classList.contains('hidden'))exitPresentation()}});

/* ---------- NAV BIND ---------- */
document.addEventListener('click',e=>{
  const ni=e.target.closest('.nav-item');
  if(ni&&ni.dataset.page)goPage(ni.dataset.page);
});

/* ---------- INIT ---------- */
loadState();
render();
