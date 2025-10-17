import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  get appTitle() {
    return this.page.getByRole('heading', { name: /notion clone/i });
  }

  async assertLoaded() {
    await expect(this.page).toHaveTitle(/Notion|Notes|Docs/i);
  }
}
