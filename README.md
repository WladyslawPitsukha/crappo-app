# Crappo

<p align="center">
	<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=22&pause=900&color=38BDF8&center=true&vCenter=true&width=720&lines=Track+the+market.;Shape+your+portfolio.;Trade+with+clarity.;Welcome+to+Crappo." alt="Crappo animated tagline" />
</p>

<p align="center">
	<img src="https://img.shields.io/badge/status-active%20prototype-22c55e?style=for-the-badge" alt="Project status: active prototype" />
	<img src="https://img.shields.io/badge/Next.js-14-111827?style=for-the-badge&logo=next.js" alt="Next.js 14" />
	<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/tests-35%20passing-16A34A?style=for-the-badge" alt="35 tests passing" />
</p>

Crappo is a lively cryptocurrency investment dashboard built with Next.js, React, and TypeScript. It turns noisy market movement into a clear daily workspace: scan live prices, inspect coin performance, shape a personal portfolio, and test buy or sell decisions without losing the thread.

The experience starts with a crypto-focused landing page, moves through Bitcoin, Ethereum, and Litecoin detail views, and opens into a dashboard that reacts to market data. It is designed as a polished product prototype today, with a FastAPI service ready to carry persistence and authenticated portfolio synchronization further.

<p align="center">
	<strong>Live prices</strong> &nbsp; <span aria-hidden="true">&rarr;</span> &nbsp;
	<strong>Portfolio insight</strong> &nbsp; <span aria-hidden="true">&rarr;</span> &nbsp;
	<strong>Confident decisions</strong>
</p>

## Features

- Live Bitcoin, Ethereum, and Litecoin market data from CoinGecko
- Interactive dashboard tabs for overview, performance, and portfolio views
- Portfolio balance, allocation, invested value, and profit/loss calculations
- Buy and sell demo transactions with per-user local persistence
- Login, registration, protected dashboard access, and logout behavior
- Coin detail pages with charts and market activity components
- Loading, retry, rate-limit, timeout, and error states for market requests
- Automated tests with Vitest and Testing Library
- FastAPI backend foundation with JWT auth, SQLite, and portfolio endpoints

## Product feel

- **See the signal:** live market cards surface price, change, and volume without burying the important numbers.
- **Move with intention:** buy and sell controls update holdings, average cost, allocation, balance, and P&L together.
- **Keep the rhythm:** loading, retry, rate-limit, timeout, and empty states make the dashboard feel responsive even when market APIs are not.
- **Stay oriented:** focused tabs and coin pages give the product a clear flow from discovery to portfolio action.

## Tech stack

- Next.js 14 and React 18
- TypeScript
- Tailwind CSS
- ECharts and Recharts
- FastAPI, SQLAlchemy, SQLite, and JWT for the backend foundation
- Vitest, jsdom, and Testing Library for tests

## Getting started

### Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Useful commands:

```bash
npm run typecheck
npm test -- --run
npm run build
```

### Backend

The backend lives in `backend/` and requires Python 3.11 or newer.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API exposes health, authentication, market, portfolio, holdings, and transaction endpoints. See [backend/README.md](backend/README.md) for the endpoint list.

## Project structure

```text
src/app/          Next.js routes and pages
src/components/   Shared UI and authentication components
src/utils/        Market data and application utilities
src/app/dashboard Interactive portfolio dashboard
backend/app/      FastAPI service, models, schemas, and auth
test/             Frontend unit and component tests
```

## Current status

Crappo is a polished frontend product prototype with a working live market-data dashboard and local demo portfolio workflow. The FastAPI service is the foundation for the next step: replacing local persistence with authenticated backend portfolio synchronization.