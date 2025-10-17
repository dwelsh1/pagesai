// Lighthouse CI configuration
// Usage: set LHCI_URL to your running app or default to http://localhost:3000
//   pnpm lighthouse
//   LHCI_URL=http://localhost:4000 pnpm lighthouse:ci
const url = process.env.LHCI_URL || 'https://demo.playwright.dev/todomvc/';

module.exports = {
  ci: {
    collect: {
      url: [url],
      numberOfRuns: 3,
      settings: { preset: 'desktop' }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci'
    }
  }
};
