import { test, expect } from '@fixtures/base';

test.describe('Visual', () => {
  test('home snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('home.png');
  });
});
