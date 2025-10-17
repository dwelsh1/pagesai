import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setupTests.ts'],
    globals: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      lines: 90, functions: 90, branches: 85, statements: 90,
      exclude: ['**/*.d.ts','playwright.config.*','test/**','scripts/**']
    },
    include: ['src/**/*.test.{ts,tsx}','app/**/*.test.{ts,tsx}']
  }
});
