import { test, expect } from '@fixtures/base';
import { getHealth } from '@api/client';

test('API health endpoint returns OK', async ({ api }) => {
  const json = await getHealth(api);
  // shape depends on your app; adjust accordingly
  expect(json.status || json.ok).toBeTruthy();
});
