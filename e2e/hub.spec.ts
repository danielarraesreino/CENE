import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('accesses hub and shows trails', async ({ page }) => {
  await page.goto('/portal/paciente');
  
  // Verify we are on the hub
  await expect(page).toHaveURL(/.*\/portal\/paciente/);
  
  // Check for the welcome message
  await expect(page.getByText(/Olá,/i)).toBeVisible();
  
  // Verify at least one trail is visible and unlocked
  const trailTitle = page.getByText('A Gênese do Rei Bebê');
  await expect(trailTitle).toBeVisible();
  
  // Trail 1 should be unlocked by default
  const card = page.locator('.glass-panel').filter({ hasText: 'A Gênese do Rei Bebê' });
  await expect(card.getByText(/Bloqueada/i)).not.toBeVisible();
});

test('can click on an unlocked trail', async ({ page }) => {
  await page.goto('/portal/paciente');
  await page.getByText('A Gênese do Rei Bebê').click();
  await expect(page).toHaveURL(/.*\/trilha\/1/);
});
