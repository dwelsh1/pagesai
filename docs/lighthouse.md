# Lighthouse Performance & Quality Checks

This starter integrates **Lighthouse CI (LHCI)** for repeatable performance, a11y, and SEO checks.

## Quick start
1. Run your Notion-Clone locally (default: `https://demo.playwright.dev/todomvc/`).
2. Execute:
   ```bash
   pnpm lighthouse
   # or
   LHCI_URL=https://demo.playwright.dev/todomvc/ pnpm lighthouse:ci
   ```
3. Find results in `.lighthouseci/` (HTML reports + JSON). Commit if you want historical diffs in CI artifacts.

## Thresholds
- Performance ≥ 0.90 (error)
- Best Practices ≥ 0.90 (error)
- Accessibility ≥ 0.90 (warning)
- SEO ≥ 0.90 (warning)

Adjust thresholds in `scripts/lighthouse/lhci.config.js`.
