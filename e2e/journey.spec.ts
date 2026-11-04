import dotenv from 'dotenv';
import { expect, test } from '@playwright/test';
dotenv.config();
const password = process.env.SEED_DEMO_PASSWORD || 'replace-with-a-local-demo-password';
const login = async (page: import('@playwright/test').Page, email: string) => { await page.goto('http://127.0.0.1:5173'); await page.getByLabel('Email').fill(email); await page.getByLabel('Password').fill(password); await page.getByRole('button', { name: 'Sign in' }).click(); };
test('TEST-06.6: persisted participant journey shows progress, history, and duplicate feedback', async ({ page }) => {
  await login(page, 'pm1@example.com');
  const name = `Journey ${Date.now()}`;
  await page.getByLabel('Name').fill(name); await page.getByLabel('Unit').fill('pages'); await page.getByLabel('Minimum value').fill('0'); await page.getByLabel('Maximum value').fill('100'); await page.getByRole('button', { name: 'Save template' }).click();
  await page.getByRole('button', { name: 'Logout' }).click(); await login(page, 'alice@example.com');
  await page.getByRole('button', { name: new RegExp(name) }).click(); await page.getByLabel('Target').fill('100'); await page.getByLabel('Start date').fill('2026-11-04'); await page.getByLabel('End date').fill('2026-11-04'); await page.getByRole('button', { name: 'Create goal' }).click();
  await page.getByRole('button', { name: 'Record activity' }).last().click(); await page.getByLabel('Activity value').fill('50'); await page.getByLabel('Record date').fill('2026-11-04'); await page.getByRole('button', { name: 'Save activity' }).click();
  await expect(page.getByLabel('Goal progress')).toContainText('50.0%'); await expect(page.getByRole('table')).toContainText('2026-11-04');
  await page.getByLabel('Activity value').fill('50'); await page.getByRole('button', { name: 'Save activity' }).click(); await expect(page.getByText('A record already exists for this date.')).toBeVisible();
  await page.reload(); await expect(page.getByText('50.0%')).toBeVisible(); await expect(page.getByRole('table')).toContainText('2026-11-04'); await page.getByRole('button', { name: 'Logout' }).click();
});
