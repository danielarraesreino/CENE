import { test, expect } from '@playwright/test';

test.describe('Login Flow CENE', () => {
  test.slow();

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Espera a animação inicial do Framer Motion terminar
    await page.waitForTimeout(1000);
  });

  test('has login title and inputs', async ({ page }) => {
    await expect(page).toHaveTitle(/CENE/);
    await expect(page.getByText('Portal CENE')).toBeVisible();
    
    const usernameInput = page.getByPlaceholder('Ex: joaosilva');
    const passwordInput = page.getByPlaceholder('••••••••');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('shows error on invalid login', async ({ page }) => {
    await page.getByPlaceholder('Ex: joaosilva').fill('usuario_errado');
    await page.getByPlaceholder('••••••••').fill('senha_errada');
    
    // Clique agressivo para ignorar overlays de animação
    const loginButton = page.getByRole('button', { name: 'Acessar Plataforma' });
    await loginButton.click({ force: true });
    
    // Espera específica pela mensagem de erro que aparece via motion
    const errorMsg = page.locator('text=Credenciais inválidas');
    await expect(errorMsg).toBeVisible({ timeout: 15000 });
  });
});
