import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        NEXTAUTH_URL: 'http://localhost:3000',
        NEXTAUTH_SECRET: 'rei-bebe-super-secret-key-2026',
        NEXT_PUBLIC_API_URL: 'http://localhost:8000',
      }
    },
    {
      command: 'cd backend && ../venv/bin/python manage.py runserver',
      url: 'http://localhost:8000/api/',
      reuseExistingServer: !process.env.CI,
    }
  ],
});
