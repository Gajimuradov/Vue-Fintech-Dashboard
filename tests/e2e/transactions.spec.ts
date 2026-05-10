import { expect, test } from '@playwright/test';

test('user filters transactions and opens detail page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Операции и статусы' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Операции по дням' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Как идут операции' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Структура потока' })).toBeVisible();
  await expect(page.getByText('Оборот по валютам')).toBeVisible();
  await expect(page.getByText('Live-режим выключен')).toBeVisible();
  await page.getByRole('button', { name: 'Включить Live' }).click();
  await expect(page.getByText('Live-режим включен: новые заявки будут появляться автоматически')).toBeVisible();
  await expect(page.getByText('1:00')).toBeVisible();
  await page.getByRole('button', { name: 'Остановить Live' }).click();
  await expect(page.getByText('TRX-1001')).toBeVisible();

  await page.getByRole('searchbox', { name: 'Поиск по имени клиента или id операции' }).fill('Sophia');

  await expect(page.getByText('TRX-1003')).toBeVisible();
  await expect(page.getByText('TRX-1001')).not.toBeVisible();

  await page.getByRole('link', { name: 'Открыть' }).click();

  await expect(page).toHaveURL(/\/transactions\/TRX-1003$/);
  await expect(page.getByRole('heading', { name: 'TRX-1003' })).toBeVisible();
  await expect(page.getByText('Банк-эмитент отклонил платеж.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'К списку операций' })).toBeVisible();
});
