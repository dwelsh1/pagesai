# Developer Guide

This project ships with **Playwright Test**, **visual snapshots**, and **Lighthouse CI** pre-wired.
The default test target is **Playwright TodoMVC** (`https://demo.playwright.dev/todomvc/`).

## Prerequisites
- Node.js 20+
- `pnpm` (recommended) or `npm`/`yarn`
- Browsers: installed automatically via `pnpm install` (Playwright postinstall)

## Install
```bash
pnpm install
```

## Running tests
### All tests
```bash
pnpm test
```
Open the UI mode:
```bash
pnpm test:ui
```

### Visual snapshots
Create/update baselines (first run):
```bash
pnpm test:update-snapshots
```
Subsequent runs:
```bash
pnpm test
```
Visual diffs will appear under `test-results/` and the HTML report under `playwright-report/`.

### Targeting environments
`BASE_URL` controls the target. Default is TodoMVC.
```bash
BASE_URL=http://localhost:3000 pnpm test
BASE_URL=https://staging.example.com pnpm lighthouse:ci
```

## Lighthouse CI
Run locally against the default TodoMVC URL:
```bash
pnpm lighthouse
```
Override the URL:
```bash
LHCI_URL=https://your-env.example.com pnpm lighthouse:ci
```
Results are written to `.lighthouseci/`.

## Repo layout
- `tests/` – E2E and API specs
  - `todomvc.spec.ts` – example UI flows
  - `visual/visual-smoke.spec.ts` – visual snapshot example
  - `api/todomvc-api.spec.ts` – API/network checks example
- `docs/` – how-tos (`visual-testing.md`, `lighthouse.md`)
- `scripts/lighthouse/lhci.config.js` – Lighthouse CI configuration

## CI
A GitHub Actions workflow (`.github/workflows/lighthouse.yml`) is included. If you want to run Lighthouse
against a locally started dev server during CI, add steps to start the app and wait for it to be reachable
(e.g., `pnpm dev & npx wait-on $LHCI_URL`).

## Tips
- Keep screenshot baselines stable (pin fonts, disable animations).
- Review visual baseline changes via PR to avoid masking regressions.
- Use Playwright trace viewer (`--trace on`) when debugging failed tests.
