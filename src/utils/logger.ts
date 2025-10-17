// Simple logger helper; replace with pino/winston if desired.
export const log = (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log('[e2e]', ...args);
};
