import { test as base, expect, Page, APIRequestContext } from '@playwright/test';
import { HomePage } from '@pages/HomePage';

type Fixtures = {
  homePage: HomePage;
  api: APIRequestContext;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const home = new HomePage(page);
    await use(home);
  },
  api: async ({ request }, use) => {
    await use(request);
  },
});

export { expect };
