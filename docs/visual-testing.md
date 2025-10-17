# Visual Testing with Playwright

This starter uses **Playwright Test** built-in snapshot assertions.

## Quick start
1. Boot your Notion-Clone app locally (default: `https://demo.playwright.dev/todomvc/`).
2. Run an initial baseline creation:
   ```bash
   pnpm test:update-snapshots # or npm run test:update-snapshots / yarn test:update-snapshots
   ```
3. On subsequent runs:
   ```bash
   pnpm test
   ```
   Any visual diffs will fail the test and produce actual/diff images under `test-results`.

## Notes
- Baselines are stored next to the spec under `__screenshots__`.
- Update baselines intentionally using `test:update-snapshots` and code review changes.
- For stable screenshots, ensure fonts are installed and animations are reduced:
  ```ts
  test.use({ colorScheme: 'light' });
  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' });
  });
  ```
