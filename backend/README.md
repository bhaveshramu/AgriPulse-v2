# AgriPulse FastAPI backend (Part 2A)

This folder adds a FastAPI API alongside the existing React frontend. It does
not replace the frontend, change Supabase tables, call external APIs, run ML,
or process payments.

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

To use the connected profile, farm, and crop pages locally, set the frontend's
`VITE_API_BASE_URL=http://localhost:8000` in its local environment file, then
start the existing frontend in a separate terminal. The frontend sends the
current Supabase access token with each API call.

## Run tests

From `backend/`:

```powershell
pytest
```

## Architecture

- `app/main.py` configures FastAPI, CORS, logging, and safe JSON errors.
- `app/api/routes/` contains the route modules. Part 2B provides authenticated
  profile, farm, and farm-scoped crop APIs; the remaining domains only expose
  module health endpoints.
- `app/core/security.py` is the future dependency for validating the Supabase
  bearer token received from the frontend. It uses the anonymous key and never
  uses the service-role key for user authentication.
- `app/db/supabase.py` forwards the user's bearer token to Supabase PostgREST,
  keeping ordinary profile/farm/crop operations subject to existing RLS.
- `app/services/` and `app/repositories/` remain focused extension points for
  future business logic and Supabase/PostgreSQL access.
- `app/schemas/disease.py` reserves the structured future model output for
  Tomato and Potato Late Blight; no model or image endpoint exists yet.

Historical `market_data` and forecast `market_predictions` remain separate
database concerns, as defined by the existing Supabase migrations.
