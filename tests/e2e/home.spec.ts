import { test, expect } from '@fixtures/base';

test.describe('Home', () => {
  test('opens home and renders app shell', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertLoaded();
  });

  test('can create a new page (demo)', async ({ page }) => {
    await page.goto('/');
    // Example interaction; adjust selectors to your app:
    await page.getByRole('button', { name: /new page/i }).click();
    await page.getByPlaceholder(/untitled/i).fill('My first doc');
    await expect(page.getByText('My first doc')).toBeVisible();
  });
});
