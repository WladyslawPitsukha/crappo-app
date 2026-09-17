# Crappo Backend

This folder contains the Python FastAPI backend for the Crappo app.

## Setup

1. Create and activate a virtual environment
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

For production, copy `.env.example` to `.env`, set a long random `JWT_SECRET_KEY`, enable `COOKIE_SECURE`, and configure SMTP credentials. Apply `migrations/001_auth_sessions.sql` to existing SQLite databases before starting the upgraded API.

## Endpoints

- GET /health
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/verify/{token}
- POST /auth/password-reset/request
- POST /auth/password-reset/confirm
- GET /auth/profile
- GET /market
- GET /market/history/{coin_id}?days=1|7|30|365
- GET /portfolio
- POST /portfolio/holdings
- POST /portfolio/transactions

## Notes

Run backend tests with `pytest backend/tests` after installing the development test dependencies.
