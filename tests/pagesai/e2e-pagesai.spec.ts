import { test, expect } from '@playwright/test';
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
test('login and create a page', async ({ page }) => {
  await page.goto(BASE_URL + '/(auth)/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('Passw0rd!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(BASE_URL + '/');
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.locator('text=Untitled')).toBeVisible();
});
