import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './e2e', webServer: [
  { command: 'npm run start', port: 3000, reuseExistingServer: !process.env.CI },
  { command: 'npm --workspace web run dev -- --port 5173', port: 5173, reuseExistingServer: !process.env.CI }
] });
