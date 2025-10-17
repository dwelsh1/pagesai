import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/';

test.describe('Playwright TodoMVC – basic flows', () => {
  test('can add and complete todos', async ({ page }) => {
    await page.goto(BASE_URL);
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write E2E tests');
    await input.press('Enter');
    await input.fill('Wire Lighthouse');
    await input.press('Enter');
    await input.fill('Add visual snapshots');
    await input.press('Enter');

    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(3);

    // Complete first item
    await todos.nth(0).locator('.toggle').check();
    await expect(todos.nth(0)).toHaveClass(/completed/);

    // Filter active and verify 2 remain
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li')).toHaveCount(2);
  });

  test('persists across reload via localStorage', async ({ page }) => {
    await page.goto(BASE_URL);
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Persist me');
    await input.press('Enter');
    await page.reload();
    await expect(page.locator('.todo-list li')).toContainText(['Persist me']);
  });
});
