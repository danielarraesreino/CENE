import { test, expect } from '@playwright/test';

test('has login title and inputs', async ({ page }) => {
  await page.goto('/login');

  await expect(page).toHaveTitle(/Rei Bebê/);
  await expect(page.getByText('Acesso ao Hub')).toBeVisible();
  
  const usernameInput = page.getByPlaceholder('Usuário');
  const passwordInput = page.getByPlaceholder('Senha');
  
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
});

test('shows error on invalid login', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByPlaceholder('Usuário').fill('wronguser');
  await page.getByPlaceholder('Senha').fill('wrongpass');
  await page.getByRole('button', { name: 'Entrar no Hub' }).click();
  
  await expect(page.getByText(/Credenciais inválidas/i)).toBeVisible({ timeout: 10000 });
});
