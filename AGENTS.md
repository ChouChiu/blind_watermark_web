# Blind Watermark Web

Monorepo: FastAPI backend (`backend/`) + Next.js 16 frontend (`frontend/`). Chinese UI (zh-CN). No test suite. CI deploys to VPS on push to `main` (no lint/test gate).

## Next.js 16 — NOT the Next.js you know

Next.js 16 has breaking changes vs your training data. APIs, conventions, and file structure may differ. Before writing frontend code, check `node_modules/next/dist/` for docs or migration guides. Heed deprecation notices.

## Commands

```bash
# Start both services (from repo root)
./dev.sh

# Frontend (from frontend/)
bun run dev        # dev server :3000
bun run build      # production build
bun run lint       # biome check (NOT eslint)
bun run format     # biome check --write (auto-fix)

# Backend (from backend/)
source .venv/bin/activate
uvicorn main:app --reload --port 8000
# Or use ./run.sh (activates venv + starts uvicorn)
```

Backend venv setup: `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`

## Architecture

- **Backend**: FastAPI, single router `routers/watermark.py` at `/api/*`. Endpoints: `/api/embed`, `/api/extract`, `/api/capacity`, `/api/health`. Uses `blind-watermark` Python lib (DCT+SVD). Heavy image ops run in `asyncio.to_thread`.
- **Frontend**: Next.js App Router. Two pages: `/embed` and `/extract`. Components in `components/`, shadcn/ui primitives in `components/ui/`.
- **API contract**: Multipart form uploads, max 10MB per file. Backend returns JSON with `success` boolean. CORS defaults to `localhost:3000`, configurable via `CORS_ORIGINS` env var.
- **Frontend API base**: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`). See `frontend/lib/api.ts`.

## Backend quirk: multiprocessing patch

`services/watermark_service.py` monkey-patches `multiprocessing.set_start_method` at import time. The `blind_watermark` lib calls `set_start_method('fork')` which conflicts with uvicorn. The patch is safe because only sequential mode is used. Do not remove it.

## Frontend style (Biome, not Prettier)

- Tabs for indentation, double quotes for JS/TS
- Config: `frontend/biome.json`
- Lint: `bun run lint` / Fix: `bun run format` (both use Biome, not eslint)
- eslint is in devDependencies (for next.js compat) but Biome is the actual linter
- Package manager: bun (`bun.lock`)
- UI: shadcn (base-nova style), Tailwind v4, lucide-react icons
- Path alias: `@/*` maps to frontend root

## Key patterns

- Image uploads use `FormData` + `fetch` to `localhost:8000/api/*`
- `react-compare-slider` for before/after image comparison
- Password fields are integer-based (not strings)
- Three watermark modes: `str` (text), `img` (image), `bit` (binary). Embed supports `str`/`img`; extract supports `str`/`img`/`bit`.
- Backend returns base64-encoded images in JSON responses
- Dark mode by default (hardcoded `dark` class on `<html>` in `layout.tsx`)
- In dev, frontend calls backend directly at `localhost:8000`. In Docker/prod, `next.config.ts` rewrites `/api/*` to `BACKEND_URL` (defaults to `http://backend:8000` inside compose network).

## Production / Docker

- `docker-compose.yml`: backend on host `:8001`, frontend on host `:3080`. Prod URL: `https://bww.wwchun.top`.
- Backend CORS is configurable via `CORS_ORIGINS` env var (comma-separated).
- `deploy.sh` tars the repo (excluding `.venv`, `node_modules`, `.next`, `.git`), SCPs to VPS, runs `docker compose up --build`.
- CI (`.github/workflows/deploy.yml`) SSHes into the VPS, does `git pull`, then `docker compose up --build`. No tests run in CI.
