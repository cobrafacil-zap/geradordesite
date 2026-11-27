"""Interface WEB do Cortador de Vídeos — upload → processar → baixar.

Roda na sua máquina (100% privado) ou num servidor que você controlar.
Abra no navegador, suba a live, escolha as opções e baixe os cortes prontos.

Rodar:
    pip install -r requirements-cli.txt -r requirements.txt
    python webui.py        # depois abra http://localhost:8000

Observação: o processamento (ffmpeg + transcrição) acontece aqui — por isso ele
lida com lives de horas. Não use o Vercel/serverless para isso (eles não têm
ffmpeg e estouram tempo/memória); use esta interface local ou um servidor real.
"""

from __future__ import annotations

import os
import json
import html as _html
import shutil
import tempfile
import threading
import uuid
from typing import List, Optional

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse

from cortador.pipeline import PipelineOptions, run_pipeline
from cortador.styles import list_styles

app = FastAPI(title="Cortador de Vídeos com Legenda")

BASE_OUT = os.environ.get(
    "DATA_DIR",
    "/data" if os.path.isdir("/data") and os.access("/data", os.W_OK)
    else os.path.join(os.path.dirname(os.path.abspath(__file__)), "output_web"),
)
os.makedirs(BASE_OUT, exist_ok=True)

# jobs em andamento/feitos: id -> {status, out_dir, log, report}
JOBS: dict = {}
JOBS_LOCK = threading.Lock()


def _fmt_status(job: dict) -> str:
    return job.get("status", "…")


def esc(s) -> str:
    """Escapa HTML para os blocos de texto copiáveis."""
    return _html.escape(str(s or ""), quote=False)


@app.get("/", response_class=HTMLResponse)
def home():
    styles = list_styles()
    opts = "\n".join(f'<option value="{s["key"]}">{s["label"]} — {s["description"]}</option>' for s in styles)
    return PAGE.replace("__STYLE_OPTIONS__", opts)


def _list_jobs():
    """Lista os trabalhos já processados (lidos do disco)."""
    import datetime
    jobs = []
    if not os.path.isdir(BASE_OUT):
        return jobs
    for name in sorted(os.listdir(BASE_OUT)):
        d = os.path.join(BASE_OUT, name)
        if not os.path.isdir(d):
            continue
        entry = {"id": name, "title": "", "clips": 0, "date": "", "status": "pronto", "cover": ""}
        try:
            entry["date"] = datetime.datetime.fromtimestamp(os.path.getmtime(d)).strftime("%d/%m/%Y %H:%M")
        except Exception:
            pass
        report_path = os.path.join(d, "report.json")
        if os.path.exists(report_path):
            try:
                with open(report_path, "r", encoding="utf-8") as f:
                    rep = json.load(f)
                clips = rep.get("clips", [])
                entry["clips"] = len(clips)
                entry["title"] = (clips[0].get("metadata", {}).get("title") if clips else "") or f"{len(clips)} corte(s)"
            except Exception:
                entry["title"] = "—"
        else:
            entry["status"] = "processando"
            entry["title"] = "Processando…"
        jobs.append(entry)
    jobs.sort(key=lambda x: x["date"], reverse=True)
    return jobs


@app.get("/trabalhos", response_class=HTMLResponse)
def trabalhos():
    jobs = _list_jobs()
    if not jobs:
        body = "<p class='lead'>Nenhum trabalho ainda. <a class='dl' href='/'>← Fazer o primeiro</a></p>"
    else:
        rows = []
        for j in jobs:
            status = "⏳ processando" if j["status"] == "processando" else f"🎬 {j['clips']} corte(s)"
            rows.append(f"""
            <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
              <div style="flex:1;min-width:200px">
                <h3 style="margin:0 0 4px">{j['title']}</h3>
                <div class="meta">#{j['id']} · {j['date']} · {status}</div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <a class="dl" href="/job/{j['id']}">Abrir →</a>
                <a class="dl ghost" href="/excluir-outros/{j['id']}" onclick="return confirm('Apagar os OUTROS trabalhos e deixar só este?')" title="Deixar só este">⭐ Só este</a>
                <a class="dl ghost" href="/excluir/{j['id']}" onclick="return confirm('Excluir este trabalho?')" title="Excluir">🗑️</a>
              </div>
            </div>""")
        top = "<p><a class='dl ghost' href='/limpar' onclick=\"return confirm('Apagar TODOS os trabalhos?')\">🗑️ Limpar todos os trabalhos</a></p>"
        body = top + "\n".join(rows) + "<p style='margin-top:18px'><a class='dl ghost' href='/'>← Novo trabalho</a></p>"
    return JOBS_PAGE.replace("__JOBS__", body).replace("__N__", str(len(jobs)))


def _safe_job_dir(job_id: str) -> Optional[str]:
    d = os.path.abspath(os.path.join(BASE_OUT, job_id))
    if os.path.isdir(d) and d.startswith(os.path.abspath(BASE_OUT) + os.sep):
        return d
    return None


@app.get("/excluir/{job_id}")
def excluir(job_id: str):
    """Exclui um trabalho (pasta com os cortes)."""
    d = _safe_job_dir(job_id)
    if d:
        shutil.rmtree(d, ignore_errors=True)
    return RedirectResponse(url="/trabalhos", status_code=303)


@app.get("/excluir-outros/{job_id}")
def excluir_outros(job_id: str):
    """Mantém só o trabalho indicado e apaga todos os outros."""
    base = os.path.abspath(BASE_OUT)
    if os.path.isdir(BASE_OUT):
        for name in os.listdir(BASE_OUT):
            if name == job_id:
                continue
            d = os.path.join(BASE_OUT, name)
            if os.path.isdir(d) and os.path.abspath(d).startswith(base + os.sep):
                shutil.rmtree(d, ignore_errors=True)
    return RedirectResponse(url=f"/job/{job_id}", status_code=303)


@app.get("/limpar")
def limpar():
    """Apaga todos os trabalhos."""
    base = os.path.abspath(BASE_OUT)
    if os.path.isdir(BASE_OUT):
        for name in os.listdir(BASE_OUT):
            d = os.path.join(BASE_OUT, name)
            if os.path.isdir(d) and os.path.abspath(d).startswith(base + os.sep):
                shutil.rmtree(d, ignore_errors=True)
    return RedirectResponse(url="/trabalhos", status_code=303)


@app.get("/health")
def health():
    return {"ok": True}


def _gb(n: int) -> float:
    return round(n / (1024 ** 3), 1)


def _error_page(title: str, msg: str, detail: str = "", status: int = 500):
    html = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
            "<meta name='viewport' content='width=device-width, initial-scale=1'>"
            "<title>Não foi possível processar</title><style>" + _CSS + "</style></head><body>"
            "<div class='wrap'><h1>⚠️ " + title + "</h1>"
            "<p class='lead'>" + msg + "</p>"
            "<pre>" + (detail or "") + "</pre>"
            "<p><a class='dl' href='/'>← Voltar e tentar de novo</a> "
            "<a class='dl ghost' href='/trabalhos'>📁 Meus trabalhos</a></p>"
            "</div></body></html>")
    return HTMLResponse(html, status_code=status)


@app.post("/processar")
def processar(
    video: Optional[UploadFile] = File(None),
    n_cortes: int = Form(4),
    formato: str = Form("9:16"),
    estilo: str = Form("gaming_bold"),
    modelo: str = Form("small"),
    qualidade: str = Form("maxima"),
    jogo: str = Form(""),
    idioma: str = Form("pt"),
    emoji: str = Form("on"),
    barra: str = Form("on"),
    legenda: str = Form("off"),
    ia: str = Form("on"),
):
    if video is None or not (video.filename or "").strip():
        return _error_page(
            "Escolha um vídeo",
            "Nenhum arquivo foi enviado. Clique em <b>Escolher arquivo</b>, selecione a live e "
            "depois em <b>▶ Processar vídeo</b>.",
            status=400,
        )

    job_id = uuid.uuid4().hex[:12]
    out_dir = os.path.join(BASE_OUT, job_id)
    os.makedirs(out_dir, exist_ok=True)

    # espaço em disco: um vídeo longo precisa de ~2x o tamanho (original + cortes + temporários)
    free = shutil.disk_usage(BASE_OUT).free
    if free < 3 * 1024 ** 3:   # menos de 3 GB livres
        shutil.rmtree(out_dir, ignore_errors=True)
        return _error_page(
            "Pouco espaço em disco",
            f"Só há <b>{_gb(free)} GB livres</b> no disco. Para processar uma live longa são "
            "necessários pelo menos <b>3 GB</b> (e idealmente 10 GB).<br><br>"
            "Apague trabalhos antigos em <a href='/trabalhos'>📁 Meus trabalhos</a> "
            "(ou o botão <b>Limpar todos</b>) e tente novamente.",
            status=507,
        )

    # salva o vídeo enviado (em blocos, para não travar a interface)
    ext = os.path.splitext(video.filename or "video.mp4")[1] or ".mp4"
    tmp_video = os.path.join(out_dir, f"entrada{ext}")
    try:
        with open(tmp_video, "wb") as f:
            while True:
                chunk = video.file.read(4 * 1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)
    except OSError as e:
        shutil.rmtree(out_dir, ignore_errors=True)
        return _error_page(
            "Falha ao salvar o vídeo",
            "O disco encheu durante o envio. Libere espaço (apague trabalhos antigos ou "
            "arquivos grandes do computador) e tente de novo.",
            detail=str(e),
            status=507,
        )

    with JOBS_LOCK:
        JOBS[job_id] = {"status": "processando", "out_dir": out_dir, "log": [], "report": None}

    def _run():
        try:
            opts = PipelineOptions(
                output_dir=out_dir,
                count=int(n_cortes),
                target_format=formato,
                style=estilo,
                game=(jogo.strip() or None),
                language=idioma,
                model_size=modelo,
                render_quality=qualidade,
                captions=(legenda == "on"),
                use_ai=(ia == "on"),
                emoji=(emoji == "on"),
                progress_bar=(barra == "on"),
                render_video=True,
            )
            def log(msg):
                with JOBS_LOCK:
                    JOBS[job_id]["log"].append(str(msg))

            def prog(step, pct):
                with JOBS_LOCK:
                    JOBS[job_id]["step"] = str(step)
                    JOBS[job_id]["pct"] = int(pct)

            report = run_pipeline(tmp_video, opts, log=log, progress=prog)
            with JOBS_LOCK:
                JOBS[job_id]["report"] = report
                JOBS[job_id]["status"] = "pronto"

            # libera espaço: apaga o vídeo original enviado (os cortes já estão prontos)
            try:
                if os.path.exists(tmp_video):
                    free_now = shutil.disk_usage(BASE_OUT).free
                    if free_now < 25 * 1024 ** 3:   # disco apertado → não guarda o original
                        os.remove(tmp_video)
                        log("🧹 Vídeo original removido para liberar espaço "
                            "(os cortes continuam disponíveis).")
            except OSError:
                pass
            # limpa temporários (wavs, trechos do Demucs)
            shutil.rmtree(os.path.join(out_dir, "_work"), ignore_errors=True)
        except OSError as e:
            with JOBS_LOCK:
                JOBS[job_id]["status"] = "erro"
                if getattr(e, "errno", None) == 28:
                    JOBS[job_id]["log"].append(
                        "ERRO: disco cheio (sem espaço). Apague trabalhos antigos em "
                        "'Meus trabalhos' e processe de novo.")
                else:
                    JOBS[job_id]["log"].append(f"ERRO: {e}")
        except Exception as e:  # pragma: no cover
            with JOBS_LOCK:
                JOBS[job_id]["status"] = "erro"
                JOBS[job_id]["log"].append(f"ERRO: {e}")

    threading.Thread(target=_run, daemon=True).start()
    return RedirectResponse(url=f"/job/{job_id}", status_code=303)


@app.get("/job/{job_id}", response_class=HTMLResponse)
def job_page(job_id: str):
    out_dir = os.path.join(BASE_OUT, job_id)
    report_path = os.path.join(out_dir, "report.json")

    # 1) Se já existe o relatório no disco → resultado pronto (sobrevive a restart).
    if os.path.exists(report_path):
        try:
            with open(report_path, "r", encoding="utf-8") as f:
                report = json.load(f)
        except Exception:
            report = {"clips": []}
        return _render_results(job_id, out_dir, report)

    # 2) Senão, procura o estado em memória (processando/erro).
    with JOBS_LOCK:
        job = JOBS.get(job_id)
    if not job:
        # 3) Último recurso: pasta existe mas ainda sem relatório → ainda processando
        if os.path.isdir(out_dir):
            return (PROCESSING.replace("__ID__", job_id).replace("__LOG__", "Processando… (aguarde)")
                    .replace("__STEP__", "Processando…").replace("__PCT__", "15"))
        return HTMLResponse("<h3>Job não encontrado.</h3>", status_code=404)

    if job["status"] == "processando":
        log_html = "<br>".join(job["log"][-12:]) or "Iniciando…"
        step = job.get("step", "Processando…")
        pct = job.get("pct", 10)
        return (PROCESSING.replace("__ID__", job_id).replace("__LOG__", log_html)
                .replace("__STEP__", step).replace("__PCT__", str(pct)))

    if job["status"] == "erro":
        return HTMLResponse(f"<h3>Erro no processamento</h3><pre>{job['log'][-1]}</pre>")

    return _render_results(job_id, job["out_dir"], job.get("report") or {"clips": []})


def _fmt_time(s) -> str:
    s = int(s or 0)
    m, sec = divmod(s, 60)
    h, m = divmod(m, 60)
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"


def _score_class(v) -> str:
    try:
        v = float(v)
    except Exception:
        return "s-mid"
    return "s-hi" if v >= 75 else ("s-mid" if v >= 55 else "s-low")


def _render_results(job_id: str, out_dir: str, report: dict) -> str:
    cards = []
    queue = []
    clips = report.get("clips", [])
    for i, c in enumerate(clips, 1):
        m = c.get("metadata", {})
        v = c.get("virality", {})
        fname = c.get("file") or ""
        title = (m.get("title") or f"Corte {i}").strip()
        score = v.get("total", 0)
        start, end = c.get("start", 0), c.get("end", 0)
        desc = (m.get("description") or "").splitlines()[0] if m.get("description") else ""
        tags = m.get("hashtags_str", "")

        dl = []
        if fname:
            dl.append(f'<a class="icon-btn" title="Baixar MP4" href="/saida/{job_id}/cortes/{fname}">⬇</a>')
        for k, ic in (("srt", "📄"), ("ass", "🎨")):
            sub = (c.get("subtitles") or {}).get(k)
            if sub:
                dl.append(f'<a class="icon-btn" title="Legenda {k.upper()}" href="/saida/{job_id}/cortes/{sub}">{ic}</a>')
        dl.append(f'<span class="icon-btn" title="Agendar (em breve)">🗓</span>')
        dl.append(f'<span class="icon-btn" title="Recortar (em breve)">✂</span>')

        cards.append(f"""
        <div class="clip">
          <div class="clip-head"><input type="checkbox"><div class="clip-title">#{i} {title}</div></div>
          <div class="thumbwrap" onclick="playVid('/saida/{job_id}/cortes/{fname}')" style="cursor:pointer">
            <img src="/thumb/{job_id}/{fname}" loading="lazy" onerror="this.style.display='none'">
            <div class="play"><span>▶</span></div>
            <div class="timerange">{_fmt_time(start)} - {_fmt_time(end)}</div>
            <div class="score {_score_class(score)}"><b>{int(round(float(score) or 0))}</b><i>/100</i></div>
          </div>
          <div class="clip-actions">{''.join(dl)}</div>
          <div class="copybox">
            <div class="cbox"><div class="clab">✏️ Título</div>
              <div class="ctext" id="ct_t{i}">{esc(title)}</div>
              <button class="cbtn" onclick="copiarEl('ct_t{i}',this)">📋 Copiar</button></div>
            <div class="cbox"><div class="clab">📝 Legenda (descrição)</div>
              <div class="ctext" id="ct_d{i}">{esc(desc)}</div>
              <button class="cbtn" onclick="copiarEl('ct_d{i}',this)">📋 Copiar</button></div>
            <div class="cbox"><div class="clab">#️⃣ Hashtags</div>
              <div class="ctext" id="ct_h{i}">{esc(tags)}</div>
              <button class="cbtn" onclick="copiarEl('ct_h{i}',this)">📋 Copiar</button></div>
            <button class="cbtn big" id="cb{i}" onclick="copiarTudo({i})">⭐ Copiar tudo (título + legenda + hashtags)</button>
          </div>
        </div>""")
        queue.append(
            f'<div class="qrow"><span class="t">#{i} {title}</span>'
            f'<span class="ok">✓</span>'
            f'<a class="icon-btn" title="Baixar" href="/saida/{job_id}/cortes/{fname}">⬇</a></div>'
        )

    n = len(clips)
    topbar = (
        f"<div class='topbar'><div class='tab'>📋 Momentos Virais <span class='cnt'>{n}</span></div>"
        f"<button class='btn-find' onclick=\"alert('Em breve: buscar momentos por texto')\">+ Encontrar Momentos</button></div>"
        f"<div class='selall'><input type='checkbox' onclick=\"document.querySelectorAll('.clip input').forEach(c=>c.checked=this.checked)\"> "
        f"Selecionar todos os {n} clipes</div>"
    )
    queue_html = (
        f"<div class='queue'><h4>Fila de Exportação <span style='color:#2ee6a8'>{n}/{n}</span></h4>"
        + "".join(queue)
        + "</div>"
    )

    report_link = ""
    if os.path.exists(os.path.join(out_dir, "report.md")):
        report_link = f'<a class="dl" href="/saida/{job_id}/report.md">📄 Relatório</a>'

    return (RESULT
            .replace("__TOPBAR__", topbar)
            .replace("__CARDS__", "\n".join(cards) or "<p>Nenhum corte gerado.</p>")
            .replace("__QUEUE__", queue_html)
            .replace("__REPORT__", report_link)
            .replace("__ID__", job_id))


@app.get("/thumb/{job_id}/{clipfile}")
def thumb(job_id: str, clipfile: str):
    base = os.path.join(BASE_OUT, job_id, "cortes")
    mp4 = os.path.join(base, clipfile)
    if not os.path.exists(mp4):
        return HTMLResponse("", status_code=404)
    jpg = os.path.join(base, os.path.splitext(clipfile)[0] + "_thumb.jpg")
    if not os.path.exists(jpg):
        import subprocess
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-ss", "1.5", "-i", mp4,
             "-frames:v", "1", "-vf", "scale=520:-2", jpg],
            capture_output=True,
        )
        if not os.path.exists(jpg):
            return HTMLResponse("", status_code=404)
    return FileResponse(jpg, media_type="image/jpeg")


@app.get("/saida/{job_id}/{path:path}")
def saida(job_id: str, path: str):
    base = os.path.join(BASE_OUT, job_id)
    full = os.path.join(base, path)
    if not os.path.abspath(full).startswith(os.path.abspath(base)) or not os.path.exists(full):
        return HTMLResponse("Arquivo não encontrado.", status_code=404)
    return FileResponse(full)


_CSS = """
:root{--bg:#0b0d14;--card:#151a2b;--text:#eef1f8;--muted:#9aa4bd;--brand:#ff2d6f;--accent:#ffd400;--line:#232a40}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6}
.wrap{max-width:900px;margin:0 auto;padding:32px 22px}
h1{font-size:32px;letter-spacing:-.5px}
.lead{color:var(--muted);margin:8px 0 28px}
label{display:block;font-size:13px;color:var(--muted);margin:16px 0 6px;font-weight:600}
input[type=number],input[type=text],select{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:#0f1220;color:#fff;font-size:15px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.chk{display:flex;align-items:center;gap:9px;margin-top:14px;color:var(--muted);font-size:14px}
.btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:12px;font-weight:700;font-size:16px;cursor:pointer;border:0;margin-top:26px;background:linear-gradient(135deg,var(--brand),#ff5f8f);color:#fff;box-shadow:0 12px 30px rgba(255,45,111,.35)}
.btn:hover{transform:translateY(-2px)}
.form{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:28px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;margin:14px 0}
.card h3{margin:8px 0;font-size:18px}
.vtag{color:var(--accent);font-size:13px;font-weight:700}
.meta{color:var(--muted);font-size:13px;margin:6px 0}
.desc{color:#c7cfe0;font-size:14px;margin:6px 0}
.dl{display:inline-block;padding:9px 15px;border-radius:10px;background:var(--brand);color:#fff;text-decoration:none;font-size:14px;font-weight:700;margin:6px 8px 0 0}
.dl.ghost{background:#1b2136;border:1px solid var(--line);color:#fff}
.links{margin-top:10px}
pre{background:#070a12;border:1px solid var(--line);border-radius:12px;padding:16px;overflow:auto;color:#cdd6f4;font-size:13px}
.spin{width:38px;height:38px;border:4px solid var(--line);border-top-color:var(--brand);border-radius:50%;animation:sp 1s linear infinite;margin:24px 0}
@keyframes sp{to{transform:rotate(360deg)}}

/* ===== Momentos Virais (grade de cards) ===== */
.topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 18px}
.tab{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;background:var(--card);border:1px solid var(--line);font-weight:700}
.tab .cnt{background:var(--brand);color:#fff;border-radius:999px;padding:1px 9px;font-size:12px}
.btn-find{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;background:transparent;border:1px dashed var(--line);color:var(--muted);cursor:pointer}
.selall{display:flex;align-items:center;gap:9px;color:var(--muted);font-size:14px;margin:2px 0 16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:18px}
.clip{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.clip-head{display:flex;align-items:center;gap:10px;padding:14px 16px 10px}
.clip-head input{width:18px;height:18px;accent-color:var(--brand)}
.clip-title{font-weight:800;font-size:15px;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.thumbwrap{position:relative;margin:0 16px;border-radius:12px;overflow:hidden;background:#000;aspect-ratio:16/10}
.thumbwrap img{width:100%;height:100%;object-fit:cover;display:block}
.play{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.15)}
.play span{width:52px;height:52px;border-radius:50%;background:rgba(0,0,0,.55);display:grid;place-items:center;font-size:20px;color:#fff;border:2px solid rgba(255,255,255,.7)}
.timerange{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;padding:3px 8px;border-radius:8px;font-variant-numeric:tabular-nums}
.score{position:absolute;left:10px;bottom:10px;display:flex;align-items:baseline;gap:3px;font-weight:900}
.score b{font-size:30px;line-height:1}
.score i{font-size:13px;font-style:normal;opacity:.85}
.s-hi{color:#2ee6a8}.s-mid{color:#ffd400}.s-low{color:#ff7a7a}
.clip-actions{display:flex;gap:6px;padding:12px 16px 4px;flex-wrap:wrap}
.icon-btn{width:36px;height:36px;border-radius:10px;background:var(--card2);border:1px solid var(--line);color:#cdd6f4;display:grid;place-items:center;cursor:pointer;text-decoration:none;font-size:15px}
.icon-btn:hover{border-color:var(--brand);color:#fff}
.clip-desc{padding:8px 16px 16px;color:var(--muted);font-size:13.5px;line-height:1.5}

/* ===== Blocos de texto copiáveis (título / legenda / hashtags) ===== */
.copybox{padding:0 14px 16px;display:flex;flex-direction:column;gap:8px}
.cbox{position:relative;background:#0e1220;border:1px solid var(--line);border-radius:12px;padding:9px 11px}
.clab{font-size:10.5px;text-transform:uppercase;letter-spacing:.08px;opacity:.6;margin-bottom:5px}
.ctext{font-size:13.5px;color:#e7ecf7;line-height:1.55;word-break:break-word;padding-right:74px;white-space:pre-wrap}
.cbtn{position:absolute;top:8px;right:8px;background:var(--card2);border:1px solid var(--line);color:#cdd6f4;border-radius:9px;padding:5px 9px;font-size:12px;cursor:pointer}
.cbtn:hover{background:var(--brand);color:#fff;border-color:var(--brand)}
.cbtn.big{position:static;width:100%;margin-top:2px;background:linear-gradient(90deg,#ff2d6f,#ffd400);color:#111;font-weight:700;border:0;padding:10px;border-radius:11px}
.cbtn.big:hover{filter:brightness(1.08);color:#111}
.queue{position:fixed;top:16px;right:16px;width:340px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;max-height:70vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);z-index:50}
.queue h4{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}
.qrow{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 0;border-top:1px solid var(--line)}
.qrow .t{flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.qrow .ok{color:#2ee6a8}
@media(max-width:640px){.grid{grid-template-columns:1fr}.queue{position:static;width:auto;margin-top:16px}}

/* ===== Player de vídeo (modal) ===== */
.vmodal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:200;align-items:center;justify-content:center;padding:20px}
.vbox{position:relative;width:min(92vw,420px)}
.vbox video{width:100%;max-height:82vh;border-radius:16px;background:#000;display:block;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.vclose{position:absolute;top:-46px;right:0;width:38px;height:38px;border-radius:50%;border:0;background:#fff;color:#000;font-size:19px;cursor:pointer;font-weight:700}

/* ===== Loading (feedback imediato ao processar) ===== */
.loading{display:none;position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:300;align-items:center;justify-content:center;padding:20px}
.lbox{text-align:center;color:#fff;max-width:340px}
.lspin{width:58px;height:58px;border:5px solid rgba(255,255,255,.22);border-top-color:#ff2d6f;border-radius:50%;animation:sp 1s linear infinite;margin:0 auto 22px}
.lbox h3{margin:0 0 10px;font-size:22px}
.lbox p{color:#c7cfe0;font-size:15px;line-height:1.7}

/* ===== Barra de progresso (mostra o que está fazendo) ===== */
.pbar{width:100%;max-width:440px;height:18px;background:#1b2136;border-radius:999px;overflow:hidden;margin:20px auto 12px;border:1px solid var(--line)}
.pfill{height:100%;width:0;background:linear-gradient(90deg,#ff2d6f,#ffd400);border-radius:999px;transition:width .5s}
.pstep{text-align:center;color:#fff;font-weight:700;font-size:17px;margin:0 0 6px}
"""

PAGE = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width, initial-scale=1'>"
        "<title>Cortador de Vídeos com Legenda</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
        "<h1>🎬 Cortador de Vídeos com Legenda</h1>"
        "<p style='text-align:right;margin:-10px 0 0'><a class='dl ghost' href='/trabalhos'>📁 Meus trabalhos</a></p>"
        f"<p class='lead' style='font-size:13px'>💾 Espaço livre no disco: <b>{_gb(shutil.disk_usage(BASE_OUT).free)} GB</b></p>"
        "<p class='lead'>Suba a live, escolha as opções e receba os melhores cortes (1–3 min) "
        "com legenda profissional, título, hashtags e score de viralidade. "
        "<b>100% privado:</b> o vídeo é processado aqui, nada é enviado para fora.</p>"
        "<form id='pform' class='form' action='/processar' method='post' enctype='multipart/form-data'>"
        "<label>Vídeo / Live (mp4, mov…)</label>"
        "<input type='file' name='video' accept='video/*' required>"
        "<div class='row'>"
        "<div><label>Nº de cortes</label><input type='number' name='n_cortes' value='4' min='1' max='20'></div>"
        "<div><label>Formato de saída</label><select name='formato'>"
        "<option value='auto'>Auto (detectar)</option><option value='9:16' selected>9:16 (vertical)</option>"
        "<option value='16:9'>16:9 (horizontal)</option><option value='1:1'>1:1</option><option value='4:5'>4:5</option>"
        "</select></div>"
        "</div>"
        "<div class='row'>"
        "<div><label>Modelo de legenda</label><select name='estilo'>__STYLE_OPTIONS__</select></div>"
        "<div><label>Qualidade do vídeo</label><select name='qualidade'>"
        "<option value='maxima' selected>Máxima (recomendado)</option>"
        "<option value='alta'>Alta</option>"
        "<option value='normal'>Normal (mais leve)</option>"
        "</select></div>"
        "</div>"
        "<div class='row'>"
        "<div><label>Transcrição PT-BR (título + legenda)</label><select name='modelo'>"
        "<option value='small' selected>Boa (small) — recomendado</option>"
        "<option value='medium'>Melhor (medium, mais lento)</option>"
        "<option value='base'>Rápida (base)</option>"
        "<option value='tiny'>Turbo (tiny, menos precisa)</option>"
        "</select></div>"
        "<div></div>"
        "</div>"
        "<label>Jogo / nicho (opcional — deixe vazio para detectar pelo conteúdo)</label>"
        "<input type='text' name='jogo' value='' placeholder='auto-detectar (ex.: GTA, corrida, podcast)'>"
        "<label>Idioma da transcrição</label><input type='text' name='idioma' value='pt'>"
        "<div class='chk'><input type='checkbox' name='ia' checked> 🧠 IA (DeepSeek): entende o corte, escolhe os melhores momentos e escreve títulos</div>"
        "<div class='chk'><input type='checkbox' name='legenda'> Gravar legenda no vídeo (padrão: desligado — vídeo limpo)</div>"
        "<div class='chk'><input type='checkbox' name='emoji' checked> Usar emoji (se ativar legenda)</div>"
        "<div class='chk'><input type='checkbox' name='barra' checked> Mostrar barra de progresso</div>"
        "<button class='btn' type='submit'>▶ Processar vídeo</button>"
        "</form>"
        "<p class='lead' style='margin-top:22px;font-size:13px'>O processamento pode levar alguns minutos em lives longas "
        "(transcrição + renderização).</p>"
        "</div>"
        "<div id='loading' class='loading'>"
        "<div class='lbox'>"
        "<div class='lspin'></div>"
        "<h3 id='ltitle'>Enviando seu vídeo…</h3>"
        "<div class='pbar'><div class='pfill' id='lfill' style='width:0%'></div></div>"
        "<p id='lmsg'>0% enviado<br><b>Não feche esta página.</b></p>"
        "</div></div>"
        "<script>"
        "function fmtMB(n){return (n/1048576).toFixed(1)+' MB';}"
        "document.getElementById('pform').addEventListener('submit',function(e){"
        "e.preventDefault();"
        "var form=this;"
        "var l=document.getElementById('loading'),fill=document.getElementById('lfill');"
        "var msg=document.getElementById('lmsg'),ttl=document.getElementById('ltitle');"
        "var b=document.querySelector(\"button[type=submit]\");"
        "l.style.display='flex';"
        "if(b){b.disabled=true;b.textContent='⏳ Enviando…';}"
        "var xhr=new XMLHttpRequest();"
        "xhr.open('POST',form.action,true);"
        "xhr.upload.onprogress=function(ev){"
        "if(!ev.lengthComputable)return;"
        "var pct=Math.round(ev.loaded/ev.total*100);"
        "fill.style.width=pct+'%';"
        "msg.innerHTML=pct+'% enviado ('+fmtMB(ev.loaded)+' de '+fmtMB(ev.total)+')<br><b>Não feche esta página.</b>';"
        "if(pct>=100){ttl.textContent='Enviado! Preparando o processamento…';}"
        "};"
        "xhr.onload=function(){"
        "if(xhr.status>=200&&xhr.status<400){"
        "ttl.textContent='Processando seu vídeo…';"
        "msg.innerHTML='Analisando, transcrevendo e renderizando.<br><b>Não feche esta página.</b>';"
        "fill.style.width='100%';"
        "setTimeout(function(){window.location=xhr.responseURL||'/trabalhos';},700);"
        "}else{"
        "l.style.display='none';"
        "if(b){b.disabled=false;b.textContent='▶ Processar vídeo';}"
        "alert('Erro no envio ('+xhr.status+'). Tente novamente.');"
        "}};"
        "xhr.onerror=function(){"
        "l.style.display='none';"
        "if(b){b.disabled=false;b.textContent='▶ Processar vídeo';}"
        "alert('Falha de conexão durante o envio. Tente novamente.');"
        "};"
        "xhr.send(new FormData(form));"
        "});"
        "</script>"
        "</body></html>")

PROCESSING = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
              "<meta name='viewport' content='width=device-width, initial-scale=1'>"
              "<meta http-equiv='refresh' content='4'>"
              "<title>Processando…</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
              "<h1>Processando seu vídeo…</h1><div class='spin'></div>"
              "<div class='pbar'><div class='pfill' style='width:__PCT__%'></div></div>"
              "<p class='pstep'>__STEP__</p>"
              "<p class='lead'>A IA está achando os melhores momentos, transcrevendo e renderizando.<br>"
              "Esta página atualiza sozinha — pode deixar aberta.</p>"
              "<pre>__LOG__</pre>"
              "<p><a class='dl ghost' href='/job/__ID__'>Atualizar agora</a></p>"
              "</div></body></html>")

RESULT = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
          "<meta name='viewport' content='width=device-width, initial-scale=1'>"
          "<title>Momentos Virais</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
          "<h1 style='margin:10px 0 20px'>🔥 Momentos Virais</h1>"
          "__TOPBAR__"
          "<div class='grid'>__CARDS__</div>"
          "<p style='margin:26px 0 60px'>__REPORT__ &nbsp; <a class='dl ghost' href='/trabalhos'>📁 Meus trabalhos</a> &nbsp; <a class='dl ghost' href='/'>← Cortar outro vídeo</a></p>"
          "</div>__QUEUE__"
          "<div id='vmodal' class='vmodal'><div class='vbox'>"
          "<button class='vclose' onclick='closeVid()' title='Fechar'>✕</button>"
          "<video id='vplayer' controls autoplay playsinline></video>"
          "</div></div>"
          "<script>"
          "function playVid(u){var v=document.getElementById('vplayer');v.src=u;"
          "document.getElementById('vmodal').style.display='flex';v.play();}"
          "function closeVid(){var v=document.getElementById('vplayer');v.pause();v.src='';"
          "document.getElementById('vmodal').style.display='none';}"
          "var m=document.getElementById('vmodal');"
          "m.addEventListener('click',function(e){if(e.target===this)closeVid();});"
          "document.addEventListener('keydown',function(e){if(e.key==='Escape')closeVid();});"
          "function _fbcopy(txt){var ta=document.createElement('textarea');ta.value=txt;"
          "ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();"
          "try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);}"
          "function copyText(txt,btn){var done=function(){var o=btn.textContent;"
          "btn.textContent='✅ Copiado!';setTimeout(function(){btn.textContent=o;},1300);};"
          "if(navigator.clipboard&&navigator.clipboard.writeText){"
          "navigator.clipboard.writeText(txt).then(done,function(){_fbcopy(txt);done();});}"
          "else{_fbcopy(txt);done();}}"
          "function copiarEl(id,btn){copyText(document.getElementById(id).innerText,btn);}"
          "function copiarTudo(i){"
          "var t=document.getElementById('ct_t'+i).innerText;"
          "var d=document.getElementById('ct_d'+i).innerText;"
          "var h=document.getElementById('ct_h'+i).innerText;"
          "copyText([t,d,h].filter(Boolean).join('\\n\\n'),document.getElementById('cb'+i));}"
          "</script></body></html>")


JOBS_PAGE = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
             "<meta name='viewport' content='width=device-width, initial-scale=1'>"
             "<title>Meus trabalhos</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
             "<h1>📁 Meus trabalhos</h1>"
             "<p class='lead'>__N__ trabalho(s) guardado(s). Clique em <b>Abrir</b> para ver os cortes, "
             "baixar os vídeos e as legendas.</p>"
             "__JOBS__"
             "</div></body></html>")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    print(f"\n🎬 Cortador de Vídeos — abra no navegador: http://localhost:{port}\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
