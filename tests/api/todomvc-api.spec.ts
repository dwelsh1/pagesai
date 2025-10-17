import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/';

test.describe('TodoMVC – API/Network checks', () => {
  test('GET landing page returns 200 and HTML', async ({ request }) => {
    const res = await request.get(BASE_URL);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/text\/html/);
    const body = await res.text();
    expect(body).toMatch(/TodoMVC|Playwright/);
  });

  test('static assets are reachable (CSS/JS)', async ({ request }) => {
    // Known assets from the demo app (paths are stable)
    const css = await request.get(new URL('node_modules/todomvc-app-css/index.css', BASE_URL).toString());
    expect(css.status()).toBe(200);

    const js = await request.get(new URL('js/app.js', BASE_URL).toString());
    expect(js.status()).toBe(200);
    const txt = await js.text();
    expect(txt.length).toBeGreaterThan(1000);
  });
});
