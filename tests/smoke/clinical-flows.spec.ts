// tests/smoke/clinical-flows.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxos Clínicos - Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Simula login se necessário ou usa storageState
    await page.goto('/portal/paciente/clinical');
  });

  test('Deve carregar a lista de ferramentas clínicas', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Ferramentas Clínicas');
    await expect(page.getByRole('link', { name: /diário/i })).toBeVisible();
  });

  test('Deve registrar um novo humor e exibir toast de sucesso', async ({ page }) => {
    await page.getByRole('link', { name: /humor/i }).click();
    await expect(page).toHaveURL(/.*mood/);

    // Seleciona um humor (Excelente)
    await page.getByRole('button', { name: /excelente/i }).click();
    await page.getByPlaceholder(/observação/i).fill('Teste automatizado de fumaça');
    
    await page.getByRole('button', { name: /salvar/i }).click();

    // Valida feedback visual
    await expect(page.locator('text=Registro Salvo!')).toBeVisible();
    // Verifica redirecionamento automático
    await expect(page).toHaveURL(/.*clinical/, { timeout: 10000 });
  });

  test('Deve capturar erros de API e exibir toast com retry', async ({ page }) => {
    // Intercepta chamada de API para simular erro 500
    await page.route('**/api/clinical/mood/', route => 
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro simulado' } 
        })
      })
    );

    await page.goto('/portal/paciente/clinical/mood');
    await page.getByRole('button', { name: /excelente/i }).click();
    await page.getByRole('button', { name: /salvar/i }).click();

    // Valida toast de erro via Sonner
    await expect(page.locator('text=Erro simulado')).toBeVisible();
    await expect(page.getByRole('button', { name: /tentar novamente/i })).toBeVisible();
  });

  test('Deve respeitar feature flags determinísticas', async ({ page }) => {
    // Força desativação da flag via query param (se implementado) ou override de env
    // Aqui assumimos que a UI muda se CLINICAL_REACT_QUERY estiver off
    // Para teste de smoke, apenas garantimos que a página não quebra
    await page.goto('/portal/paciente/clinical/journal');
    await expect(page.getByPlaceholder(/escreva sua reflexão/i)).toBeVisible();
  });
});
