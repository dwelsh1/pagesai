import { test, expect } from '@playwright/test';

test.describe('Visual snapshots – homepage', () => {
  test('should match homepage layout', async ({ page }) => {
    const baseUrl = process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/';
    await page.goto(baseUrl);
    // Wait for main shell to render; tweak selector for your app
    await page.waitForSelector('main, [data-testid="app-shell"]', { state: 'visible' });
    // Take a full-page visual snapshot. First run will create baseline when using test:update-snapshots
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
