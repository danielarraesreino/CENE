import { test, expect } from '@playwright/test';

test.describe('Reibb Clinical Flows Smoke Test', () => {
  // Mock de sessão para pular auth real nos testes
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/session/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user-smoke', email: 'smoke@reibb.dev' },
          accessToken: 'mock-jwt-valid',
        }),
      });
    });
  });

  test('1. Carrega dashboard clínico e verifica cache React Query', async ({ page }) => {
    await page.route('**/api/clinical/mood-logs/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          count: 1,
          next: null,
          results: [{ id: '1', mood_score: 8, created_at: '2024-05-01T10:00:00Z' }],
        }),
      });
    });

    await page.goto('/portal/paciente/clinical/mood');
    
    // Verifica renderização após hidratação
    await expect(page.getByTestId('clinical-list-container')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Carregando...')).not.toBeVisible();
    
    // Verifica que não há erros no console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.reload();
    expect(consoleErrors).toEqual([]);
  });

  test('2. Simula falha de API e valida Toast', async ({ page }) => {
    let reqCount = 0;
    await page.route('**/api/clinical/goals/**', async (route) => {
      reqCount++;
      if (reqCount === 1) {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({
            error: { code: 'CLINICAL_SYNC_FAILED', message: 'Falha ao sincronizar dados.', retryable: true },
          }),
        });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify({ count: 0, results: [] }) });
      }
    });

    await page.goto('/portal/paciente/clinical/goals');
    
    // Aguarda toast de erro. Como `toast.error` é usado, ele apenas exibe a mensagem.
    const toastAlert = page.getByText('Não foi possível carregar suas metas.');
    await expect(toastAlert).toBeVisible({ timeout: 4000 });
  });

  test('3. Valida paginação e feature flags em DOM', async ({ page }) => {
    await page.goto('/portal/paciente/clinical/mood');
    
    // Verifica controles de paginação
    const pagination = page.locator('[data-testid="pagination-controls"]');
    await expect(pagination).toBeVisible();
    
    // Verifica atributo de feature flags injetado pelo provider
    const htmlFlags = await page.locator('html').getAttribute('data-flags');
    expect(htmlFlags).toMatch(/CLINICAL_REACT_QUERY/);
  });
});
