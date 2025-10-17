# Notion‑Clone E2E Starter (Playwright + TypeScript)

A production‑ready Playwright starter focused on **TypeScript**, **Page Objects**, **fixtures**, and a lean but powerful toolchain (HTML + Allure reports, traces, a11y checks, CI).

## Why this template
- **Best practices**: Playwright Test runner, POM, per‑suite fixtures, CI‑friendly config.
- **DX**: ESLint + Prettier, fast runs, helpful scripts.
- **Quality**: Traces, screenshots/video on failure, optional Allure results, basic a11y and API examples.

## Quick start
```bash
# 1) Install dependencies
npm ci

# 2) Install Playwright browsers
npm run install:playwright

# 3) Run tests locally (headless)
npm test

# (Optional) UI Mode
npm run test:ui

# (Optional) Debug
npm run test:debug
```

> Set `BASE_URL` to your Notion‑clone URL (e.g., `https://demo.playwright.dev/todomvc/`):
```bash
BASE_URL=https://demo.playwright.dev/todomvc/ npm test
```

## Project structure
```text
├─ .github/workflows/playwright.yml      # CI
├─ playwright.config.ts                  # Projects, reporter, timeouts, baseURL
├─ src/
│  ├─ fixtures/                          # Custom test fixtures
│  ├─ pages/                             # Page Objects
│  ├─ utils/                             # Utilities (logger, etc.)
│  └─ api/                               # API client helpers
├─ tests/
│  ├─ e2e/                               # UI tests
│  ├─ api/                               # API tests
│  ├─ accessibility/                     # a11y tests (axe)
│  └─ visual/                            # basic visual examples
├─ reports/                              # HTML & Allure outputs (CI artifacts)
└─ package.json
```

## Reports
- **HTML**: `npm run show-report` (after a run)
- **Allure** (results only by default): generated under `reports/allure-results`

## Storage state (login)
- Recommended: create a setup that logs in once and saves storage to a JSON file:
  - Run a dedicated setup test (or script) to authenticate and write `STORAGE_STATE=.auth/user.json`
  - Then export `STORAGE_STATE=.auth/user.json` when running tests or set via CI secrets

## CI
GitHub Actions workflow is provided in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). Artifacts include HTML report and Playwright traces.

## Next steps
- Map selectors to your app and flesh out Page Objects.
- Add more fixtures (e.g., `workspaceFixture`, `docFactory`).
- Consider adding Lighthouse and performance budgets once your app stabilizes.
- If you need BDD, add `@cucumber/cucumber` in a separate runner (don’t mix with PW Test).

---

## ✨ New: Visual Snapshots & Lighthouse

This template now includes:

- **Visual snapshots** with Playwright (`expect(page).toHaveScreenshot`) — see `docs/visual-testing.md`.
- **Lighthouse CI** for performance/a11y/SEO checks — see `docs/lighthouse.md`.

**Commands**

```bash
# Visual baseline, then test
pnpm test:update-snapshots
pnpm test

# Lighthouse (default URL https://demo.playwright.dev/todomvc/)
pnpm lighthouse
LHCI_URL=https://demo.playwright.dev/todomvc/ pnpm lighthouse:ci
```

**Where reports live**

- Playwright: `playwright-report/` after a run.
- Lighthouse: `.lighthouseci/` (HTML + JSON).
```


## Targets (BASE_URL)
The test target defaults to **Playwright TodoMVC**: `https://demo.playwright.dev/todomvc/` when `BASE_URL` is not set.
Override per-run:
```bash
BASE_URL=http://localhost:3000 pnpm test
BASE_URL=https://staging.example.com pnpm lighthouse:ci
```
