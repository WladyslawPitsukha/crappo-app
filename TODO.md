# Crappo App Remaining Work

This file contains only work that is still outstanding after the authentication, market-data, portfolio, transaction, analytics, and basic watchlist implementation.

## Architecture And State

- [ ] Split dashboard business logic from UI components.
- [x] Move asset configuration and static display data into dedicated data modules.
- [ ] Create reusable auth, portfolio, market, and chart data hooks.
- [x] Centralize chart configuration and historical-data transformation.
- [ ] Separate portfolio fetching and mutation state from presentation state.
- [ ] Add shared dashboard components for portfolio overview, watchlist, trades, charts, and activity.

## Performance And Accessibility

- [ ] Lazy-load chart-heavy dashboard sections.
- [ ] Reduce unnecessary dashboard re-renders and protect expensive calculations.
- [ ] Add reduced-motion support.
- [ ] Audit keyboard navigation and focus states.
- [ ] Audit color contrast and semantic form validation.
- [ ] Improve mobile layouts and table-like data presentation.
- [ ] Run a Lighthouse and bundle-performance pass.
- [ ] Add error boundaries and graceful loading/error fallbacks.

## Production And Operations

- [ ] Add backend runtime tests and database migration tests.
- [ ] Add error monitoring and application logging.
- [ ] Add environment configuration and secrets management.
- [ ] Add deployment configuration for the Next.js frontend and FastAPI backend.
- [ ] Add CI/CD with typecheck, tests, backend checks, and migration verification.
- [ ] Add health checks and operational documentation.

## Remaining Vision

- [ ] Add real-time price updates or WebSocket support.
- [ ] Add notifications and price alerts.
- [ ] Add advanced chart interactions and portfolio recommendations.
