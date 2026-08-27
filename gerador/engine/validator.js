/* ==========================================================================
   SITE VALIDATOR — Verifica estrutura, HTML, SEO, assets, links, placeholders
   ========================================================================== */

const SiteValidator = (()=>{
  const PLACEHOLDERS = [
    /lorem ipsum/i,
    /insira (sua|aqui)/i,
    /nome da empresa/i,
    /empresa xyz/i,
    /seu texto aqui/i,
    /coloque seu texto/i,
    /\[empresa\]/i,
    /\[nome\]/i,
    /example\.com/i,
    /placeholder/i,
  ];

  function validate(files, project, format){
    const issues = []; // {level:'ok'|'warn'|'error', message, file?}
    const tpl = TEMPLATES[project.templateId]||TEMPLATES['empresa-corporativa'];

    // 1. Estrutura básica
    if(format==='next'){
      const required = ['package.json','app/page.tsx','app/layout.tsx','app/globals.css','tsconfig.json','next.config.mjs','README.md','.env.example'];
      required.forEach(p=>{
        if(files.has(p))issues.push({level:'ok',message:`Arquivo obrigatório: ${p}`});
        else issues.push({level:'error',message:`Arquivo ausente: ${p}`});
      });
      // Admin
      ['app/admin/login/page.tsx','app/api/admin/login/route.ts','app/api/admin/site/route.ts','scripts/create-admin.mjs'].forEach(p=>{
        if(files.has(p))issues.push({level:'ok',message:`Admin: ${p}`});
        else issues.push({level:'error',message:`Admin ausente: ${p}`});
      });
      // Pages
      tpl.pages.forEach(p=>{
        const path = p.slug==='/'?'app/page.tsx':`app/${p.slug.replace(/^\//,'').replace(/[^a-z0-9-]/g,'-')}/page.tsx`;
        if(files.has(path))issues.push({level:'ok',message:`Página: ${p.name}`});
        else issues.push({level:'warn',message:`Página ausente: ${p.name}`});
      });
    } else {
      // Static
      if(files.has('index.html'))issues.push({level:'ok',message:'index.html presente'});
      else issues.push({level:'error',message:'index.html ausente'});
      tpl.pages.forEach(p=>{
        const fname = p.slug==='/'?'index.html':p.slug.replace(/^\//,'').replace(/[^a-z0-9-]/g,'-')+'.html';
        if(files.has(fname))issues.push({level:'ok',message:`Página: ${p.name}`});
        else issues.push({level:'warn',message:`Página ausente: ${p.name}`});
      });
      if(files.has('css/style.css'))issues.push({level:'ok',message:'CSS presente'});
      else issues.push({level:'error',message:'CSS ausente'});
      if(files.has('js/script.js'))issues.push({level:'ok',message:'JS presente'});
      else issues.push({level:'warn',message:'JS ausente (opcional)'});
    }

    // 2. Assets
    let assetCount=0;
    files.forEach((v,k)=>{if(k.startsWith('assets/')||k.startsWith('public/assets/'))assetCount++});
    if(assetCount>0)issues.push({level:'ok',message:`${assetCount} assets incluídos`});
    else if(project.data.logo||(project.data.images||[]).length)issues.push({level:'warn',message:'Nenhum asset binário no projeto'});

    // 3. HTML checks (parse todas as páginas HTML)
    files.forEach((content,path)=>{
      if(typeof content!=='string')return;
      if(!path.endsWith('.html')&&!path.endsWith('.tsx')&&!path.endsWith('.ts'))return;
      if(!path.endsWith('.html'))return;
      // title
      if(/<title>[^<]+<\/title>/.test(content))issues.push({level:'ok',message:`SEO title: ${path}`,file:path});
      else issues.push({level:'error',message:`Sem <title>: ${path}`,file:path});
      // description
      if(/<meta name="description"/.test(content))issues.push({level:'ok',message:`Meta description: ${path}`,file:path});
      else issues.push({level:'warn',message:`Sem meta description: ${path}`,file:path});
      // og
      if(/og:title/.test(content))issues.push({level:'ok',message:`Open Graph: ${path}`,file:path});
      // viewport
      if(/viewport/.test(content))issues.push({level:'ok',message:`Viewport responsivo: ${path}`,file:path});
      else issues.push({level:'error',message:`Sem viewport: ${path}`,file:path});
      // h1
      const h1s=(content.match(/<h1[\s>]/g)||[]).length;
      if(h1s>=1)issues.push({level:'ok',message:`H1 presente (${h1s}): ${path}`,file:path});
      else issues.push({level:'warn',message:`Sem H1: ${path}`,file:path});
      // whatsapp link
      if(/wa\.me/.test(content))issues.push({level:'ok',message:`WhatsApp integrado: ${path}`,file:path});
      // placeholders (ignorar atributo placeholder="...")
      const stripped = content.replace(/placeholder=["'][^"']*["']/g,'').replace(/<input[^>]*>/g,'');
      PLACEHOLDERS.forEach(re=>{
        if(re.test(stripped))issues.push({level:'error',message:`Placeholder detectado em ${path}: ${re}`,file:path});
      });
      // broken internal links
      const links=[...content.matchAll(/href=["']([^"']+)["']/g)].map(m=>m[1]);
      links.forEach(l=>{
        if(l.startsWith('http')||l.startsWith('mailto')||l.startsWith('tel')||l.startsWith('#')||l.startsWith('data:')||l==='/')return;
        // caminho relativo do path atual
        const dir=path.includes('/')?path.replace(/\/[^/]+$/,'/'):'';
        const full=(dir+l).replace(/\/\.\//g,'/');
        if(files.has(full)){} else {
          // tenta outras formas
          const noHash=l.split('#')[0];
          if(!noHash)return;
          const full2=(dir+noHash).replace(/\/\.\//g,'/');
          if(!files.has(full2))issues.push({level:'warn',message:`Possível link quebrado: ${l} (em ${path})`,file:path});
        }
      });
      // imagens quebradas
      const imgs=[...content.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(m=>m[1]);
      imgs.forEach(src=>{
        if(src.startsWith('http')||src.startsWith('data:'))return;
        const dir=path.includes('/')?path.replace(/\/[^/]+$/,'/'):'';
        const full=(dir+src).replace(/\/\.\//g,'/');
        if(!files.has(full))issues.push({level:'warn',message:`Imagem possivelmente quebrada: ${src} (em ${path})`,file:path});
      });
    });

    // 4. Conteúdo obrigatório
    const d=project.data;
    if(!d.company||d.company.length<2)issues.push({level:'error',message:'Nome da empresa vazio'});
    else issues.push({level:'ok',message:'Nome da empresa preenchido'});
    if(!d.whatsapp)issues.push({level:'warn',message:'WhatsApp não configurado'});
    else issues.push({level:'ok',message:'WhatsApp configurado'});
    if(!d.about)issues.push({level:'warn',message:'Sobre a empresa vazio'});
    if(!d.services||d.services.length===0)issues.push({level:'warn',message:'Nenhum serviço cadastrado'});

    // 5. Segurança
    files.forEach((content,path)=>{
      if(typeof content!=='string')return;
      if(/SUPABASE_SERVICE_ROLE_KEY\s*=/.test(content))issues.push({level:'error',message:`Vazamento de secret: ${path}`});
      if(/AI_API_KEY\s*=/.test(content)&&!/example/i.test(content))issues.push({level:'error',message:`Vazamento de AI key: ${path}`});
      if(/sk_live_/.test(content))issues.push({level:'error',message:`Possível chave Stripe: ${path}`});
    });

    const errors = issues.filter(i=>i.level==='error').length;
    const warns = issues.filter(i=>i.level==='warn').length;
    const oks = issues.filter(i=>i.level==='ok').length;
    return {issues,summary:{errors,warns,oks,total:issues.length,valid:errors===0}};
  }

  return {validate};
})();
