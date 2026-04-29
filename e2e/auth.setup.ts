import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Aguarda hidratação do React
  await page.getByPlaceholder('Ex: joaosilva').fill('testuser');
  await page.getByPlaceholder('••••••••').fill('testpass123');
  await page.getByRole('button', { name: 'Acessar Plataforma' }).click();

  // Wait for redirect to /hub or /portal/paciente - increasing timeout for CI/dev environments
  await expect(page).toHaveURL(/.*\/(hub|portal\/paciente)/, { timeout: 15000 });
  
  await page.context().storageState({ path: authFile });
});
