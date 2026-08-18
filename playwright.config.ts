import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const previewReady = existsSync(path.join(root, 'dist', 'index.html'))
const usePreview = previewReady && process.env.E2E_DEV !== '1'
const port = 4173
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: path.join(root, 'e2e', 'specs'),
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'en-US'
  },
  webServer: {
    command: usePreview
      ? `npx vite preview --host 127.0.0.1 --port ${port} --strictPort`
      : `npx vite --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] }
    }
  ]
})
