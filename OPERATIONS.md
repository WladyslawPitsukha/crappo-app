# Crappo Operations Guide

## Local startup

1. Copy `.env.example` to `.env` in the repository root.
2. Copy `backend/.env.example` to `backend/.env` and set a development JWT secret.
3. Install frontend dependencies with `npm ci`.
4. Install backend dependencies with `pip install -r backend/requirements.txt`.
5. Start the API with `uvicorn app.main:app --app-dir backend --reload --port 8000`.
6. Start the frontend with `npm run dev`.

The Docker path is `docker compose up --build`. Production should provide the backend `.env` through the deployment secret store rather than committing it.

## Checks

- Liveness: `GET /health`
- Readiness: `GET /health/ready`
- Frontend typecheck: `npm run typecheck`
- Frontend tests: `npm test`
- Backend tests: `python -m pytest backend/tests`
- Migration runner: `python -m app.migrations` from `backend`, with `DATABASE_PATH` set when needed.

## Deployments

The frontend uses the standalone Next.js image and listens on port 3000. The API listens on port 8000. Configure `NEXT_PUBLIC_API_URL`, `FRONTEND_URL`, `JWT_SECRET_KEY`, `COOKIE_SECURE`, SMTP settings, and optional `SENTRY_DSN` in the deployment secret manager.

Apply database migrations before rolling out a backend image. Keep a backup of the SQLite database before migrations and retain the previous image for rollback.

## Incident response

Check `/health/ready`, container logs, and Sentry events first. Revoke affected sessions through the session store if credentials may be compromised. If the provider is unavailable, the frontend retains local portfolio fallback while market requests show an explicit error state.