# Testing Plan
- Unit: Vitest + Testing Library; Zod validators, route logic via direct imports, components.
- Integration: components + mocked fetch.
- E2E: Playwright login → create page → search → basic editor save → reorder (happy path).
- Coverage targets: lines/functions/statements ≥90%, branches ≥85%.
- Commands: `pnpm test:watch` `pnpm test:unit` `pnpm coverage` `BASE_URL=http://localhost:3000 pnpm test`.
