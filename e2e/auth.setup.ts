import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Usuário').fill('testuser');
  await page.getByPlaceholder('Senha').fill('testpass123');
  await page.getByRole('button', { name: 'Entrar no Hub' }).click();

  // Wait for redirect to /hub - increasing timeout for CI/dev environments
  await expect(page).toHaveURL(/.*\/hub/, { timeout: 15000 });
  
  await page.context().storageState({ path: authFile });
});
