import { expect, test } from '@playwright/test';

const demoPassword = process.env.SEED_DEMO_PASSWORD || 'replace-with-a-local-demo-password';

test('TEST-01.8 / AC-01.1: participant can log in and log out in the browser', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Password').fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Study habits dashboard' })).toBeVisible();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
