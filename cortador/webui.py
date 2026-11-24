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
import shutil
import tempfile
import threading
import uuid
from typing import List

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse

from cortador.pipeline import PipelineOptions, run_pipeline
from cortador.styles import list_styles

app = FastAPI(title="Cortador de Vídeos com Legenda")

BASE_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output_web")
os.makedirs(BASE_OUT, exist_ok=True)

# jobs em andamento/feitos: id -> {status, out_dir, log, report}
JOBS: dict = {}
JOBS_LOCK = threading.Lock()


def _fmt_status(job: dict) -> str:
    return job.get("status", "…")


@app.get("/", response_class=HTMLResponse)
def home():
    styles = list_styles()
    opts = "\n".join(f'<option value="{s["key"]}">{s["label"]} — {s["description"]}</option>' for s in styles)
    return PAGE.replace("__STYLE_OPTIONS__", opts)


@app.post("/processar")
async def processar(
    video: UploadFile = File(...),
    n_cortes: int = Form(5),
    formato: str = Form("9:16"),
    estilo: str = Form("gaming_bold"),
    jogo: str = Form("GTA RP"),
    idioma: str = Form("pt"),
    emoji: str = Form("on"),
    barra: str = Form("on"),
):
    job_id = uuid.uuid4().hex[:12]
    out_dir = os.path.join(BASE_OUT, job_id)
    os.makedirs(out_dir, exist_ok=True)

    # salva o vídeo enviado
    ext = os.path.splitext(video.filename or "video.mp4")[1] or ".mp4"
    tmp_video = os.path.join(out_dir, f"entrada{ext}")
    with open(tmp_video, "wb") as f:
        shutil.copyfileobj(video.file, f)

    with JOBS_LOCK:
        JOBS[job_id] = {"status": "processando", "out_dir": out_dir, "log": [], "report": None}

    def _run():
        try:
            opts = PipelineOptions(
                output_dir=out_dir,
                count=int(n_cortes),
                target_format=formato,
                style=estilo,
                game=jogo,
                language=idioma,
                emoji=(emoji == "on"),
                progress_bar=(barra == "on"),
                render_video=True,
            )
            def log(msg):
                with JOBS_LOCK:
                    JOBS[job_id]["log"].append(str(msg))
            report = run_pipeline(tmp_video, opts, log=log)
            with JOBS_LOCK:
                JOBS[job_id]["report"] = report
                JOBS[job_id]["status"] = "pronto"
        except Exception as e:  # pragma: no cover
            with JOBS_LOCK:
                JOBS[job_id]["status"] = "erro"
                JOBS[job_id]["log"].append(f"ERRO: {e}")

    threading.Thread(target=_run, daemon=True).start()
    return RedirectResponse(url=f"/job/{job_id}", status_code=303)


@app.get("/job/{job_id}", response_class=HTMLResponse)
def job_page(job_id: str):
    with JOBS_LOCK:
        job = JOBS.get(job_id)
    if not job:
        return HTMLResponse("<h3>Job não encontrado.</h3>", status_code=404)

    if job["status"] == "processando":
        log_html = "<br>".join(job["log"][-12:]) or "Iniciando…"
        return (
            PROCESSING.replace("__ID__", job_id).replace("__LOG__", log_html)
        )

    if job["status"] == "erro":
        return HTMLResponse(f"<h3>Erro no processamento</h3><pre>{job['log'][-1]}</pre>")

    # pronto: monta resultados
    report = job["report"] or {"clips": []}
    out_dir = job["out_dir"]
    cards = []
    for c in report.get("clips", []):
        m = c.get("metadata", {})
        v = c.get("virality", {})
        fname = c.get("file")
        base = os.path.splitext(fname)[0] if fname else ""
        links = []
        if fname:
            links.append(f'<a class="dl" href="/saida/{job_id}/cortes/{fname}">⬇ MP4</a>')
        for key in ("srt", "ass"):
            sub = (c.get("subtitles") or {}).get(key)
            if sub:
                links.append(f'<a class="dl ghost" href="/saida/{job_id}/cortes/{sub}">{key.upper()}</a>')
        cards.append(f"""
        <div class="card">
          <div class="vtag">{v.get('label','')} · <b>{v.get('total','')}</b>/100</div>
          <h3>{m.get('title','(sem título)')}</h3>
          <div class="meta">{m.get('hashtags_str','')}</div>
          <div class="desc">{(m.get('description','') or '').splitlines()[0] if m.get('description') else ''}</div>
          <div class="links">{' '.join(links)}</div>
        </div>""")

    report_link = ""
    if os.path.exists(os.path.join(out_dir, "report.md")):
        report_link = f'<a class="dl" href="/saida/{job_id}/report.md">📄 Relatório completo</a>'

    return RESULT.replace("__CARDS__", "\n".join(cards) or "<p>Nenhum corte gerado.</p>").replace(
        "__REPORT__", report_link
    ).replace("__ID__", job_id)


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
"""

PAGE = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width, initial-scale=1'>"
        "<title>Cortador de Vídeos com Legenda</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
        "<h1>🎬 Cortador de Vídeos com Legenda</h1>"
        "<p class='lead'>Suba a live, escolha as opções e receba os melhores cortes (1–3 min) "
        "com legenda profissional, título, hashtags e score de viralidade. "
        "<b>100% privado:</b> o vídeo é processado aqui, nada é enviado para fora.</p>"
        "<form class='form' action='/processar' method='post' enctype='multipart/form-data'>"
        "<label>Vídeo / Live (mp4, mov…)</label>"
        "<input type='file' name='video' accept='video/*' required>"
        "<div class='row'>"
        "<div><label>Nº de cortes</label><input type='number' name='n_cortes' value='5' min='1' max='20'></div>"
        "<div><label>Formato de saída</label><select name='formato'>"
        "<option value='auto'>Auto (detectar)</option><option value='9:16' selected>9:16 (vertical)</option>"
        "<option value='16:9'>16:9 (horizontal)</option><option value='1:1'>1:1</option><option value='4:5'>4:5</option>"
        "</select></div>"
        "</div>"
        "<div class='row'>"
        "<div><label>Modelo de legenda</label><select name='estilo'>__STYLE_OPTIONS__</select></div>"
        "<div><label>Jogo / nicho (para os títulos)</label><input type='text' name='jogo' value='GTA RP'></div>"
        "</div>"
        "<label>Idioma da transcrição</label><input type='text' name='idioma' value='pt'>"
        "<div class='chk'><input type='checkbox' name='emoji' checked> Usar emoji nas legendas</div>"
        "<div class='chk'><input type='checkbox' name='barra' checked> Mostrar barra de progresso</div>"
        "<button class='btn' type='submit'>▶ Processar vídeo</button>"
        "</form>"
        "<p class='lead' style='margin-top:22px;font-size:13px'>O processamento pode levar alguns minutos em lives longas "
        "(transcrição + renderização).</p>"
        "</div></body></html>")

PROCESSING = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
              "<meta name='viewport' content='width=device-width, initial-scale=1'>"
              "<meta http-equiv='refresh' content='5'>"
              "<title>Processando…</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
              "<h1>Processando…</h1><div class='spin'></div>"
              "<p class='lead'>Estamos achando os melhores takes, transcrevendo e renderizando as legendas.<br>"
              "Esta página atualiza sozinha.</p>"
              "<pre>__LOG__</pre>"
              "<p><a class='dl ghost' href='/job/__ID__'>Atualizar agora</a></p>"
              "</div></body></html>")

RESULT = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>"
          "<meta name='viewport' content='width=device-width, initial-scale=1'>"
          "<title>Cortes prontos</title><style>" + _CSS + "</style></head><body><div class='wrap'>"
          "<h1>✅ Cortes prontos!</h1>"
          "<p class='lead'>Baixe os vídeos legendados, as legendas (.srt/.ass) e o relatório.</p>"
          "__CARDS__"
          "<p style='margin-top:20px'>__REPORT__ &nbsp; <a class='dl ghost' href='/'>← Cortar outro vídeo</a></p>"
          "</div></body></html>")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    print(f"\n🎬 Cortador de Vídeos — abra no navegador: http://localhost:{port}\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
