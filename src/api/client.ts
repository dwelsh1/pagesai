import { APIRequestContext, expect } from '@playwright/test';

export async function getHealth(api: APIRequestContext) {
  const res = await api.get('/api/health');
  expect(res.ok()).toBeTruthy();
  return res.json();
}
