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

## Endpoints

- GET /health
- POST /auth/register
- POST /auth/login
- GET /auth/profile
- GET /market
- GET /portfolio
- POST /portfolio/holdings
- POST /portfolio/transactions

## Notes

This backend is intentionally structured as a clean foundation for the next phase of portfolio management and persistence.
