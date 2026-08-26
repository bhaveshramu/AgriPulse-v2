# AgriPulse FastAPI backend (Part 2A)

This folder adds a small Python/FastAPI foundation alongside the existing React
frontend. It does not replace the frontend, change Supabase tables, call
external APIs, run ML, or process payments.

## Prerequisites

Install Python 3.11 or later. From the repository root, create and activate a
virtual environment:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the free, open-source dependencies:

```powershell
python -m pip install -r requirements.txt
```

## Configure environment variables

Copy `.env.example` to `.env`, then fill in the Supabase URL and anonymous key.
Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only; ordinary user endpoints must
use the caller's Supabase access token to preserve RLS. It is not required for
the Part 2A health endpoints.

Set `FRONTEND_ORIGINS` to a comma-separated allowlist for the Vite/TanStack
frontend (the defaults cover common local ports). `APP_DEBUG` and
`APP_LOG_LEVEL` configure backend-only development logging. Do not use a
wildcard origin.

## Run locally

With the environment activated and while in `backend/`:

```powershell
uvicorn app.main:app --reload --port 8000
```

Check `http://localhost:8000/api/health`. Interactive API documentation is at
`http://localhost:8000/docs` in local development.

## Run tests

From `backend/`:

```powershell
pytest
```

## Architecture

- `app/main.py` configures FastAPI, CORS, logging, and safe JSON errors.
- `app/api/routes/` has the Part 2A route modules. Each currently provides only
  a module health endpoint; no production behavior is simulated.
- `app/core/security.py` is the future dependency for validating the Supabase
  bearer token received from the frontend. It uses the anonymous key and never
  uses the service-role key for user authentication.
- `app/services/` and `app/repositories/` are focused extension points for
  future business logic and Supabase/PostgreSQL access.
- `app/schemas/disease.py` reserves the structured future model output for
  Tomato and Potato Late Blight; no model or image endpoint exists yet.

Historical `market_data` and forecast `market_predictions` remain separate
database concerns, as defined by the existing Supabase migrations.
