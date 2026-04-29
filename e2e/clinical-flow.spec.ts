import { test, expect } from '@playwright/test';

/**
 * Fluxo Crítico: Paciente Renascer
 * Valida o acesso ao portal, check-in de humor e navegação em ferramentas clínicas.
 */

test.describe('Fluxo Crítico do Paciente', () => {
  // Assume que o estado de autenticação está salvo
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('deve navegar do Hub para o Check-in de Humor', async ({ page }) => {
    // 1. Acesso ao novo Hub (canônico)
    await page.goto('/portal/paciente');
    await expect(page).toHaveURL(/.*\/portal\/paciente/);

    // 2. Localizar e clicar no Widget de Humor (Tarefa 3.2)
    const humorWidget = page.getByText(/Como você está se sentindo agora/i);
    await expect(humorWidget).toBeVisible();
    await humorWidget.click();

    // 3. Validar redirecionamento para ferramenta de humor
    await expect(page).toHaveURL(/.*\/portal\/paciente\/clinical\/mood/);
    await expect(page.getByText(/Diário de Humor/i)).toBeVisible();
  });

  test('deve acessar o Hub Clínico e ver ferramentas', async ({ page }) => {
    await page.goto('/portal/paciente/clinical');
    
    // Validar presença de ferramentas essenciais
    await expect(page.getByText(/Registro de Pensamentos/i)).toBeVisible();
    await expect(page.getByText(/Plano de Segurança/i)).toBeVisible();
    await expect(page.getByText(/Diário Clínico/i)).toBeVisible();
  });

  test('deve acionar o botão SOS na Navbar em caso de urgência', async ({ page }) => {
    await page.goto('/portal/paciente');
    
    // Clicar no botão SOS pulsante da Navbar (Tarefa 3.3)
    const sosButton = page.locator('nav').getByRole('button', { name: /S.O.S/i });
    await expect(sosButton).toBeVisible();
    await sosButton.click();

    // Validar rota de emergência
    await expect(page).toHaveURL(/.*\/portal\/paciente\/sos/);
    await expect(page.getByText(/ESTOU EM CRISE/i)).toBeVisible();
  });

  test('deve navegar para a Escola de Especialização', async ({ page }) => {
    await page.goto('/portal/paciente');
    
    // Navegar para a Escola via Navbar
    await page.locator('nav').getByText(/Escola/i).click();
    
    await expect(page).toHaveURL(/.*\/escola\/aluno/);
    await expect(page.getByText(/Formação em Dependência Química/i)).toBeVisible();
  });
});
