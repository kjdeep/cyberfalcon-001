import { test, expect } from '@playwright/test';

test('investor demo path is navigable end to end', async ({ page }) => {
  await page.goto('/fleet');
  await expect(page.getByRole('heading', { name: 'Fleet health' })).toBeVisible();
  await page.getByRole('button', { name: /AMR-008/ }).click();
  await expect(page.getByText('Motor temperature ramp')).toBeVisible();
  await page.getByRole('link', { name: 'Alerts' }).click();
  await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible();
  await page.getByRole('link', { name: 'Updates' }).click();
  await expect(page.getByRole('heading', { name: 'OTA updates' })).toBeVisible();
  await page.getByRole('link', { name: 'Reports' }).click();
  await expect(page.getByText('$31,600')).toBeVisible();
  await page.getByRole('link', { name: 'Audit' }).click();
  await expect(page.getByText('Hash chain verified')).toBeVisible();
});
