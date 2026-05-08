import { expect, test } from '@playwright/test';

test('user filters transactions and opens detail page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Transaction Dashboard' })).toBeVisible();
  await expect(page.getByText('TRX-1001')).toBeVisible();

  await page.getByRole('searchbox', { name: 'Search by user name or transaction id' }).fill('Sophia');

  await expect(page.getByText('TRX-1003')).toBeVisible();
  await expect(page.getByText('TRX-1001')).not.toBeVisible();

  await page.getByRole('link', { name: 'Details' }).click();

  await expect(page).toHaveURL(/\/transactions\/TRX-1003$/);
  await expect(page.getByRole('heading', { name: 'TRX-1003' })).toBeVisible();
  await expect(page.getByText('Issuer declined the payment.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
});

