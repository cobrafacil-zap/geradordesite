"""Landing page do Cortador de Vídeos com Legenda — servida no Vercel.

Observação técnica: o processamento pesado (ffmpeg + whisper em lives de GBs)
roda localmente pela CLI (`run.py`). Esta página é a presença web do produto:
mostra os recursos, os modelos de legenda e como usar.
"""

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI(title="Cortador de Vídeos com Legenda")


@app.get("/", response_class=HTMLResponse)
def home() -> str:
    return HTML


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "produto": "Cortador de Vídeos com Legenda"}


HTML = r"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cortador de Vídeos com Legenda — melhores takes prontos para viralizar</title>
<meta name="description" content="Transforma lives e vídeos longos nos melhores cortes (1–3 min) com legenda profissional, título, hashtags e score de viralidade. 100% local.">
<style>
  :root{
    --bg:#0b0d14; --bg2:#0f1220; --card:#151a2b; --card2:#1b2136;
    --text:#eef1f8; --muted:#9aa4bd; --brand:#ff2d6f; --accent:#ffd400;
    --cyan:#22e0ff; --line:#232a40;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1120px;margin:0 auto;padding:0 22px}
  .nav{position:sticky;top:0;backdrop-filter:blur(12px);background:rgba(11,13,20,.72);border-bottom:1px solid var(--line);z-index:20}
  .nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
  .logo{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.2px}
  .logo .dot{width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent))}
  .nav nav{display:flex;gap:26px;font-size:14px;color:var(--muted)}
  .nav nav a:hover{color:#fff}
  .btn{display:inline-flex;align-items:center;gap:9px;padding:12px 22px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;border:0;transition:.18s}
  .btn-primary{background:linear-gradient(135deg,var(--brand),#ff5f8f);color:#fff;box-shadow:0 10px 30px rgba(255,45,111,.35)}
  .btn-primary:hover{transform:translateY(-2px)}
  .btn-ghost{background:var(--card2);color:#fff;border:1px solid var(--line)}
  .btn-ghost:hover{border-color:var(--brand)}
  .hero{padding:88px 0 64px;text-align:center;position:relative;overflow:hidden}
  .hero:before{content:"";position:absolute;inset:-40% -10% auto;height:520px;background:
     radial-gradient(600px 260px at 30% 20%, rgba(255,45,111,.22), transparent 70%),
     radial-gradient(600px 260px at 75% 10%, rgba(34,224,255,.16), transparent 70%);
     filter:blur(6px);z-index:-1}
  .pill{display:inline-flex;align-items:center;gap:8px;padding:7px 15px;border-radius:999px;background:var(--card);border:1px solid var(--line);color:var(--muted);font-size:13px;margin-bottom:22px}
  .pill b{color:var(--accent)}
  h1{font-size:clamp(34px,6vw,66px);line-height:1.03;letter-spacing:-1.2px;font-weight:850}
  h1 .grad{background:linear-gradient(120deg,var(--brand),var(--accent) 55%,var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}
  .sub{max-width:680px;margin:22px auto 0;color:var(--muted);font-size:clamp(16px,2.2vw,21px)}
  .cta{display:flex;gap:14px;justify-content:center;margin-top:34px;flex-wrap:wrap}
  .stats{display:flex;gap:40px;justify-content:center;flex-wrap:wrap;margin-top:52px}
  .stat b{display:block;font-size:30px;font-weight:850}
  .stat span{color:var(--muted);font-size:13px}
  section{padding:72px 0}
  .eyebrow{color:var(--brand);font-weight:800;letter-spacing:2px;text-transform:uppercase;font-size:12px;text-align:center}
  h2{text-align:center;font-size:clamp(26px,4vw,42px);letter-spacing:-.6px;margin:10px auto 14px;max-width:720px}
  .lead{text-align:center;color:var(--muted);max-width:620px;margin:0 auto 46px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(258px,1fr));gap:18px}
  .card{background:linear-gradient(180deg,var(--card),var(--bg2));border:1px solid var(--line);border-radius:18px;padding:26px}
  .card .ico{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:var(--card2);margin-bottom:16px}
  .card h3{font-size:18px;margin-bottom:8px}
  .card p{color:var(--muted);font-size:14.5px}
  .models{background:var(--bg2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .capgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
  .captile{background:#0c0f1a;border:1px solid var(--line);border-radius:16px;padding:30px 22px;display:flex;flex-direction:column;justify-content:center;min-height:150px}
  .captile .label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px}
  .cap{font-weight:900;text-align:center;line-height:1.12;letter-spacing:.5px}
  /* estilos de legenda recriados em CSS */
  .s-gaming{font-size:30px;text-transform:uppercase;color:#fff;-webkit-text-stroke:2.5px #000;text-shadow:0 4px 10px rgba(0,0,0,.6)}
  .s-gaming em{color:var(--accent);font-style:normal}
  .s-karaoke{font-size:30px;text-transform:uppercase;color:#fff;-webkit-text-stroke:1.5px #000}
  .s-karaoke em{color:#ff8a00;font-style:normal}
  .s-neon{font-size:31px;text-transform:uppercase;color:#fff;text-shadow:0 0 4px #22e0ff,0 0 16px #22e0ff,0 0 2px #fff}
  .s-neon em{color:#ff45c8;text-shadow:0 0 6px #ff45c8,0 0 18px #ff45c8}
  .s-minimal{font-size:24px;color:#fff;font-weight:700;text-transform:none}
  .s-podcast{font-size:22px;color:#fff;background:rgba(255,255,255,.08);padding:12px 16px;border-radius:12px;font-weight:700}
  .s-hype{font-size:33px;text-transform:uppercase;color:#fff;-webkit-text-stroke:2px #000;text-shadow:0 5px 12px rgba(0,0,0,.7)}
  .s-hype em{color:#ff2b2b;font-style:normal}
  .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
  .step{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px}
  .step .n{width:34px;height:34px;border-radius:10px;background:var(--brand);color:#fff;display:grid;place-items:center;font-weight:800;margin-bottom:14px}
  .step h3{font-size:17px;margin-bottom:6px}
  .step p{color:var(--muted);font-size:14px}
  .code{background:#070a12;border:1px solid var(--line);border-radius:16px;padding:22px;overflow:auto;margin-top:26px}
  .code pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;color:#cdd6f4;line-height:1.9}
  .code .c{color:#6b7692}.code .k{color:#ff6b9d}.code .s{color:#9ae6b4}
  .trust{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px}
  .trust span{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:9px 16px;font-size:13px;color:var(--muted)}
  .trust b{color:#fff}
  .cta-band{background:linear-gradient(135deg,var(--brand),#7a2dff);border-radius:24px;padding:52px 30px;text-align:center;margin:0 22px}
  .cta-band h2{margin:0 0 10px}
  .cta-band p{color:rgba(255,255,255,.85);max-width:520px;margin:0 auto 26px}
  footer{padding:44px 0 60px;text-align:center;color:var(--muted);font-size:14px}
  footer .logo{justify-content:center;margin-bottom:12px}
  @media(max-width:640px){.nav nav{display:none}.stats{gap:26px}}
</style>
</head>
<body>

<div class="nav"><div class="wrap">
  <div class="logo"><span class="dot"></span> Cortador de Vídeos</div>
  <nav>
    <a href="#recursos">Recursos</a>
    <a href="#modelos">Modelos de legenda</a>
    <a href="#como">Como usar</a>
  </nav>
  <a class="btn btn-primary" href="#como">Começar</a>
</div></div>

<header class="hero"><div class="wrap">
  <div class="pill">🚀 Engenharia reversa de <b>Opus Clip · Klap · Submagic · Vizard</b></div>
  <h1>Da live longa aos <span class="grad">melhores cortes</span><br>com legenda profissional</h1>
  <p class="sub">Você coloca a live. Ele detecta 16:9 ou 9:16, acha os melhores takes de 1–3 min e entrega
  cada corte com <b>legenda queimada, título, hashtags e score de viralidade</b>. 100% local, sem assinatura.</p>
  <div class="cta">
    <a class="btn btn-primary" href="#como">▶ Ver como usar</a>
    <a class="btn btn-ghost" href="https://github.com/cobrafacil-zap/geradordesite" target="_blank" rel="noopener">Ver no GitHub</a>
  </div>
  <div class="stats">
    <div class="stat"><b>1–3 min</b><span>por corte</span></div>
    <div class="stat"><b>6</b><span>modelos de legenda</span></div>
    <div class="stat"><b>7 eixos</b><span>score de viralidade</span></div>
    <div class="stat"><b>9:16 · 16:9</b><span>reframe automático</span></div>
  </div>
</div></header>

<section id="recursos"><div class="wrap">
  <div class="eyebrow">O que ele faz</div>
  <h2>Edição profissional no automático</h2>
  <p class="lead">Cada recurso foi inspirado nas plataformas líderes de clipagem com IA — e roda aqui, localmente.</p>
  <div class="grid">
    <div class="card"><div class="ico">🎯</div><h3>Melhores takes</h3><p>Análise de áudio acha energia, emoção e ritmo para escolher os trechos com mais potencial.</p></div>
    <div class="card"><div class="ico">📈</div><h3>Score de viralidade</h3><p>Cada corte é pontuado em 7 eixos (hook, emoção, dinâmica, fala, semântica, trend, loop).</p></div>
    <div class="card"><div class="ico">🖼️</div><h3>Reframe inteligente</h3><p>Detecta 16:9 / 9:16 / 1:1 e reenquadra com fundo borrado, crop ou pad — zona segura inclusa.</p></div>
    <div class="card"><div class="ico">🅰️</div><h3>Legenda profissional</h3><p>Contorno grosso, palavra-chave em cor e emoji colorido. Estilo dos grandes creators.</p></div>
    <div class="card"><div class="ico">✍️</div><h3>Título + hashtags</h3><p>Títulos guiados por evento, hashtags de nicho + trending e descrição com CTA.</p></div>
    <div class="card"><div class="ico">🎬</div><h3>Exporta tudo</h3><p>MP4 pronto (1080×1920 ou 1920×1080) + .srt/.ass + relatório .md/.json por corte.</p></div>
  </div>
</div></section>

<section id="modelos" class="models"><div class="wrap">
  <div class="eyebrow">Colocar o texto</div>
  <h2>6 modelos de legenda profissionais</h2>
  <p class="lead">É só escolher o visual. Cada modelo define fonte, cor, contorno, posição e efeitos.</p>
  <div class="capgrid">
    <div class="captile"><div class="label">Gaming Bold</div><div class="cap s-gaming">🏎️ A FUGA <em>TERMINA</em> EM CAPOTAMENTO</div></div>
    <div class="captile"><div class="label">Karaoke</div><div class="cap s-karaoke">A FUGA TERMINA EM <em>CAPOTAMENTO</em></div></div>
    <div class="captile"><div class="label">Neon</div><div class="cap s-neon">A <em>FUGA</em> TERMINA EM CAPOTAMENTO</div></div>
    <div class="captile"><div class="label">Minimal</div><div class="cap s-minimal">A fuga termina em capotamento</div></div>
    <div class="captile"><div class="label">Podcast</div><div class="cap s-podcast">A fuga termina em capotamento</div></div>
    <div class="captile"><div class="label">Hype</div><div class="cap s-hype">🔥 A <em>FUGA</em> TERMINA EM CAPOTAMENTO</div></div>
  </div>
</div></section>

<section id="como"><div class="wrap">
  <div class="eyebrow">Como usar</div>
  <h2>Roda na sua máquina, em 3 comandos</h2>
  <p class="lead">O processamento (ffmpeg + transcrição) acontece localmente — assim ele lida com lives de horas sem limite de tempo.</p>
  <div class="steps">
    <div class="step"><div class="n">1</div><h3>Instale</h3><p>Dependências leves: Python, ffmpeg e as libs do projeto.</p></div>
    <div class="step"><div class="n">2</div><h3>Aponte a live</h3><p>Rode o comando com o arquivo da sua live ou gravação.</p></div>
    <div class="step"><div class="n">3</div><h3>Receba os cortes</h3><p>Vídeos legendados + título + hashtags + relatório, prontos para postar.</p></div>
  </div>
  <div class="code">
<pre><span class="c"># 1) dependências</span>
pip install -r requirements.txt

<span class="c"># 2) cortar a live (5 cortes verticais estilo gaming)</span>
python run.py <span class="s">"minha_live.mp4"</span> -n 5 --style gaming_bold --format 9:16 --game <span class="s">"GTA RP"</span>

<span class="c"># 3) saída em output/cortes/ — .mp4, .srt, .ass, .json e report.md</span></pre>
  </div>
  <div class="trust">
    <span>🎯 <b>melhores takes</b></span>
    <span>📈 <b>score de viralidade</b></span>
    <span>🅰️ <b>legendas com emoji</b></span>
    <span>🖼️ <b>reframe 9:16</b></span>
    <span>✍️ <b>título + hashtags</b></span>
    <span>🎬 <b>100% local</b></span>
  </div>
</div></section>

<div class="cta-band">
  <h2>Pronto para viralizar sua live?</h2>
  <p>Pegue o código, rode na sua máquina e transforme horas de live em dezenas de cortes profissionais.</p>
  <a class="btn btn-ghost" href="https://github.com/cobrafacil-zap/geradordesite" target="_blank" rel="noopener">Acessar o repositório →</a>
</div>

<footer>
  <div class="logo"><span class="dot"></span> Cortador de Vídeos com Legenda</div>
  <div>Processamento local · ffmpeg + faster-whisper · legendas, títulos e hashtags automáticos</div>
</footer>

</body>
</html>"""
