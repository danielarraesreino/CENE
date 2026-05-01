import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Aguarda hidratação do React
  await page.getByPlaceholder('Ex: joaosilva').fill('testuser');
  await page.getByPlaceholder('••••••••').fill('testpass123');
  
  // Clique forçado para ignorar overlays de animação
  await page.getByRole('button', { name: 'Acessar Plataforma' }).click({ force: true });

  // Espera o redirecionamento com um timeout maior e verifica se não há erro na tela
  try {
    await expect(page).toHaveURL(/.*\/(hub|portal\/paciente)/, { timeout: 20000 });
  } catch (error) {
    const errorMsg = await page.getByText(/Credenciais inválidas/i).isVisible();
    if (errorMsg) {
      console.error("ERRO DE AUTENTICAÇÃO: O sistema exibiu 'Credenciais inválidas'");
    }
    throw error;
  }
  
  await page.context().storageState({ path: authFile });
});
