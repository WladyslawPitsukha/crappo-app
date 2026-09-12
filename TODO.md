# Crappo App Improvement Plan

## Status legend

- [x] completed
- [~] started or partially complete
- [ ] not started

## 1. Project snapshot

This project is already a strong frontend prototype for a crypto landing page + dashboard. It has:

- [x] a polished landing page for a crypto brand
- [x] coin detail pages for Bitcoin, Ethereum, and Litecoin
- [x] a protected dashboard experience
- [x] local authentication with login/register/logout
- [x] market data utilities and chart components
- [x] a working test suite with Vitest + Testing Library

The app is in a good state for a portfolio/demo product, but it is not yet a "perfect" production-grade crypto app. Several parts are still static or mock-based and need deeper product functionality, stronger data architecture, and better UX polish.

---

## 2. What is already good

### Frontend foundation
- [x] Next.js + TypeScript structure is clean and easy to extend
- [x] Landing page has a clear visual hierarchy and modern styling
- [x] App uses reusable component patterns and route organization
- [x] Dashboard already includes a richer interactive layout
- [x] Styling is consistent with a dark crypto theme

### Functional coverage
- [x] Auth login/register/logout logic is working
- [x] Market utility tests exist for success/failure and rate limiting
- [x] Chart cleanup lifecycle is covered
- [x] CTA + navigation tests are present
- [x] A reasonable test base is already established

### Product direction
- [x] The app clearly follows a crypto investment brand
- [x] The layout is aligned with real investor-dashboard UX patterns
- [x] Coin pages and stat sections match the target domain

---

## 3. Current gaps

### A. Auth is still local/demo-only
Current auth uses browser localStorage and a seeded demo user.
This is fine for a prototype, but it is not production-grade.

Needs:
- [~] real backend auth foundation exists, but the frontend still uses localStorage
- [x] password hashing foundation
- [ ] email verification flow
- [ ] reset password flow
- [~] protected API sessions foundation exists, but frontend integration is pending

### B. Data is still mostly mocked or simulated
Some values are static samples, and some charts render with generated data.
This is good for UI development, but not enough for a serious crypto app.

Needs:
- [~] real market data integration foundation exists, but dashboard integration is pending
- [ ] real historical charts
- [~] portfolio models and endpoints exist, but values are not connected to the dashboard
- [~] transaction persistence endpoint exists, but the frontend flow is pending

### C. Dashboard is not yet a complete product
The dashboard is richer, but it still feels like a prototype dashboard, not a full app.

Needs:
- [ ] real portfolio management in the frontend
- [ ] buy/sell actions
- [ ] transaction modals
- [ ] portfolio tracking and analytics from persisted data
- [ ] watchlist and active assets

### D. Some charts and data flows still need stabilization
- [x] ECharts warnings and initialization edge cases previously showed the need for stronger chart lifecycle management.
This is already improved, but should remain part of the QA checklist.

### E. Accessibility and performance still need polishing
The app is generally clean, but many improvements are still possible:
- [ ] stronger focus states
- [ ] semantic form validation patterns
- [ ] reduced motion support
- [ ] lazy loading improvements
- [ ] better mobile UX
- [ ] keyboard navigation for interactive widgets

### F. Stronger backend and persistence architecture is missing
The project needs a real persistence layer if it is to feel complete.

Possible stack choices:
- [ ] Supabase
- [ ] Firebase
- [ ] Prisma + Postgres
- [~] FastAPI + SQLAlchemy + SQLite foundation selected and started

---

## 4. Improvement priorities

### Priority 1: product-critical features
These should be built first because they directly affect usefulness.

1. [~] Real authentication backend
2. [ ] Real portfolio management
3. [~] Real market data integration
4. [ ] Transaction buy/sell flow
5. [~] Persistent user data storage foundation

### Priority 2: product polish
These improve realism and user appeal.

1. [ ] Watchlist with coin search
2. [ ] Trending/movers panel
3. [ ] News and market sentiment cards
4. [ ] Improved chart filters (1D / 1W / 1M / 1Y)
5. [ ] Better account settings page

### Priority 3: quality and release readiness
These are important before calling the app production-ready.

1. [ ] Accessibility audit
2. [ ] Lighthouse/performance pass
3. [ ] Error boundaries and graceful fallbacks
4. [ ] Stronger validation UX
5. [ ] Security review for auth and API flow

---

## 5. Recommended feature roadmap

### Phase 1 — Make it useful
- [~] real login/register with backend persistence
- [ ] real portfolio balances
- [~] transaction records foundation
- [ ] live coin prices and charts
- [ ] watchlist and favorites

### Phase 2 — Make it compelling
- [ ] market news cards
- [ ] trend analysis widgets
- [ ] compare coins by performance
- [ ] wallet summary cards
- [ ] user profile and settings

### Phase 3 — Make it premium
- [ ] dark/light theme toggle
- [ ] advanced chart interactions
- [ ] real-time websocket updates
- [ ] notifications and alerts
- [ ] portfolio recommendations

### Phase 4 — Make it production-grade
- [ ] error monitoring
- [ ] analytics
- [ ] CI/CD pipeline
- [ ] deployment setup
- [ ] environment config and secrets management
- [ ] admin tools

---

## 6. Suggested new files/modules

The project would benefit from these additions:

- [ ] src/lib/auth.ts
- [ ] src/lib/portfolio.ts
- [ ] src/lib/market.ts
- [ ] src/types/user.ts
- [ ] src/types/portfolio.ts
- [ ] src/components/dashboard/PortfolioOverview.tsx
- [ ] src/components/dashboard/Watchlist.tsx
- [ ] src/components/dashboard/TransactionForm.tsx
- [ ] src/components/dashboard/PerformanceChart.tsx
- [ ] src/components/dashboard/RecentActivity.tsx
- [ ] src/components/common/StatCard.tsx
- [ ] src/components/common/EmptyState.tsx

This is a cleaner structure than having everything in a single large dashboard page.

---

## 7. Technical improvements to pursue

### Architecture
- [ ] split business logic from UI logic
- [ ] move static data to config/data files
- [ ] create reusable data hooks
- [ ] keep chart logic centralized

### State management
- [ ] consider a lightweight global store if the app grows
- [ ] avoid overloading component state for portfolio logic
- [ ] separate data fetching from UI rendering

### Performance
- [ ] lazy load chart-heavy sections
- [ ] memoize chart data where useful
- [ ] reduce unnecessary re-renders
- [ ] protect expensive calculations with useMemo

### Accessibility
- [ ] buttons and links must have clear focus styles everywhere
- [ ] tables should remain readable on mobile
- [ ] color contrast should be audited
- [ ] forms should provide better validation messaging

### Security
- [ ] prevent storing plaintext secrets in frontend
- [~] protect API routes with auth checks foundation
- [x] validate user input server-side foundation
- [ ] avoid exposing sensitive logic on the client

---

## 8. Top 10 things to do next

1. [~] Replace localStorage auth with real backend auth
2. [ ] Add real portfolio holdings and portfolio calculations
3. [ ] Connect price data to the dashboard widgets
4. [ ] Add buy/sell transaction flow
5. [ ] Add watchlist and favorites
6. [ ] Add transaction history and activity feed
7. [ ] Improve chart time range controls
8. [ ] Add a profile/settings page
9. [ ] Audit accessibility and mobile usability
10. [ ] Add production deployment and environment setup

---

## 9. Best final vision for the app

The ideal final version of this project should feel like a real crypto investment dashboard, not just a mockup. It should allow a user to:

- [ ] sign in securely through the backend
- [ ] view live market prices in the dashboard
- [ ] manage their portfolio
- [ ] buy and sell crypto assets
- [ ] track profit/loss over time
- [ ] monitor trends and activities
- [ ] access a premium, polished dashboard experience

That would make it feel truly complete and "perfect" for a portfolio project.

---

## 10. Recommended next milestone

The best immediate milestone is:

"Turn the dashboard into a functional portfolio manager with real data and transaction flow."

If this milestone succeeds, the app will already feel much closer to a production-ready crypto product.

---

## 11. Final todo checklist

### Must do next
- [~] replace local auth with real backend auth
- [~] add persistent portfolio storage
- [~] integrate real live market data
- [ ] implement buy/sell transaction flow
- [ ] add watchlist and favorites
- [ ] add better chart filters and real data rendering

### Nice to have
- [ ] news/insights panel
- [ ] profile/settings page
- [ ] notifications and alerts
- [ ] premium dashboard polish
- [ ] advanced analytics and filters

### Release quality
- [ ] accessibility pass
- [ ] performance pass
- [ ] security check
- [ ] deployment config
- [ ] CI/CD setup

---

This file should be treated as the main roadmap for turning the project from a strong frontend prototype into a polished crypto product.
