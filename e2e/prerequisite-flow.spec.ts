import { test, expect } from '@playwright/test';

test.describe('Prerequisite Flow & Offline Resilience', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Session
    await page.route('**/api/auth/session', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ user: { id: '1', name: 'Test User', email: 'test@reibb.dev' }, expires: '9999-12-31T23:59:59.999Z' })
    }));
  });

  test('Bloqueia aula com pré-requisito e mostra toast explicativo', async ({ page }) => {
    // Mock: Curso com uma aula bloqueada
    await page.route('**/api/content/courses/teste/**', route => route.fulfill({
      status: 200,
      body: JSON.stringify({
        title: 'Curso de Teste',
        description: 'Descrição',
        modules: [{
          id: 'm1',
          title: 'Módulo 1',
          lessons: [
            { id: 'l1', title: 'Aula 1', content_type: 'video', duration_minutes: 10, is_unlocked: true, is_completed: false },
            { id: 'l2', title: 'Aula 2', content_type: 'video', duration_minutes: 10, is_unlocked: false, is_completed: false }
          ]
        }]
      })
    }));

    await page.goto('/cursos/teste');
    
    // Tenta clicar na Aula 2 na sidebar
    await page.getByRole('button', { name: /Aula 2/i }).click();
    
    // Verifica toast do sonner
    const toast = page.getByText(/bloqueada/i);
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('Modo Offline: UI não trava e usa status cacheado', async ({ page }) => {
    await page.route('**/api/content/courses/teste/**', route => route.fulfill({
      status: 200,
      body: JSON.stringify({
        title: 'Curso de Teste',
        description: 'Descrição',
        modules: [{
          id: 'm1',
          title: 'Módulo 1',
          lessons: [
            { id: 'l1', title: 'Aula 1', content_type: 'video', duration_minutes: 10, is_unlocked: true, is_completed: false }
          ]
        }]
      })
    }));
    
    await page.goto('/cursos/teste');
    await page.context().setOffline(true);
    
    // Recarregar em offline deve mostrar o fallback ou a página cacheada (neste caso o test verifica apenas visibilidade básica pós erro ou cache)
    await page.reload();
    
    await expect(page.getByText('Curso de Teste')).toBeVisible();
  });
});
