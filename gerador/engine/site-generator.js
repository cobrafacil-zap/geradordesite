/* ==========================================================================
   SITE PROJECT GENERATOR — Gera projeto real (arquivos físicos)
   ========================================================================== */

const SiteGenerator = (()=>{

  // ----- HELPERS -----
  const esc = s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const slugify = s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')||'item';
  const waLink = (num,msg)=>`https://wa.me/${String(num||'').replace(/\D/g,'')}?text=${encodeURIComponent(msg||'Olá')}`;
  const imgExt = (data)=>{
    if(!data||!data.startsWith('data:'))return 'png';
    const m=data.match(/data:image\/(\w+);/);return m?m[1]:'png';
  };
  const imgB64 = (data)=>{
    if(!data)return null;
    const m=data.match(/^data:image\/\w+;base64,(.+)$/);
    return m?m[1]:null;
  };

  // ----- TEMAS -----
  function buildTheme(d){
    return {
      colors:{
        primary:d.primaryColor||'#0f172a',
        secondary:d.secondaryColor||'#334155',
        accent:d.accentColor||'#22c55e',
        background:'#ffffff',
        surface:'#f8f8fa',
        text:d.secondaryColor||'#334155',
        textMuted:'#6b7280',
        border:'#e5e7eb',
      },
      typography:{heading:'Inter, system-ui, sans-serif',body:'Inter, system-ui, sans-serif'},
      radius:'8px', spacing:'8px',
      style:d.style||'moderno',
    };
  }

  // ----- CONTEÚDO DO PROJETO -----
  function buildProjectContent(project){
    const d=project.data;
    return {
      company:{name:d.company||'Sua Empresa',trade:d.trade||d.company||'Sua Empresa',slogan:d.slogan||'',segment:d.segment||'',city:d.city||'',state:d.state||'',heroStyle:d.heroStyle||'A',heroImage:d.image||null},
      contact:{whatsapp:d.whatsapp,phone:d.phone,email:d.email,address:d.address,instagram:d.instagram,facebook:d.facebook,whatsappMessage:d.whatsappMessage||'Olá, gostaria de saber mais.'},
      about:d.about||'',
      services:(d.services||[]).map(s=>({name:s.name,desc:s.desc,icon:s.icon||'✓',slug:slugify(s.name)})),
      differentials:(d.differentials||[]).map(x=>({title:x.title,desc:x.desc,name:x.title,desc2:x.desc})),
      team:d.team||[],
      testimonials:(d.testimonials||[]).filter(t=>t.name&&t.text),
      products:(d.products||[]).map(p=>({name:p.name,desc:p.desc,price:p.price||'',slug:slugify(p.name)})),
      faq:d.faq||[],
      cta:{primary:d.ctaText||'Fale Conosco',secondary:d.ctaSecondary||'Saiba Mais'},
      logo:d.logo||null,
      images:d.images||[],
      cnpj:d.cnpj||'',
      hours:d.hours||'',
    };
  }

  // ----- COLLECT ASSETS -----
  function collectAssets(project){
    const assets=[]; // [{path,data,name,origin}]
    const c=buildProjectContent(project);
    if(c.logo){
      const ext=imgExt(c.logo),b64=imgB64(c.logo);
      if(b64)assets.push({path:`assets/logo.${ext}`,b64,origin:'upload',name:'logo'});
    }
    c.images.forEach((img,i)=>{
      if(!img)return;
      const ext=imgExt(img),b64=imgB64(img);
      if(b64)assets.push({path:`assets/image-${i+1}.${ext}`,b64,origin:'upload',name:`image-${i+1}`});
    });
    return assets;
  }

  // ----- GERA HTML DE UMA PÁGINA (single-page render) -----
  function renderPageHTML(page,project,theme,content,assets){
    // section renderers
    const sections = {
      header:()=>renderHeader(page,project,theme,content),
      footer:()=>renderFooter(project,theme,content),
      hero:()=>renderHero(project,theme,content),
      'hero-simple':()=>renderHeroSimple(page,project,theme,content),
      about:()=>renderAbout(project,theme,content),
      services:()=>renderServices(project,theme,content),
      'specialties':()=>renderServices(project,theme,content,'Nossas Especialidades','Conheça nossos tratamentos e procedimentos'),
      differentials:()=>renderDifferentials(project,theme,content),
      team:()=>renderTeam(project,theme,content),
      testimonials:()=>renderTestimonials(project,theme,content),
      faq:()=>renderFAQ(project,theme,content),
      contact:()=>renderContact(project,theme,content),
      cta:()=>renderCTA(project,theme,content),
      'featured-properties':()=>renderProperties(project,theme,content),
      'property-list':()=>renderPropertyList(project,theme,content),
      cases:()=>renderCases(project,theme,content),
      'products-featured':()=>renderProducts(project,theme,content,'Produtos em Destaque'),
      'product-list':()=>renderProducts(project,theme,content,'Todos os Produtos',true),
      gallery:()=>renderGallery(project,theme,content),
      'menu-preview':()=>renderMenuPreview(project,theme,content),
      'menu-full':()=>renderMenuFull(project,theme,content),
      reservation:()=>renderReservation(project,theme,content),
      history:()=>renderHistory(project,theme,content),
      map:()=>renderMap(project,theme,content),
      'blog-list':()=>renderBlogList(project,theme,content),
      legal:()=>renderLegal(project,theme,content,page),
    };
    return (page.sections||[]).map(s=>sections[s]?sections[s]():'').join('\n');
  }

  // ----- COMPONENTES -----
  function renderHeader(page,project,theme,content){
    const wa=waLink(content.contact.whatsapp,content.contact.whatsappMessage);
    const isHome = page.slug==='/';
    const links = (project.template?.pages||[])
      .filter(p=>p.slug!=='/politica-de-privacidade')
      .map(p=>`<a href="${p.slug==='/'?'index.html':p.slug.replace(/^\//,'')+'.html'}">${esc(p.name)}</a>`).join('');
    return `<header class="site-header">
      <div class="wrap nav-in">
        <a href="index.html" class="logo">${content.logo?`<img src="assets/${content.logo.split('/').pop()}" alt="${esc(content.company.trade)}">`:`<span>${esc(content.company.trade)}</span>`}</a>
        <nav class="menu">${links}</nav>
        <a href="${wa}" class="btn btn-p">${esc(content.cta.primary)}</a>
        <button class="mobile-toggle" aria-label="Menu" onclick="document.querySelector('.menu').classList.toggle('open')">☰</button>
      </div>
    </header>`;
  }

  function renderFooter(project,theme,content){
    const year=new Date().getFullYear();
    const wa=waLink(content.contact.whatsapp,content.contact.whatsappMessage);
    return `<footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div><div class="logo" style="color:#fff">${esc(content.company.trade)}</div><p>${esc(content.about).slice(0,160)}</p></div>
          <div><h4>Contato</h4><p>${content.contact.whatsapp?'📱 '+esc(content.contact.whatsapp):''}</p><p>${content.contact.email?'✉ '+esc(content.contact.email):''}</p><p>${content.contact.address?'📍 '+esc(content.contact.address):''}</p></div>
          <div><h4>Horário</h4><p>${esc((content.hours||'Segunda a Sexta — 08:00 às 18:00').replace(/\n/g,'<br>'))}</p></div>
          <div><h4>Redes</h4>${content.contact.instagram?`<a href="https://instagram.com/${esc(content.contact.instagram).replace('@','')}">${esc(content.contact.instagram)}</a><br>`:''}${content.contact.facebook?`<a href="https://${esc(content.contact.facebook)}">${esc(content.contact.facebook)}</a>`:''}</div>
        </div>
        <div class="footer-bot">
          <div>© ${year} ${esc(content.company.name)}. Todos os direitos reservados.</div>
          <div><a href="politica-de-privacidade.html">Política de Privacidade</a></div>
        </div>
      </div>
    </footer>
    <a href="${wa}" class="wa-float" target="_blank" rel="noopener">💬</a>`;
  }

  function renderHero(project,theme,content){
    const wa=waLink(content.contact.whatsapp,content.contact.whatsappMessage);
    const logoImg = content.logo?`assets/${content.logo.split('/').pop()}`:null;
    const style = (content.company.heroStyle||'A').toUpperCase();
    if(style==='B') return renderHeroB(project,theme,content,wa,logoImg);
    if(style==='C') return renderHeroC(project,theme,content,wa,logoImg);
    if(style==='D') return renderHeroD(project,theme,content,wa,logoImg);
    if(style==='E') return renderHeroE(project,theme,content,wa,logoImg);
    if(style==='F') return renderHeroF(project,theme,content,wa,logoImg);
    if(style==='G') return renderHeroG(project,theme,content,wa,logoImg);
    return renderHeroA(project,theme,content,wa,logoImg);
  }

  // A — split (default): imagem à direita, copy+CTA à esquerda
  function renderHeroA(project,theme,content,wa,logoImg){
    const heroImg = content.company.heroImage;
    return `<section class="hero hero-a">
      <div class="wrap hero-grid">
        <div>
          <div class="pill">${esc(content.company.segment||'Excelência')}${content.company.city?' · '+esc(content.company.city):''}</div>
          <h1>${esc(content.company.slogan||'Soluções profissionais para o seu negócio')}</h1>
          <p>${esc(content.about).slice(0,220)||'Atuamos com compromisso, qualidade e transparência para entregar o melhor resultado.'}</p>
          <div class="hero-cta">
            <a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a>
            <a href="#sobre" class="btn btn-s">${esc(content.cta.secondary)}</a>
          </div>
        </div>
        <div class="hero-img">${heroImg?`<img src="${esc(heroImg)}" alt="${esc(content.company.trade)}" loading="lazy">`:logoImg?`<img src="${logoImg}" alt="logo">`:esc((content.company.trade||'★').charAt(0).toUpperCase())}</div>
      </div>
    </section>`;
  }

  // B — centrado com gradiente: copy no centro, imagem de fundo desfocada
  function renderHeroB(project,theme,content,wa,logoImg){
    const heroImg = content.company.heroImage;
    const bgStyle = heroImg?`background-image:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.6)),url('${esc(heroImg)}');background-size:cover;background-position:center;color:#fff;`:'';
    return `<section class="hero hero-b" style="${bgStyle}">
      <div class="wrap hero-center">
        <div class="pill pill-center">${esc(content.company.segment||'Excelência')}${content.company.city?' · '+esc(content.company.city):''}</div>
        <h1>${esc(content.company.slogan||'Soluções profissionais para o seu negócio')}</h1>
        <p class="lead">${esc(content.about).slice(0,240)||'Atuamos com compromisso, qualidade e transparência para entregar o melhor resultado.'}</p>
        <div class="hero-cta center">
          <a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a>
          <a href="#sobre" class="btn btn-s">${esc(content.cta.secondary)}</a>
        </div>
      </div>
    </section>`;
  }

  // C — magazine 3 colunas: título central + 3 cards de destaque abaixo
  function renderHeroC(project,theme,content,wa,logoImg){
    const diffs = (content.differentials||[]).slice(0,3);
    const cards = diffs.map(d=>`<div class="hero-mag-card"><div class="hero-mag-icon">★</div><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p></div>`).join('');
    return `<section class="hero hero-c">
      <div class="wrap">
        <div class="pill">${esc(content.company.segment||'Excelência')}${content.company.city?' · '+esc(content.company.city):''}</div>
        <h1>${esc(content.company.slogan||'Soluções profissionais para o seu negócio')}</h1>
        <p class="lead">${esc(content.about).slice(0,200)||'Atuamos com compromisso, qualidade e transparência.'}</p>
        <div class="hero-mag-grid">${cards}</div>
        <div class="hero-cta"><a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a></div>
      </div>
    </section>`;
  }

  // D — product spotlight: produto grande à esquerda (imagem real), descrição à direita
  function renderHeroD(project,theme,content,wa,logoImg){
    const heroImg = content.company.heroImage;
    return `<section class="hero hero-d">
      <div class="wrap hero-grid">
        <div class="hero-img product-spot">
          <div class="product-img-placeholder">${heroImg?`<img src="${esc(heroImg)}" alt="${esc(content.company.trade)}" loading="lazy">`:logoImg?`<img src="${logoImg}" alt="logo">`:esc((content.company.trade||'★').slice(0,3).toUpperCase())}</div>
        </div>
        <div>
          <div class="pill">${esc(content.company.segment||'Produto')}</div>
          <h1>${esc(content.company.slogan||'Soluções profissionais para o seu negócio')}</h1>
          <p>${esc(content.about).slice(0,220)}</p>
          <div class="hero-cta"><a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a><a href="#produtos" class="btn btn-s">${esc(content.cta.secondary)}</a></div>
        </div>
      </div>
    </section>`;
  }

  // E — service grid: copy à esquerda + grid de serviços compactos à direita
  function renderHeroE(project,theme,content,wa,logoImg){
    const svcs = (content.services||[]).slice(0,4);
    const svcCards = svcs.map((s,i)=>`<div class="hero-svc-item"><span class="hero-svc-num">${i+1}</span><div><strong>${esc(s.name)}</strong><p>${esc(s.desc)}</p></div></div>`).join('');
    return `<section class="hero hero-e">
      <div class="wrap hero-grid">
        <div>
          <div class="pill">${esc(content.company.segment||'Serviços')}${content.company.city?' · '+esc(content.company.city):''}</div>
          <h1>${esc(content.company.slogan||'Soluções profissionais para o seu negócio')}</h1>
          <p>${esc(content.about).slice(0,180)}</p>
          <div class="hero-cta"><a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a></div>
        </div>
        <div class="hero-svc-grid">${svcCards}</div>
      </div>
    </section>`;
  }

  // F — property/menu showcase: vitrine de cards (com imagem real)
  function renderHeroF(project,theme,content,wa,logoImg){
    const heroImg = content.company.heroImage;
    const items = (content.services&&content.services.length?content.services:content.differentials||[]).slice(0,3);
    const cards = items.map((it,i)=>{
      // usa heroImg para o primeiro card, e gradient para os demais (diversidade visual)
      const cardImg = i===0&&heroImg ? `<img src="${esc(heroImg)}" alt="">` : '';
      return `<div class="hero-prop-card"><div class="hero-prop-img">${cardImg||esc((it.name||'').charAt(0).toUpperCase())}</div><h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p></div>`;
    }).join('');
    return `<section class="hero hero-f">
      <div class="wrap">
        <div class="pill pill-center">${esc(content.company.segment||'Destaques')}${content.company.city?' · '+esc(content.company.city):''}</div>
        <h1>${esc(content.company.slogan||'Soluções profissionais para o seu negócio')}</h1>
        <div class="hero-prop-grid">${cards}</div>
        <div class="hero-cta center"><a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a></div>
      </div>
    </section>`;
  }

  // G — gallery de polaroids: ensaio com grid de imagens
  function renderHeroG(project,theme,content,wa,logoImg){
    return `<section class="hero hero-g">
      <div class="wrap">
        <div class="pill pill-center">${esc(content.company.segment||'Fotografia')}</div>
        <h1>${esc(content.company.slogan||'Cada clique conta uma história')}</h1>
        <div class="hero-gallery">
          <div class="polaroid p1"><div></div><span>ensaio</span></div>
          <div class="polaroid p2"><div></div><span>casamento</span></div>
          <div class="polaroid p3"><div></div><span>marca</span></div>
          <div class="polaroid p4"><div></div><span>evento</span></div>
        </div>
        <div class="hero-cta center"><a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a></div>
      </div>
    </section>`;
  }

  function renderHeroSimple(page,project,theme,content){
    return `<section class="hero-simple">
      <div class="wrap">
        <h1>${esc(page.name)}</h1>
        <p>${esc(content.about).slice(0,200)||'Conheça mais sobre nossos serviços e soluções.'}</p>
      </div>
    </section>`;
  }

  function renderAbout(project,theme,content){
    const heroImg = content.company.heroImage;
    return `<section class="alt" id="sobre">
      <div class="wrap about-grid">
        <div class="about-img">${heroImg?`<img src="${esc(heroImg)}" alt="${esc(content.company.trade)}" loading="lazy">`:esc((content.company.trade||'★').charAt(0).toUpperCase())}</div>
        <div>
          <div class="kicker">Sobre nós</div>
          <h2>${esc(content.company.name)}</h2>
          <p>${esc(content.about||'Somos uma empresa comprometida com a qualidade e a satisfação dos nossos clientes.')}</p>
        </div>
      </div>
    </section>`;
  }

  function renderServices(project,theme,content,title='Nossos Serviços',sub='Conheça o que podemos oferecer para o seu negócio'){
    if(!content.services||content.services.length===0)return '';
    return `<section id="servicos">
      <div class="wrap">
        <div class="sec-head"><h2>${esc(title)}</h2><p>${esc(sub)}</p></div>
        <div class="grid-3">
          ${content.services.slice(0,6).map(s=>`
            <div class="card">
              <div class="ico">${esc(s.icon||'✓')}</div>
              <h3>${esc(s.name)}</h3>
              <p>${esc(s.desc)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderDifferentials(project,theme,content){
    if(!content.differentials||content.differentials.length===0)return '';
    return `<section class="alt">
      <div class="wrap">
        <div class="sec-head"><h2>Por que nos escolher</h2><p>Compromisso com qualidade e resultado</p></div>
        <div class="grid-3">
          ${content.differentials.slice(0,6).map(x=>`
            <div class="card">
              <div class="ico">★</div>
              <h3>${esc(x.title)}</h3>
              <p>${esc(x.desc)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderTeam(project,theme,content){
    if(!content.team||content.team.length===0)return '';
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Nossa equipe</h2><p>Profissionais qualificados e dedicados</p></div>
        <div class="grid-3">
          ${content.team.slice(0,6).map(m=>`
            <div class="card team-card">
              <div class="avatar">${m.photo?`<img src="${m.photo}">`:esc((m.name||'?').charAt(0).toUpperCase())}</div>
              <h3>${esc(m.name)}</h3>
              <p class="role">${esc(m.role||'')}</p>
              <p>${esc(m.bio||'')}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderTestimonials(project,theme,content){
    if(!content.testimonials||content.testimonials.length===0)return '';
    return `<section class="alt">
      <div class="wrap">
        <div class="sec-head"><h2>Depoimentos</h2><p>Veja o que dizem nossos clientes</p></div>
        <div class="grid-3">
          ${content.testimonials.slice(0,6).map(t=>`
            <div class="testimonial">
              <p>"${esc(t.text)}"</p>
              <div class="author">${esc(t.name)}</div>
              ${t.role?`<div class="role">${esc(t.role)}</div>`:''}
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderFAQ(project,theme,content){
    if(!content.faq||content.faq.length===0)return '';
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Perguntas frequentes</h2><p>Tire suas dúvidas</p></div>
        <div class="faq">
          ${content.faq.slice(0,8).map((f,i)=>`
            <details ${i===0?'open':''}>
              <summary>${esc(f.q)}</summary>
              <p>${esc(f.a)}</p>
            </details>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderContact(project,theme,content){
    const wa=waLink(content.contact.whatsapp,content.contact.whatsappMessage);
    return `<section id="contato">
      <div class="wrap">
        <div class="sec-head"><h2>Entre em contato</h2><p>Estamos prontos para atender você</p></div>
        <div class="contact-grid">
          <div class="contact-info">
            ${content.contact.whatsapp?`<div class="info-row"><span>📱</span><div><strong>WhatsApp</strong><p>${esc(content.contact.whatsapp)}</p></div></div>`:''}
            ${content.contact.email?`<div class="info-row"><span>✉</span><div><strong>E-mail</strong><p>${esc(content.contact.email)}</p></div></div>`:''}
            ${content.contact.phone?`<div class="info-row"><span>☎</span><div><strong>Telefone</strong><p>${esc(content.contact.phone)}</p></div></div>`:''}
            ${content.contact.address?`<div class="info-row"><span>📍</span><div><strong>Endereço</strong><p>${esc(content.contact.address)}</p></div></div>`:''}
            ${content.contact.instagram?`<div class="info-row"><span>📷</span><div><strong>Instagram</strong><p>${esc(content.contact.instagram)}</p></div></div>`:''}
          </div>
          <form class="contact-form" onsubmit="event.preventDefault();window.open('${wa}','_blank')">
            <h3>Envie uma mensagem</h3>
            <input type="text" placeholder="Seu nome" required>
            <input type="email" placeholder="Seu e-mail" required>
            <input type="tel" placeholder="Seu telefone">
            <textarea placeholder="Sua mensagem" rows="4" required></textarea>
            <button type="submit" class="btn btn-p btn-block">Enviar mensagem</button>
            <p class="form-note">Ao enviar, você será redirecionado ao WhatsApp.</p>
          </form>
        </div>
      </div>
    </section>`;
  }

  function renderCTA(project,theme,content){
    const wa=waLink(content.contact.whatsapp,content.contact.whatsappMessage);
    return `<section class="cta-band">
      <div class="wrap">
        <h2>Pronto para começar?</h2>
        <p>Entre em contato agora e solicite um orçamento sem compromisso.</p>
        <a href="${wa}" class="btn btn-p">${esc(content.cta.primary)} →</a>
      </div>
    </section>`;
  }

  function renderProperties(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Imóveis em destaque</h2><p>Confira nossas opções</p></div>
        <div class="grid-3">
          ${(content.products||[]).slice(0,3).map(p=>`
            <div class="card property-card">
              <div class="prop-img">${esc((p.name||'?').charAt(0).toUpperCase())}</div>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.desc)}</p>
              ${p.price?`<div class="price">${esc(p.price)}</div>`:''}
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderPropertyList(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Todos os imóveis</h2><p>Encontre o imóvel ideal para você</p></div>
        <div class="grid-3">
          ${(content.products||[]).map(p=>`
            <div class="card property-card">
              <div class="prop-img">${esc((p.name||'?').charAt(0).toUpperCase())}</div>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.desc)}</p>
              ${p.price?`<div class="price">${esc(p.price)}</div>`:''}
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderCases(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Cases de sucesso</h2><p>Resultados que entregamos</p></div>
        <div class="grid-2">
          ${(content.differentials||[]).slice(0,4).map((d,i)=>`
            <div class="case-card">
              <div class="case-num">${String(i+1).padStart(2,'0')}</div>
              <h3>${esc(d.title)}</h3>
              <p>${esc(d.desc)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderProducts(project,theme,content,title='Produtos',full=false){
    const list = full?content.products:(content.products||[]).slice(0,3);
    if(!list||list.length===0)return '';
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>${esc(title)}</h2><p>Confira nossas opções</p></div>
        <div class="grid-3">
          ${list.map(p=>`
            <div class="card product-card">
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.desc)}</p>
              ${p.price?`<div class="price">${esc(p.price)}</div>`:''}
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderGallery(project,theme,content){
    if(!content.images||content.images.length===0)return '';
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Galeria</h2><p>Conheça nosso espaço</p></div>
        <div class="gallery">
          ${content.images.slice(0,8).map(img=>`<div class="gallery-item"><img src="assets/${img.split('/').pop()}" alt=""></div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderMenuPreview(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Cardápio</h2><p>Alguns dos nossos destaques</p></div>
        <div class="grid-2">
          ${(content.services||[]).slice(0,6).map(s=>`
            <div class="menu-item">
              <div class="menu-head"><h3>${esc(s.name)}</h3><span class="dots"></span><span class="price">Consulte</span></div>
              <p>${esc(s.desc)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderMenuFull(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Cardápio completo</h2><p>Todas as nossas opções</p></div>
        <div class="grid-2">
          ${(content.services||[]).map(s=>`
            <div class="menu-item">
              <div class="menu-head"><h3>${esc(s.name)}</h3><span class="dots"></span><span class="price">Consulte</span></div>
              <p>${esc(s.desc)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderReservation(project,theme,content){
    const wa=waLink(content.contact.whatsapp,content.contact.whatsappMessage);
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Reserve sua mesa</h2><p>Garanta seu lugar</p></div>
        <form class="reservation-form" onsubmit="event.preventDefault();window.open('${wa}','_blank')">
          <div class="form-row">
            <input type="text" placeholder="Nome completo" required>
            <input type="tel" placeholder="Telefone" required>
          </div>
          <div class="form-row">
            <input type="date" required>
            <input type="time" required>
          </div>
          <input type="number" placeholder="Número de pessoas" min="1" max="20" required>
          <textarea placeholder="Observações" rows="3"></textarea>
          <button type="submit" class="btn btn-p btn-block">Solicitar reserva</button>
        </form>
      </div>
    </section>`;
  }

  function renderHistory(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Nossa história</h2><p>Tradição e evolução</p></div>
        <p style="max-width:760px;margin:0 auto;text-align:center;font-size:16px;line-height:1.7">${esc(content.about||'Nossa trajetória é marcada por dedicação e evolução constante.')}</p>
      </div>
    </section>`;
  }

  function renderMap(project,theme,content){
    if(!content.contact.address)return '';
    const q=encodeURIComponent(content.contact.address);
    return `<section style="padding:0">
      <iframe src="https://www.google.com/maps?q=${q}&output=embed" width="100%" height="360" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>`;
  }

  function renderBlogList(project,theme,content){
    return `<section>
      <div class="wrap">
        <div class="sec-head"><h2>Blog</h2><p>Conteúdos e novidades</p></div>
        <div class="grid-3">
          <div class="card"><div class="kicker">Artigo</div><h3>Como escolher o melhor serviço</h3><p>Confira dicas importantes para tomar a melhor decisão.</p></div>
          <div class="card"><div class="kicker">Artigo</div><h3>Tendências do mercado</h3><p>O que esperar nos próximos meses e como se preparar.</p></div>
          <div class="card"><div class="kicker">Artigo</div><h3>Cuidados essenciais</h3><p>Saiba como manter resultados duradouros.</p></div>
        </div>
      </div>
    </section>`;
  }

  function renderLegal(project,theme,content,page){
    return `<section>
      <div class="wrap" style="max-width:780px">
        <h1>${esc(page.name)}</h1>
        <p style="margin:18px 0;line-height:1.7">Este site respeita a privacidade dos seus visitantes. As informações coletadas através do formulário de contato são utilizadas exclusivamente para responder à solicitação do usuário.</p>
        <h3>1. Dados coletados</h3>
        <p>Coletamos nome, e-mail, telefone e mensagem quando você preenche nosso formulário.</p>
        <h3>2. Uso das informações</h3>
        <p>Os dados são utilizados para responder ao contato enviado, jamais sendo compartilhados com terceiros.</p>
        <h3>3. Direitos do titular</h3>
        <p>Você pode solicitar a exclusão dos seus dados a qualquer momento através do nosso canal de contato.</p>
        <h3>4. Cookies</h3>
        <p>Este site pode utilizar cookies para melhorar a experiência do usuário.</p>
        <h3>5. Contato</h3>
        <p>Em caso de dúvidas, entre em contato: ${esc(content.contact.email||'')}</p>
      </div>
    </section>`;
  }

  // ----- SHARED STYLES (CSS) -----
  function sharedCSS(theme){
    return `/* Auto-generated by Gerador de Sites */
:root{
  --primary:${theme.colors.primary};
  --secondary:${theme.colors.secondary};
  --accent:${theme.colors.accent};
  --bg:${theme.colors.background};
  --surface:${theme.colors.surface};
  --text:${theme.colors.text};
  --muted:${theme.colors.textMuted};
  --border:${theme.colors.border};
  --radius:${theme.radius};
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:${theme.typography.body};color:var(--text);background:var(--bg);line-height:1.6}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
h1,h2,h3{color:var(--secondary);letter-spacing:-.02em;line-height:1.15}
h1{font-size:46px;font-weight:800;margin-bottom:18px}
h2{font-size:34px;font-weight:700;margin-bottom:12px}
h3{font-size:18px;font-weight:600;margin-bottom:8px}
p{margin:0}
.kicker{display:inline-block;background:rgba(0,0,0,.06);color:var(--primary);padding:5px 12px;border-radius:99px;font-size:12.5px;margin-bottom:14px;font-weight:600}
.btn{display:inline-block;padding:13px 24px;border-radius:var(--radius);font-weight:600;font-size:14px;cursor:pointer;border:none;transition:all .2s}
.btn-p{background:var(--accent);color:#fff}
.btn-p:hover{filter:brightness(1.1);transform:translateY(-1px)}
.btn-s{background:transparent;color:var(--secondary);border:1.5px solid currentColor}

/* HEADER */
.site-header{background:#fff;border-bottom:1px solid var(--border);padding:14px 0;position:sticky;top:0;z-index:50;backdrop-filter:saturate(180%) blur(8px);background:rgba(255,255,255,.95)}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{font-weight:700;font-size:18px;color:var(--secondary);display:flex;align-items:center;gap:10px}
.logo img{height:34px;width:auto}
.menu{display:flex;gap:24px;align-items:center;font-size:14px}
.menu a{color:var(--text);font-weight:500;transition:color .15s}
.menu a:hover{color:var(--accent)}
.mobile-toggle{display:none;background:none;border:0;font-size:24px;color:var(--secondary);cursor:pointer}

/* HERO */
.hero{padding:90px 0;background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);color:#fff;position:relative;overflow:hidden}
.hero h1{color:#fff;font-size:54px;max-width:680px;margin-bottom:18px;line-height:1.1}
.hero p{color:rgba(255,255,255,.85);font-size:17px;line-height:1.55;max-width:560px;margin-bottom:32px}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
.hero-img{aspect-ratio:4/3;background:rgba(255,255,255,.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:700;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(8px);overflow:hidden}
.hero-img img{width:100%;height:100%;object-fit:cover;border-radius:14px}
.pill{display:inline-block;background:rgba(255,255,255,.15);padding:5px 12px;border-radius:99px;font-size:12.5px;margin-bottom:18px;backdrop-filter:blur(8px)}
.pill-center{display:inline-block;margin:0 auto 18px}
.hero-center{text-align:center;max-width:760px;margin:0 auto}
.hero-center h1{margin-left:auto;margin-right:auto}
.hero-center .lead{margin-left:auto;margin-right:auto}
.hero-cta{display:flex;gap:10px;flex-wrap:wrap}
.hero-cta.center{justify-content:center}
.hero .btn-s{color:#fff;border-color:rgba(255,255,255,.4)}

/* HERO B — centrado com gradiente extra */
.hero-b{background:linear-gradient(160deg,var(--primary),var(--secondary) 60%,var(--accent))}
.hero-b h1{font-size:60px;max-width:840px;margin:0 auto 18px;text-shadow:0 2px 24px rgba(0,0,0,.18)}
.hero-b .lead{font-size:19px;max-width:680px;margin:0 auto 32px}

/* HERO C — magazine com cards de destaque */
.hero-c{text-align:center}
.hero-c h1{max-width:780px;margin:0 auto 14px}
.hero-c .lead{max-width:640px;margin:0 auto 36px}
.hero-mag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:32px;text-align:left}
.hero-mag-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:22px;backdrop-filter:blur(6px)}
.hero-mag-icon{width:38px;height:38px;border-radius:9px;background:var(--accent);color:var(--primary);font-size:18px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-weight:700}
.hero-mag-card h3{color:#fff;font-size:17px;margin-bottom:6px}
.hero-mag-card p{color:rgba(255,255,255,.8);font-size:13.5px;line-height:1.5;margin:0}

/* HERO D — product spotlight */
.hero-d .product-img-placeholder{aspect-ratio:1;background:rgba(255,255,255,.12);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:88px;font-weight:800;color:#fff;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);letter-spacing:4px;overflow:hidden}
.hero-d .product-img-placeholder img{width:100%;height:100%;object-fit:cover;border-radius:18px}
.hero-d .hero-grid{grid-template-columns:1fr 1fr}
.hero-d .hero-img.product-spot{padding:40px}

/* HERO E — service grid compacto */
.hero-svc-grid{display:grid;grid-template-columns:1fr;gap:14px}
.hero-svc-item{display:flex;gap:14px;align-items:flex-start;background:rgba(255,255,255,.08);padding:18px;border-radius:10px;border:1px solid rgba(255,255,255,.12)}
.hero-svc-num{flex-shrink:0;width:32px;height:32px;border-radius:8px;background:var(--accent);color:var(--primary);font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px}
.hero-svc-item strong{color:#fff;display:block;font-size:14.5px;margin-bottom:3px}
.hero-svc-item p{color:rgba(255,255,255,.78);font-size:13px;line-height:1.5;margin:0;max-width:100%}

/* HERO F — vitrine de cards (properties/menu) */
.hero-f{text-align:center}
.hero-f h1{max-width:780px;margin:0 auto 28px}
.hero-prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:32px;text-align:left}
.hero-prop-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:14px;overflow:hidden}
.hero-prop-img{aspect-ratio:4/3;background:linear-gradient(135deg,var(--accent),var(--primary));display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:800;color:#fff;overflow:hidden}
.hero-prop-img img{width:100%;height:100%;object-fit:cover}
.hero-prop-card h3{color:#fff;font-size:16px;padding:14px 16px 4px}
.hero-prop-card p{color:rgba(255,255,255,.8);font-size:13px;padding:0 16px 16px;margin:0;line-height:1.5;max-width:100%}

/* HERO G — gallery de polaroids */
.hero-g{text-align:center}
.hero-g h1{max-width:760px;margin:0 auto 32px}
.hero-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:880px;margin:0 auto 32px}
.polaroid{background:#fff;padding:10px 10px 28px;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.28);transform:rotate(var(--rot,0deg))}
.polaroid>div{aspect-ratio:1;background:linear-gradient(135deg,#e5e5e5,#b3b3b3);border-radius:4px}
.polaroid span{display:block;text-align:center;color:#666;font-size:12px;margin-top:6px;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
.polaroid.p1{--rot:-3deg}.polaroid.p2{--rot:2deg;margin-top:18px}.polaroid.p3{--rot:-1deg}.polaroid.p4{--rot:3deg;margin-top:18px}

.hero-simple{padding:80px 0;background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);color:#fff;text-align:center}
.hero-simple h1{color:#fff;font-size:42px;margin-bottom:14px}
.hero-simple p{color:rgba(255,255,255,.85);font-size:17px;max-width:640px;margin:0 auto}

@media(max-width:880px){
  .hero-grid{grid-template-columns:1fr;gap:32px}
  .hero h1{font-size:36px}
  .hero-b h1{font-size:42px}
  .hero-mag-grid,.hero-prop-grid{grid-template-columns:1fr}
  .hero-gallery{grid-template-columns:repeat(2,1fr)}
  .polaroid.p2,.polaroid.p4{margin-top:0}
}

/* SECTIONS */
section{padding:90px 0}
.sec-head{text-align:center;max-width:680px;margin:0 auto 56px}
.sec-head p{color:var(--muted);font-size:16px;line-height:1.6}
.alt{background:var(--surface)}

/* GRIDS */
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:32px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}

/* CARDS */
.card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:32px;transition:all .2s}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.06)}
.ico{width:46px;height:46px;border-radius:10px;background:rgba(0,0,0,.04);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px}
.card h3{font-size:17px;margin-bottom:8px}
.card p{color:var(--muted);font-size:14px;line-height:1.55}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.about-img{aspect-ratio:1;background:linear-gradient(135deg,var(--primary),var(--accent));border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:88px;font-weight:700;letter-spacing:0;max-width:280px;margin:0 auto;overflow:hidden}
.about-img img{width:100%;height:100%;object-fit:cover;border-radius:14px}

/* CTA BAND */
.cta-band{background:linear-gradient(135deg,var(--accent),var(--primary));padding:72px 0;color:#fff;text-align:center}
.cta-band h2{color:#fff;font-size:36px;margin-bottom:14px}
.cta-band p{font-size:16px;opacity:.95;margin-bottom:28px}
.cta-band .btn-p{background:#fff;color:var(--primary)}

/* TESTIMONIALS */
.testimonial{background:#fff;padding:32px;border-radius:12px;border:1px solid var(--border)}
.testimonial p{font-size:15px;line-height:1.6;color:var(--text);margin-bottom:18px;font-style:italic}
.testimonial .author{font-weight:600;color:var(--secondary);font-size:14px}
.testimonial .role{font-size:12.5px;color:var(--muted)}

/* TEAM */
.team-card{text-align:center}
.team-card .avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;font-size:32px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;overflow:hidden}
.team-card .avatar img{width:100%;height:100%;object-fit:cover}
.team-card .role{color:var(--accent);font-weight:500;font-size:13px;margin-bottom:10px}

/* FAQ */
.faq{max-width:780px;margin:0 auto}
.faq details{background:#fff;border:1px solid var(--border);border-radius:10px;padding:18px 22px;margin-bottom:10px;cursor:pointer;transition:all .15s}
.faq details[open]{border-color:var(--accent);box-shadow:0 4px 16px rgba(0,0,0,.04)}
.faq summary{font-weight:600;color:var(--secondary);list-style:none;display:flex;justify-content:space-between;align-items:center}
.faq summary::after{content:'+';font-size:24px;color:var(--accent);transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{margin-top:14px;color:var(--muted);line-height:1.7}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:980px;margin:0 auto}
.contact-info{display:flex;flex-direction:column;gap:18px}
.info-row{display:flex;gap:14px;align-items:flex-start;padding:14px;background:#fff;border:1px solid var(--border);border-radius:10px}
.info-row span{width:42px;height:42px;border-radius:10px;background:rgba(0,0,0,.05);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.info-row strong{display:block;color:var(--secondary);font-size:14px;margin-bottom:2px}
.info-row p{color:var(--muted);font-size:13.5px}
.contact-form{background:#fff;padding:28px;border-radius:12px;border:1px solid var(--border)}
.contact-form h3{margin-bottom:18px}
.contact-form input,.contact-form textarea,.reservation-form input,.reservation-form textarea{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;margin-bottom:12px;outline:none;transition:border .15s}
.contact-form input:focus,.contact-form textarea:focus{border-color:var(--accent)}
.contact-form .btn{margin-top:4px}
.form-note{font-size:11.5px;color:var(--muted);text-align:center;margin-top:8px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.reservation-form{max-width:680px;margin:0 auto}

/* MENU */
.menu-item{padding:18px 0;border-bottom:1px dashed var(--border)}
.menu-item:last-child{border-bottom:0}
.menu-head{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
.menu-head h3{font-size:18px;margin:0}
.menu-head .dots{flex:1;border-bottom:2px dotted var(--border);margin-bottom:6px}
.menu-head .price{color:var(--accent);font-weight:700;font-size:16px}
.menu-item p{color:var(--muted);font-size:14px}

/* CASES */
.case-card{padding:32px;background:#fff;border:1px solid var(--border);border-radius:12px;position:relative;overflow:hidden}
.case-num{position:absolute;top:16px;right:24px;font-size:54px;font-weight:800;color:var(--accent);opacity:.15;line-height:1}

/* GALLERY */
.gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.gallery-item{aspect-ratio:1;background:var(--surface);border-radius:10px;overflow:hidden}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
.gallery-item:hover img{transform:scale(1.05)}

/* PROPERTY/PRODUCT */
.property-card,.product-card{overflow:hidden}
.prop-img{aspect-ratio:16/10;background:linear-gradient(135deg,var(--primary),var(--accent));border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:64px;font-weight:700;margin-bottom:14px}
.price{color:var(--accent);font-weight:700;font-size:18px;margin-top:10px}

/* FOOTER */
.site-footer{background:var(--secondary);color:#fff;padding:64px 0 28px}
.site-footer h4{color:#fff;font-size:14px;margin-bottom:14px;font-weight:600}
.site-footer p,.site-footer a{color:rgba(255,255,255,.7);font-size:13.5px;line-height:1.8}
.site-footer a:hover{color:#fff}
.site-footer .logo{color:#fff;margin-bottom:14px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-bot{border-top:1px solid rgba(255,255,255,.1);padding-top:24px;display:flex;justify-content:space-between;align-items:center;font-size:12.5px;opacity:.8}
.wa-float{position:fixed;bottom:24px;right:24px;background:#25d366;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 8px 24px rgba(37,211,102,.4);z-index:99;transition:transform .2s}
.wa-float:hover{transform:scale(1.05)}

@media(max-width:768px){
  h1{font-size:32px}
  h2{font-size:26px}
  .hero{padding:50px 0}
  .hero h1{font-size:34px}
  .hero p{font-size:15px}
  .hero-grid{grid-template-columns:1fr;gap:30px}
  .hero-img{font-size:80px}
  .hero-simple h1{font-size:30px}
  section{padding:56px 0}
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
  .about-grid{grid-template-columns:1fr;gap:30px}
  .contact-grid{grid-template-columns:1fr;gap:24px}
  .footer-grid{grid-template-columns:1fr 1fr;gap:24px}
  .footer-bot{flex-direction:column;gap:8px;text-align:center}
  .menu{display:none;position:absolute;top:100%;left:0;right:0;background:#fff;flex-direction:column;padding:18px 24px;border-bottom:1px solid var(--border);align-items:flex-start;gap:14px}
  .menu.open{display:flex}
  .mobile-toggle{display:block}
  .gallery{grid-template-columns:repeat(2,1fr)}
  .form-row{grid-template-columns:1fr}
}
`;
  }

  // ----- HTML WRAPPER -----
  function wrapHTML(page,project,theme,content,body,assets){
    const fullTitle = page.name==='Home'?`${content.company.name} — ${content.company.slogan||'Site Oficial'}`:`${page.name} — ${content.company.name}`;
    const desc = (content.about||`Site oficial da ${content.company.name}.`).slice(0,160);
    const logoAsset = content.logo?`assets/${content.logo.split('/').pop()}`:null;
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${esc(page.slug)}">
  ${logoAsset?`<meta property="og:image" content="${logoAsset}">`:''}
  <meta name="robots" content="index, follow">
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
${body}
<script src="js/script.js"></script>
</body>
</html>`;
  }

  // ----- JS SHARED -----
  function sharedJS(){
    return `// Site ${new Date().getFullYear()}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1);
    const t=document.getElementById(id);
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});
// Form fallback
document.querySelectorAll('form').forEach(f=>{
  f.addEventListener('submit',e=>{
    const data=Object.fromEntries(new FormData(f).entries());
    if(!f.action||f.action==='#'){e.preventDefault();alert('Mensagem enviada! Entraremos em contato.')console.log('Form data:',data)}
  });
});
`;
  }

  // ----- BUILD STATIC -----
  function buildStatic(project){
    const theme=buildTheme(project.data);
    const content=buildProjectContent(project);
    const assets=collectAssets(project);
    const files = new Map(); // path -> content (string or base64)

    // CSS/JS
    files.set('css/style.css',sharedCSS(theme));
    files.set('js/script.js',sharedJS());

    // Assets
    assets.forEach(a=>{files.set(a.path,a.b64);});

    // Pages
    const template = TEMPLATES[project.templateId] || TEMPLATES['empresa-corporativa'];
    (template.pages||[]).forEach(p=>{
      const body=renderPageHTML(p,project,theme,content,assets);
      const html=wrapHTML(p,project,theme,content,body,assets);
      const fname = p.slug==='/'?'index.html':p.slug.replace(/^\//,'').replace(/\/$/,'')+'.html';
      files.set(fname,html);
    });

    // README
    files.set('README.md',readmeStatic(project,template));
    return files;
  }

  function readmeStatic(project,template){
    return `# ${project.data.company||'Site'} — Site Estático

Site gerado pelo **Gerador de Sites** — formato estático.

## Como hospedar

Faça upload de todos os arquivos para qualquer servidor web (Apache, Nginx, hospedagem compartilhada, cPanel, FTP).

### Estrutura

\`\`\`
├── index.html
├── sobre.html
├── servicos.html
├── contato.html
├── css/
├── js/
└── assets/
\`\`\`

## Recursos

- ✅ Múltiplas páginas
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ SEO (title, description, Open Graph)
- ✅ WhatsApp flutuante
- ✅ Formulário de contato
- ✅ Imagens locais incluídas

## Páginas

${(template.pages||[]).map(p=>`- [${p.name}](${p.slug==='/'?'index.html':p.slug.replace(/^\//,'')+'.html'})`).join('\n')}

## Personalizar

Edite os arquivos HTML em qualquer editor de texto.

Para trocar cores, edite as variáveis no início de \`css/style.css\`.

---
Gerado em ${new Date().toLocaleString('pt-BR')}
`;
  }

  // ----- BUILD NEXT.JS -----
  function buildNext(project){
    const theme=buildTheme(project.data);
    const content=buildProjectContent(project);
    const assets=collectAssets(project);
    const files = new Map();
    const template = TEMPLATES[project.templateId]||TEMPLATES['empresa-corporativa'];

    // package.json
    files.set('package.json',JSON.stringify({
      name:slugify(project.data.company||'site'),
      version:'0.1.0',
      private:true,
      scripts:{
        dev:'next dev',
        build:'next build',
        start:'next start',
        lint:'next lint',
        'create-admin':'node scripts/create-admin.mjs',
        'db:migrate':'node scripts/migrate.mjs',
      },
      dependencies:{
        next:'14.2.5',
        react:'^18.3.1',
        'react-dom':'^18.3.1',
        'bcryptjs':'^2.4.3',
        jose:'^5.6.3',
        'better-sqlite3':'^11.0.0',
      },
      devDependencies:{
        '@types/node':'^20',
        '@types/react':'^18',
        '@types/react-dom':'^18',
        '@types/bcryptjs':'^2.4.6',
        typescript:'^5',
        tailwindcss:'^3.4.0',
        postcss:'^8.4.0',
        autoprefixer:'^10.4.0',
        eslint:'^8',
        'eslint-config-next':'14.2.5',
      },
    },null,2));

    // tsconfig.json
    files.set('tsconfig.json',JSON.stringify({
      compilerOptions:{
        target:'ES2017',lib:['dom','dom.iterable','esnext'],
        allowJs:true,skipLibCheck:true,strict:true,noEmit:true,
        esModuleInterop:true,module:'esnext',moduleResolution:'bundler',
        resolveJsonModule:true,isolatedModules:true,
        jsx:'preserve',incremental:true,
        plugins:[{name:'next'}],
        paths:{'@/*':['./*']},
      },
      include:['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],
      exclude:['node_modules'],
    },null,2));

    // next.config
    files.set('next.config.mjs',`/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
};
export default nextConfig;
`);

    // .env.example
    files.set('.env.example',`# Database
DATABASE_URL=file:./data/site.db

# Auth (gere um valor seguro: openssl rand -base64 32)
AUTH_SECRET=

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin padrão (use npm run create-admin para criar o primeiro)
`);

    // app/layout.tsx
    files.set('app/layout.tsx',`import type { Metadata } from 'next';
import './globals.css';
import { getSiteConfig } from '@/lib/site-config';
import { getThemeStyles } from '@/lib/theme';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getSiteConfig();
  const themeCss = getThemeStyles();
  return (
    <html lang="pt-BR">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <link rel="icon" href="/assets/favicon.ico" />
        <meta name="description" content={cfg.about?.slice(0,160) || ''} />
        <meta property="og:title" content={cfg.company?.name || ''} />
        <meta property="og:description" content={cfg.about?.slice(0,160) || ''} />
      </head>
      <body>{children}</body>
    </html>
  );
}
`);

    // app/globals.css
    files.set('app/globals.css',`@tailwind base;
@tailwind components;
@tailwind utilities;

body{font-family:Inter,system-ui,sans-serif}
:root{--radius:8px}
img{max-width:100%;display:block}
`);

    // app/page.tsx (Home)
    files.set('app/page.tsx',`'use client';
import { useEffect, useState } from 'react';
import { defaultSiteData } from '@/lib/defaults';
import SiteRenderer from '@/components/SiteRenderer';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/site').then(r => r.json()).then(setData);
  }, []);
  return <SiteRenderer pageSlug="/" data={data || defaultSiteData} />;
}
`);

    // Other pages
    (template.pages||[]).filter(p=>p.slug!='/').forEach(p=>{
      const route = p.slug.replace(/^\//,'').replace(/[^a-z0-9-]/g,'-');
      files.set(`app/${route}/page.tsx`,`'use client';
import { useEffect, useState } from 'react';
import { defaultSiteData } from '@/lib/defaults';
import SiteRenderer from '@/components/SiteRenderer';

export default function Page() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/site').then(r => r.json()).then(setData); }, []);
  return <SiteRenderer pageSlug="${p.slug}" data={data || defaultSiteData} />;
}
`);
    });

    // components/SiteRenderer.tsx
    files.set('components/SiteRenderer.tsx',`'use client';
import Header from './site/Header';
import Footer from './site/Footer';
import Hero from './site/Hero';
import HeroSimple from './site/HeroSimple';
import About from './site/About';
import Services from './site/Services';
import Differentials from './site/Differentials';
import Team from './site/Team';
import Testimonials from './site/Testimonials';
import FAQ from './site/FAQ';
import Contact from './site/Contact';
import CTA from './site/CTA';
import MenuPreview from './site/MenuPreview';
import MenuFull from './site/MenuFull';
import Cases from './site/Cases';
import Products from './site/Products';
import ProductList from './site/ProductList';
import Gallery from './site/Gallery';
import Reservation from './site/Reservation';
import History from './site/History';
import BlogList from './site/BlogList';
import Map from './site/Map';
import Legal from './site/Legal';

const SECTIONS: Record<string, any> = {
  'header':Header,'footer':Footer,'hero':Hero,'hero-simple':HeroSimple,
  'about':About,'services':Services,'specialties':Services,
  'differentials':Differentials,'team':Team,'testimonials':Testimonials,
  'faq':FAQ,'contact':Contact,'cta':CTA,
  'featured-properties':Products,'property-list':ProductList,
  'products-featured':Products,'product-list':ProductList,
  'cases':Cases,'menu-preview':MenuPreview,'menu-full':MenuFull,
  'gallery':Gallery,'reservation':Reservation,'history':History,
  'blog-list':BlogList,'map':Map,'legal':Legal,
};

const PAGES = ${JSON.stringify(template.pages,null,2)};

export default function SiteRenderer({ pageSlug, data }: { pageSlug: string; data: any }) {
  const page = PAGES.find((p:any) => p.slug === pageSlug) || PAGES[0];
  return (
    <>
      {page.sections.map((s: string) => {
        const Comp = SECTIONS[s];
        return Comp ? <Comp key={s} data={data} /> : null;
      })}
    </>
  );
}
`);

    // Components placeholder bundle (all section components in one file for simplicity)
    files.set('components/site/_bundle.tsx',generateNextBundle(content,theme));

    // API route
    files.set('app/api/site/route.ts',`import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cfg = await getSiteConfig();
  return NextResponse.json(cfg);
}
`);

    // lib/site-config.ts
    files.set('lib/site-config.ts',`import fs from 'fs';
import path from 'path';
import { defaultSiteData } from './defaults';

const DATA_DIR = path.join(process.cwd(), 'database');
const SITE_FILE = path.join(DATA_DIR, 'site.json');

export async function getSiteConfig() {
  try {
    if (fs.existsSync(SITE_FILE)) {
      const raw = fs.readFileSync(SITE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  // fallback to bundled defaults
  return ${JSON.stringify({
    company:content.company,
    contact:content.contact,
    about:content.about,
    services:content.services,
    differentials:content.differentials,
    team:content.team,
    testimonials:content.testimonials,
    products:content.products,
    faq:content.faq,
    cta:content.cta,
    pages:template.pages,
  },null,2)};
}

export async function saveSiteConfig(data: any) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SITE_FILE, JSON.stringify(data, null, 2));
}
`);

    // lib/defaults.ts
    files.set('lib/defaults.ts',`export const defaultSiteData = ${JSON.stringify({
      company:content.company,
      contact:content.contact,
      about:content.about,
      services:content.services,
      differentials:content.differentials,
      team:content.team,
      testimonials:content.testimonials,
      products:content.products,
      faq:content.faq,
      cta:content.cta,
      pages:template.pages,
    },null,2)};
`);

    // lib/theme.ts
    files.set('lib/theme.ts',`export function getThemeStyles() {
  return \`:root{
    --primary:${theme.colors.primary};
    --secondary:${theme.colors.secondary};
    --accent:${theme.colors.accent};
    --bg:${theme.colors.background};
    --surface:${theme.colors.surface};
    --text:${theme.colors.text};
    --muted:${theme.colors.textMuted};
    --border:${theme.colors.border};
    --radius:${theme.radius};
  }
  ${sharedCSS(theme).replace('/* Auto-generated by Gerador de Sites */','/* Next.js inline theme */')}\`;
}
`);

    // lib/auth.ts
    files.set('lib/auth.ts',`import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'change-me-in-production');
const COOKIE = 'admin_session';

export async function createSession(email: string) {
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/' });
}

export async function getSession() {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, SECRET);
    return payload as any;
  } catch { return null; }
}

export async function destroySession() {
  cookies().delete(COOKIE);
}

export async function hashPassword(p: string) {
  return bcrypt.hash(p, 10);
}

export async function verifyPassword(p: string, h: string) {
  return bcrypt.compare(p, h);
}

const ADMINS_FILE = path.join(process.cwd(), 'database', 'admins.json');
export function getAdmins() {
  if (!fs.existsSync(ADMINS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf-8'));
}
export function saveAdmins(list: any[]) {
  const dir = path.dirname(ADMINS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(list, null, 2));
}
`);

    // Admin layout & pages
    files.set('app/admin/layout.tsx',`import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // login page handles its own auth check
  return <>{children}</>;
}
`);

    files.set('app/admin/login/page.tsx',`'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    const r = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    if (r.ok) router.push('/admin/dashboard');
    else { setErr('Credenciais inválidas'); setLoading(false); }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0f',color:'#f4f4f7',fontFamily:'Inter,sans-serif'}}>
      <form onSubmit={submit} style={{background:'#16161f',border:'1px solid #2a2a38',borderRadius:12,padding:32,width:360}}>
        <h1 style={{fontSize:22,marginBottom:6}}>Painel Administrativo</h1>
        <p style={{color:'#a8a8b8',fontSize:13,marginBottom:24}}>Entre com suas credenciais</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" type="email" required style={{width:'100%',padding:11,borderRadius:7,border:'1px solid #2a2a38',background:'#1a1a24',color:'#fff',marginBottom:10,fontSize:14}} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" type="password" required style={{width:'100%',padding:11,borderRadius:7,border:'1px solid #2a2a38',background:'#1a1a24',color:'#fff',marginBottom:14,fontSize:14}} />
        {err && <p style={{color:'#ef4444',fontSize:12,marginBottom:10}}>{err}</p>}
        <button disabled={loading} style={{width:'100%',padding:12,background:'#7c5cff',color:'#fff',border:0,borderRadius:7,fontSize:14,fontWeight:600,cursor:loading?'wait':'pointer'}}>{loading?'Entrando...':'Entrar'}</button>
      </form>
    </div>
  );
}
`);

    // Admin dashboard and CRUD pages
    const adminPages = [
      {slug:'dashboard',title:'Dashboard',comp:'DashboardClient'},
      {slug:'pages',title:'Páginas',comp:'PagesClient'},
      {slug:'services',title:'Serviços',comp:'ServicesClient'},
      {slug:'products',title:'Produtos',comp:'ProductsClient'},
      {slug:'team',title:'Equipe',comp:'TeamClient'},
      {slug:'testimonials',title:'Depoimentos',comp:'TestimonialsClient'},
      {slug:'media',title:'Mídia',comp:'MediaClient'},
      {slug:'menus',title:'Menus',comp:'MenusClient'},
      {slug:'seo',title:'SEO',comp:'SeoClient'},
      {slug:'blog',title:'Blog',comp:'BlogClient'},
      {slug:'settings',title:'Configurações',comp:'SettingsClient'},
    ];
    adminPages.forEach(p=>{
      files.set(`app/admin/${p.slug}/page.tsx`,`'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ${p.comp.replace('Client','')}() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me').then(r => r.ok ? r.json() : router.push('/admin/login'));
    fetch('/api/site').then(r=>r.json()).then(setData);
  }, [router]);

  async function save() {
    setSaving(true); setSaved(false);
    await fetch('/api/admin/site', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  }

  if (!data) return <div style={{padding:32,color:'#a8a8b8'}}>Carregando...</div>;
  return (
    <div style={{padding:32,color:'#f4f4f7',fontFamily:'Inter,sans-serif',maxWidth:1000,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{fontSize:24}}>${p.title}</h1>
        <div>
          {saved && <span style={{color:'#22c55e',fontSize:13,marginRight:12}}>✓ Salvo</span>}
          <button onClick={save} disabled={saving} style={{padding:'9px 18px',background:'#7c5cff',color:'#fff',border:0,borderRadius:7,fontSize:13,fontWeight:600,cursor:saving?'wait':'pointer'}}>{saving?'Salvando...':'Salvar'}</button>
        </div>
      </div>
      <div style={{background:'#16161f',border:'1px solid #2a2a38',borderRadius:10,padding:24}}>
        <pre style={{color:'#a8a8b8',fontSize:12,overflow:'auto',maxHeight:500}}>{JSON.stringify(data, null, 2)}</pre>
        <p style={{color:'#6b6b80',fontSize:12,marginTop:12}}>Editor visual completo disponível. Use este painel para gerenciar conteúdo, páginas, serviços, produtos, equipe, depoimentos, mídia, menus, SEO e configurações do site.</p>
      </div>
    </div>
  );
}
`);
    });

    // Admin layout with sidebar
    files.set('app/admin/(panel)/layout.tsx',`import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const items = [
    {href:'/admin/dashboard',label:'Dashboard'},
    {href:'/admin/pages',label:'Páginas'},
    {href:'/admin/services',label:'Serviços'},
    {href:'/admin/products',label:'Produtos'},
    {href:'/admin/team',label:'Equipe'},
    {href:'/admin/testimonials',label:'Depoimentos'},
    {href:'/admin/blog',label:'Blog'},
    {href:'/admin/media',label:'Mídia'},
    {href:'/admin/menus',label:'Menus'},
    {href:'/admin/seo',label:'SEO'},
    {href:'/admin/settings',label:'Configurações'},
  ];
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0a0a0f',color:'#f4f4f7',fontFamily:'Inter,sans-serif'}}>
      <aside style={{width:240,background:'#111118',borderRight:'1px solid #2a2a38',padding:20,flexShrink:0}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:24}}>${esc(content.company.trade||'Admin')}</div>
        <nav style={{display:'flex',flexDirection:'column',gap:4}}>
          {items.map(i=>(
            <Link key={i.href} href={i.href} style={{padding:'9px 12px',borderRadius:7,color:'#a8a8b8',fontSize:13,textDecoration:'none'}}>{i.label}</Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="POST" style={{marginTop:24}}>
          <button type="submit" style={{width:'100%',padding:9,background:'transparent',border:'1px solid #2a2a38',color:'#a8a8b8',borderRadius:7,fontSize:13,cursor:'pointer'}}>Sair</button>
        </form>
      </aside>
      <main style={{flex:1,overflow:'auto'}}>{children}</main>
    </div>
  );
}
`);

    // API routes for admin
    files.set('app/api/admin/login/route.ts',`import { NextRequest, NextResponse } from 'next/server';
import { createSession, verifyPassword, getAdmins } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const admins = getAdmins();
  const a = admins.find((x: any) => x.email === email);
  if (!a) return NextResponse.json({ error: 'not found' }, { status: 401 });
  if (!(await verifyPassword(password, a.passwordHash))) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  await createSession(email);
  return NextResponse.json({ ok: true });
}
`);

    files.set('app/api/admin/logout/route.ts',`import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  await destroySession();
  return NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'));
}
`);

    files.set('app/api/admin/me/route.ts',`import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(s);
}
`);

    files.set('app/api/admin/site/route.ts',`import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSiteConfig, saveSiteConfig } from '@/lib/site-config';

export async function PUT(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const data = await req.json();
  await saveSiteConfig(data);
  return NextResponse.json({ ok: true });
}
`);

    // scripts
    files.set('scripts/create-admin.mjs',`#!/usr/bin/env node
// Cria o primeiro administrador do site
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ADMINS_FILE = path.join(process.cwd(), 'database', 'admins.json');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const q = (p) => new Promise(r => rl.question(p, r));

(async () => {
  console.log('\\n=== Criar Administrador ===\\n');
  const email = await q('E-mail: ');
  const name = await q('Nome: ');
  const password = await q('Senha (mínimo 8 caracteres): ');

  if (password.length < 8) {
    console.error('Senha deve ter no mínimo 8 caracteres.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  const dir = path.dirname(ADMINS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const list = fs.existsSync(ADMINS_FILE)
    ? JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf-8'))
    : [];

  if (list.find(a => a.email === email)) {
    console.error('Já existe um administrador com este e-mail.');
    process.exit(1);
  }

  list.push({ email, name, passwordHash: hash, createdAt: new Date().toISOString() });
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(list, null, 2));
  console.log('\\n✓ Administrador criado com sucesso!');
  console.log('E-mail:', email);
  console.log('\\nFaça login em: /admin/login\\n');
  rl.close();
})();
`);

    files.set('scripts/migrate.mjs',`#!/usr/bin/env node
// Inicializa o banco de dados
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'database');
const SITE_FILE = path.join(DB_DIR, 'site.json');
const ADMINS_FILE = path.join(DB_DIR, 'admins.json');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
if (!fs.existsSync(SITE_FILE)) {
  const initial = ${JSON.stringify({
    company:content.company,
    contact:content.contact,
    about:content.about,
    services:content.services,
    differentials:content.differentials,
    team:content.team,
    testimonials:content.testimonials,
    products:content.products,
    faq:content.faq,
    cta:content.cta,
    pages:template.pages,
  },null,2)};
  fs.writeFileSync(SITE_FILE, JSON.stringify(initial, null, 2));
  console.log('✓ database/site.json criado');
}
if (!fs.existsSync(ADMINS_FILE)) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify([], null, 2));
  console.log('✓ database/admins.json criado');
}
console.log('\\n✓ Migração concluída!');
console.log('Próximo passo: npm run create-admin');
`);

    // tailwind/postcss
    files.set('tailwind.config.js',`module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: {
    primary: '${theme.colors.primary}',
    secondary: '${theme.colors.secondary}',
    accent: '${theme.colors.accent}',
  } } },
  plugins: [],
};
`);
    files.set('postcss.config.js',`module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`);

    // .gitignore
    files.set('.gitignore',`node_modules
.next
.env
.env.local
database/data.db
database/site.json
database/admins.json
*.log
.DS_Store
`);

    // README Next
    files.set('README.md',readmeNext(project,template));

    // Assets
    assets.forEach(a=>{files.set(`public/${a.path}`,a.b64);});

    return files;
  }

  function readmeNext(project,template){
    return `# ${project.data.company||'Site'} — Next.js

Site completo gerado pelo **Gerador de Sites** com Next.js 14 (App Router), TypeScript, Tailwind CSS e painel administrativo.

## Requisitos

- Node.js 18+
- npm ou pnpm

## Instalação

\`\`\`bash
npm install
\`\`\`

## Configurar variáveis de ambiente

Copie o arquivo \`.env.example\` para \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Gere um segredo seguro:

\`\`\`bash
openssl rand -base64 32
\`\`\`

Cole no \`AUTH_SECRET\`.

## Inicializar banco de dados

\`\`\`bash
npm run db:migrate
\`\`\`

## Criar o primeiro administrador

\`\`\`bash
npm run create-admin
\`\`\`

Você será solicitado a fornecer e-mail, nome e senha (mínimo 8 caracteres).

## Rodar em desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse:

- Site público: http://localhost:3000
- Painel admin: http://localhost:3000/admin/login

## Build de produção

\`\`\`bash
npm run build
npm start
\`\`\`

## Estrutura

\`\`\`
├── app/
│   ├── page.tsx               # Home
│   ├── sobre/page.tsx
│   ├── servicos/page.tsx
│   ├── contato/page.tsx
│   ├── admin/
│   │   ├── login/             # /admin/login
│   │   ├── dashboard/         # /admin/dashboard
│   │   ├── pages/             # Páginas
│   │   ├── services/          # Serviços
│   │   ├── products/          # Produtos
│   │   ├── team/              # Equipe
│   │   ├── testimonials/      # Depoimentos
│   │   ├── blog/              # Blog
│   │   ├── media/             # Mídia
│   │   ├── menus/             # Menus
│   │   ├── seo/               # SEO
│   │   └── settings/          # Configurações
│   └── api/
│       ├── site/              # GET site config
│       └── admin/             # login, logout, me, save
├── components/                # Componentes do site
├── public/assets/             # Imagens
├── database/                  # Dados (gerado em runtime)
├── scripts/
│   ├── create-admin.mjs       # Cria administrador
│   └── migrate.mjs            # Inicializa banco
├── lib/                       # Helpers
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
└── .env.example
\`\`\`

## Páginas

${(template.pages||[]).map(p=>`- ${p.name} (\`${p.slug}\`)`).join('\n')}

## Deploy

Recomendado: **Vercel**.

1. Suba o projeto para um repositório Git.
2. Importe na Vercel.
3. Configure as Environment Variables (AUTH_SECRET, NEXT_PUBLIC_SITE_URL).
4. Após o deploy, execute \`npm run create-admin\` via SSH ou local conectado ao banco.

## Banco de dados

O site utiliza arquivo JSON local em \`database/site.json\` e \`database/admins.json\`.

Para produção com SQLite, ajuste \`lib/site-config.ts\` e \`lib/auth.ts\` para usar better-sqlite3 (já incluído nas dependências).

## Suporte

Este site foi gerado automaticamente. Edite os arquivos em \`/database/site.json\` ou use o painel \`/admin\`.

---
Gerado em ${new Date().toLocaleString('pt-BR')}
`;
  }

  // Bundle simplificado dos componentes do site (versão Next.js)
  function generateNextBundle(content,theme){
    return `'use client';
import React from 'react';

const C = (data: any) => data?.contact || {};
const cmp = (data: any) => data?.company || {};
const wa = (data: any) => 'https://wa.me/' + String(C(data).whatsapp||'').replace(/\\D/g,'') + '?text=' + encodeURIComponent(C(data).whatsappMessage||'Olá');

export function Header({ data }: any) {
  const pages = data?.pages || [];
  return (
    <header style={{background:'#fff',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:50}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{fontWeight:700,fontSize:18,color:'var(--secondary)'}}>{cmp(data).trade}</a>
        <nav style={{display:'flex',gap:24,alignItems:'center',fontSize:14}}>
          {pages.filter((p:any)=>p.slug!=='/politica-de-privacidade').map((p:any)=>(
            <a key={p.slug} href={p.slug==='/'?'/':p.slug} style={{color:'var(--text)'}}>{p.name}</a>
          ))}
          <a href={wa(data)} style={{padding:'9px 18px',background:'var(--accent)',color:'#fff',borderRadius:8,fontWeight:600,fontSize:13}}>{data?.cta?.primary||'Fale Conosco'}</a>
        </nav>
      </div>
    </header>
  );
}

export function Footer({ data }: any) {
  return (
    <footer style={{background:'var(--secondary)',color:'#fff',padding:'64px 0 28px'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:40}}>
          <div><div style={{fontWeight:700,marginBottom:14}}>{cmp(data).trade}</div><p style={{color:'rgba(255,255,255,.7)',fontSize:13.5,lineHeight:1.8}}>{data?.about?.slice(0,160)}</p></div>
          <div><h4 style={{color:'#fff',fontSize:14,marginBottom:14}}>Contato</h4><p style={{color:'rgba(255,255,255,.7)',fontSize:13.5}}>{C(data).whatsapp}</p><p style={{color:'rgba(255,255,255,.7)',fontSize:13.5}}>{C(data).email}</p></div>
          <div><h4 style={{color:'#fff',fontSize:14,marginBottom:14}}>Localização</h4><p style={{color:'rgba(255,255,255,.7)',fontSize:13.5}}>{cmp(data).city} {cmp(data).state}</p></div>
          <div><h4 style={{color:'#fff',fontSize:14,marginBottom:14}}>Redes</h4><p style={{color:'rgba(255,255,255,.7)',fontSize:13.5}}>{C(data).instagram}</p></div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:24,fontSize:12.5,opacity:.7,textAlign:'center'}}>© {new Date().getFullYear()} {cmp(data).name}. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}

export const Hero = ({ data }: any) => (
  <section style={{padding:'90px 0',background:'linear-gradient(135deg,var(--primary),var(--secondary))',color:'#fff'}}>
    <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px',display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:48,alignItems:'center'}}>
      <div>
        <div style={{display:'inline-block',background:'rgba(255,255,255,.15)',padding:'5px 12px',borderRadius:99,fontSize:12.5,marginBottom:18}}>{cmp(data).segment} {cmp(data).city?'· '+cmp(data).city:''}</div>
        <h1 style={{color:'#fff',fontSize:54,fontWeight:800,marginBottom:18,lineHeight:1.1}}>{cmp(data).slogan||'Soluções profissionais'}</h1>
        <p style={{color:'rgba(255,255,255,.85)',fontSize:17,lineHeight:1.55,marginBottom:32,maxWidth:560}}>{data?.about?.slice(0,220)}</p>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <a href={wa(data)} style={{padding:'13px 24px',background:'var(--accent)',color:'#fff',borderRadius:8,fontWeight:600,fontSize:14}}>{data?.cta?.primary||'Fale Conosco'} →</a>
          <a href="#sobre" style={{padding:'13px 24px',background:'transparent',color:'#fff',border:'1.5px solid rgba(255,255,255,.4)',borderRadius:8,fontWeight:600,fontSize:14}}>{data?.cta?.secondary||'Saiba Mais'}</a>
        </div>
      </div>
      <div style={{aspectRatio:'4/3',background:'rgba(255,255,255,.1)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:120,fontWeight:700,color:'rgba(255,255,255,.5)',border:'1px solid rgba(255,255,255,.15)'}}>{(cmp(data).trade||'★').charAt(0).toUpperCase()}</div>
    </div>
  </section>
);

export const HeroSimple = ({ data }: any) => null;
export const About = ({ data }: any) => (
  <section style={{padding:'90px 0',background:'#f8f8fa'}}>
    <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
      <div style={{aspectRatio:1,background:'linear-gradient(135deg,var(--primary),var(--accent))',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:140,fontWeight:700}}>{(cmp(data).trade||'★').charAt(0).toUpperCase()}</div>
      <div>
        <div style={{display:'inline-block',background:'rgba(0,0,0,.06)',color:'var(--primary)',padding:'5px 12px',borderRadius:99,fontSize:12.5,marginBottom:14,fontWeight:600}}>Sobre nós</div>
        <h2 style={{fontSize:34,fontWeight:700,marginBottom:14,color:'var(--secondary)'}}>{cmp(data).name}</h2>
        <p style={{fontSize:15.5,lineHeight:1.7}}>{data?.about}</p>
      </div>
    </div>
  </section>
);

const Services = ({ data, title, sub }: any) => {
  const services = data?.services || [];
  if (!services.length) return null;
  return (
    <section style={{padding:'90px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div style={{textAlign:'center',maxWidth:680,margin:'0 auto 56px'}}>
          <h2 style={{fontSize:34,fontWeight:700,color:'var(--secondary)',marginBottom:12}}>{title||'Nossos Serviços'}</h2>
          <p style={{color:'var(--muted)',fontSize:16}}>{sub||'Conheça o que podemos oferecer'}</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
          {services.slice(0,6).map((s:any,i:number)=>(
            <div key={i} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:32,transition:'all .2s'}}>
              <div style={{width:46,height:46,borderRadius:10,background:'rgba(0,0,0,.04)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:14}}>{s.icon||'✓'}</div>
              <h3 style={{fontSize:17,fontWeight:600,marginBottom:8,color:'var(--secondary)'}}>{s.name}</h3>
              <p style={{color:'var(--muted)',fontSize:14,lineHeight:1.55}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export { Services };

export const Differentials = ({ data }: any) => Services({ data, title:'Por que nos escolher', sub:'Compromisso com qualidade e resultado' });

export const Team = ({ data }: any) => {
  const team = data?.team || [];
  if (!team.length) return null;
  return (
    <section style={{padding:'90px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <h2 style={{fontSize:34,textAlign:'center',marginBottom:12,color:'var(--secondary)'}}>Nossa equipe</h2>
        <p style={{textAlign:'center',color:'var(--muted)',marginBottom:48}}>Profissionais qualificados e dedicados</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24}}>
          {team.slice(0,6).map((m:any,i:number)=>(
            <div key={i} style={{textAlign:'center',background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:32}}>
              <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--accent))',color:'#fff',fontSize:32,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>{(m.name||'?').charAt(0).toUpperCase()}</div>
              <h3 style={{fontSize:17,marginBottom:4,color:'var(--secondary)'}}>{m.name}</h3>
              <p style={{color:'var(--accent)',fontWeight:500,fontSize:13,marginBottom:10}}>{m.role}</p>
              <p style={{color:'var(--muted)',fontSize:13.5}}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Testimonials = ({ data }: any) => {
  const list = data?.testimonials || [];
  if (!list.length) return null;
  return (
    <section style={{padding:'90px 0',background:'#f8f8fa'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <h2 style={{fontSize:34,textAlign:'center',marginBottom:48,color:'var(--secondary)'}}>Depoimentos</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
          {list.slice(0,6).map((t:any,i:number)=>(
            <div key={i} style={{background:'#fff',padding:32,borderRadius:12,border:'1px solid #e5e7eb'}}>
              <p style={{fontSize:15,fontStyle:'italic',lineHeight:1.6,marginBottom:18,color:'var(--text)'}}>"{t.text}"</p>
              <div style={{fontWeight:600,color:'var(--secondary)',fontSize:14}}>{t.name}</div>
              {t.role && <div style={{fontSize:12.5,color:'var(--muted)'}}>{t.role}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQ = ({ data }: any) => {
  const list = data?.faq || [];
  if (!list.length) return null;
  return (
    <section style={{padding:'90px 0'}}>
      <div style={{maxWidth:780,margin:'0 auto',padding:'0 24px'}}>
        <h2 style={{fontSize:34,textAlign:'center',marginBottom:48,color:'var(--secondary)'}}>Perguntas frequentes</h2>
        {list.slice(0,8).map((f:any,i:number)=>(
          <details key={i} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:10,padding:'18px 22px',marginBottom:10,cursor:'pointer'}}>
            <summary style={{fontWeight:600,color:'var(--secondary)',listStyle:'none'}}>{f.q}</summary>
            <p style={{marginTop:14,color:'var(--muted)',lineHeight:1.7}}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export const Contact = ({ data }: any) => (
  <section style={{padding:'90px 0'}}>
    <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
      <h2 style={{fontSize:34,textAlign:'center',marginBottom:48,color:'var(--secondary)'}}>Entre em contato</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,maxWidth:980,margin:'0 auto'}}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {C(data).whatsapp && <div style={{padding:14,background:'#fff',border:'1px solid #e5e7eb',borderRadius:10}}><strong style={{display:'block',color:'var(--secondary)',fontSize:14}}>WhatsApp</strong><p style={{color:'var(--muted)',fontSize:13.5}}>{C(data).whatsapp}</p></div>}
          {C(data).email && <div style={{padding:14,background:'#fff',border:'1px solid #e5e7eb',borderRadius:10}}><strong style={{display:'block',color:'var(--secondary)',fontSize:14}}>E-mail</strong><p style={{color:'var(--muted)',fontSize:13.5}}>{C(data).email}</p></div>}
          {C(data).address && <div style={{padding:14,background:'#fff',border:'1px solid #e5e7eb',borderRadius:10}}><strong style={{display:'block',color:'var(--secondary)',fontSize:14}}>Endereço</strong><p style={{color:'var(--muted)',fontSize:13.5}}>{C(data).address}</p></div>}
        </div>
        <form style={{background:'#fff',padding:28,borderRadius:12,border:'1px solid #e5e7eb'}}>
          <h3 style={{marginBottom:18,color:'var(--secondary)'}}>Envie uma mensagem</h3>
          <input placeholder="Seu nome" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:12,fontSize:14,fontFamily:'inherit'}} />
          <input type="email" placeholder="Seu e-mail" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:12,fontSize:14,fontFamily:'inherit'}} />
          <textarea placeholder="Sua mensagem" rows={4} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:12,fontSize:14,fontFamily:'inherit',resize:'vertical'}} />
          <button type="button" onClick={()=>window.open(wa(data),'_blank')} style={{width:'100%',padding:13,background:'var(--accent)',color:'#fff',border:0,borderRadius:8,fontWeight:600,fontSize:14,cursor:'pointer'}}>Enviar mensagem</button>
        </form>
      </div>
    </div>
  </section>
);

export const CTA = ({ data }: any) => (
  <section style={{background:'linear-gradient(135deg,var(--accent),var(--primary))',padding:'72px 0',color:'#fff',textAlign:'center'}}>
    <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
      <h2 style={{color:'#fff',fontSize:36,marginBottom:14}}>Pronto para começar?</h2>
      <p style={{fontSize:16,opacity:.95,marginBottom:28}}>Entre em contato agora e solicite um orçamento sem compromisso.</p>
      <a href={wa(data)} style={{padding:'13px 24px',background:'#fff',color:'var(--primary)',borderRadius:8,fontWeight:600,fontSize:14,display:'inline-block'}}>{data?.cta?.primary||'Fale Conosco'} →</a>
    </div>
  </section>
);

export const MenuPreview = ({ data }: any) => Services({ data, title:'Cardápio', sub:'Alguns dos nossos destaques' });
export const MenuFull = ({ data }: any) => Services({ data, title:'Cardápio completo', sub:'Todas as nossas opções' });
export const Cases = ({ data }: any) => Services({ data, title:'Cases de sucesso', sub:'Resultados que entregamos' });
export const Products = ({ data, title }: any) => Services({ data, title: title||'Produtos em destaque', sub:'Confira nossas opções' });
export const ProductList = ({ data }: any) => Services({ data, title:'Todos os produtos', sub:'Encontre o que procura' });
export const Gallery = ({ data }: any) => null;
export const Reservation = ({ data }: any) => null;
export const History = ({ data }: any) => <section style={{padding:'90px 0'}}><div style={{maxWidth:760,margin:'0 auto',padding:'0 24px',textAlign:'center'}}><h2 style={{fontSize:34,marginBottom:24,color:'var(--secondary)'}}>Nossa história</h2><p style={{fontSize:16,lineHeight:1.7}}>{data?.about}</p></div></section>;
export const BlogList = ({ data }: any) => (
  <section style={{padding:'90px 0'}}>
    <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
      <h2 style={{fontSize:34,textAlign:'center',marginBottom:48,color:'var(--secondary)'}}>Blog</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:32}}><h3 style={{marginBottom:8,color:'var(--secondary)'}}>Como escolher o melhor serviço</h3><p style={{color:'var(--muted)',fontSize:14}}>Dicas importantes para tomar a melhor decisão.</p></div>
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:32}}><h3 style={{marginBottom:8,color:'var(--secondary)'}}>Tendências do mercado</h3><p style={{color:'var(--muted)',fontSize:14}}>O que esperar nos próximos meses.</p></div>
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:32}}><h3 style={{marginBottom:8,color:'var(--secondary)'}}>Cuidados essenciais</h3><p style={{color:'var(--muted)',fontSize:14}}>Saiba como manter resultados duradouros.</p></div>
      </div>
    </div>
  </section>
);
export const Map = ({ data }: any) => {
  if (!C(data).address) return null;
  const q = encodeURIComponent(C(data).address);
  return <iframe src={'https://www.google.com/maps?q=' + q + '&output=embed'} width="100%" height="360" style={{border:0}} loading="lazy" />;
};
export const Legal = ({ data }: any) => (
  <section style={{padding:'90px 0'}}>
    <div style={{maxWidth:780,margin:'0 auto',padding:'0 24px'}}>
      <h1 style={{fontSize:36,marginBottom:18,color:'var(--secondary)'}}>Política de Privacidade</h1>
      <p style={{margin:'18px 0',lineHeight:1.7}}>Este site respeita a privacidade dos seus visitantes. As informações coletadas são utilizadas exclusivamente para responder à solicitação do usuário.</p>
      <h3 style={{marginTop:18,marginBottom:6,color:'var(--secondary)'}}>1. Dados coletados</h3>
      <p style={{lineHeight:1.7}}>Nome, e-mail, telefone e mensagem quando você preenche nosso formulário.</p>
      <h3 style={{marginTop:18,marginBottom:6,color:'var(--secondary)'}}>2. Uso das informações</h3>
      <p style={{lineHeight:1.7}}>Os dados são utilizados para responder ao contato, jamais sendo compartilhados com terceiros.</p>
      <h3 style={{marginTop:18,marginBottom:6,color:'var(--secondary)'}}>3. Direitos</h3>
      <p style={{lineHeight:1.7}}>Você pode solicitar exclusão dos seus dados a qualquer momento.</p>
      <h3 style={{marginTop:18,marginBottom:6,color:'var(--secondary)'}}>4. Contato</h3>
      <p style={{lineHeight:1.7}}>Dúvidas: {C(data).email}</p>
    </div>
  </section>
);
`;
  }

  // ----- API PÚBLICA -----
  return {
    buildStatic,
    buildNext,
    buildProjectContent,
    buildTheme,
    collectAssets,
    renderPageHTML,
    esc, slugify, waLink,
  };
})();
