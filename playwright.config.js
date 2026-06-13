// Configuration Playwright — un seul navigateur (Chromium) comme demande
// par CLAUDE.md du projet. live-server est demarre automatiquement par
// Playwright avant les tests et tue a la fin.

const { defineConfig, devices } = require('@playwright/test');

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `npx live-server --no-browser --port=${PORT} --quiet`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
