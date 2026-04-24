import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('accesses hub and shows trails', async ({ page }) => {
  await page.goto('/hub');
  
  // Verify we are on the hub and not redirected back to login
  await expect(page).toHaveURL(/.*\/hub/);
  
  // Check for the welcome message
  await expect(page.getByText(/Bem-vindo, testuser/i)).toBeVisible();
  
  // Verify at least one trail is visible and unlocked
  const trailTitle = page.getByText('A Gênese do Rei Bebê');
  await expect(trailTitle).toBeVisible();
  
  // Trail 1 should be unlocked by default
  // We check if there's no "Bloqueada" text in the card that has this title
  const card = page.locator('.glass-panel').filter({ hasText: 'A Gênese do Rei Bebê' });
  await expect(card.getByText(/Bloqueada/i)).not.toBeVisible();
});

test('can click on an unlocked trail', async ({ page }) => {
  await page.goto('/hub');
  await page.getByText('A Gênese do Rei Bebê').click();
  await expect(page).toHaveURL(/.*\/trilha\/1/);
});
