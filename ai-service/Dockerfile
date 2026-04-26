# Dockerfile — Tool-04 AI Microservice
# Tool-04 | Risk Appetite Framework
#
# Build:  docker build -t tool04-ai .
# Run:    docker run -p 5000:5000 --env-file .env tool04-ai

FROM python:3.11-slim

# ── System dependencies ────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ── Working directory ──────────────────────────────────────────────────────
WORKDIR /app

# ── Python dependencies ────────────────────────────────────────────────────
# Copy requirements first so Docker caches this layer unless requirements change
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Application source ─────────────────────────────────────────────────────
COPY . .

# ── Runtime ───────────────────────────────────────────────────────────────
EXPOSE 5000

# Health check — Docker Compose uses this for depends_on condition
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Production server: gunicorn with 2 sync workers
# For dev: override with CMD ["python", "app.py"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "app:app"]
