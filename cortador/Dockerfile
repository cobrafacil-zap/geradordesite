# Imagem do Cortador de Vídeos — roda a interface web com ffmpeg + transcrição.
# Serve para Fly.io / Railway / Render / qualquer Docker.

FROM python:3.11-slim

# ffmpeg (corta/renderiza) + fontes para as legendas
RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# dependências (CLI de vídeo + web + Speech Enhancer)
COPY requirements-cli.txt requirements.txt ./
RUN pip install --no-cache-dir -r requirements-cli.txt -r requirements.txt \
        python-multipart fastapi uvicorn demucs soundfile

# código da aplicação
COPY . .

# pré-baixa o modelo de transcrição (evita atraso no primeiro uso)
ARG WHISPER_MODEL=small
RUN python -c "from faster_whisper import WhisperModel; WhisperModel('${WHISPER_MODEL}', device='cpu', compute_type='int8')"

ENV PORT=8000
ENV WHISPER_MODEL=${WHISPER_MODEL}
EXPOSE 8000

CMD ["python", "webui.py"]
