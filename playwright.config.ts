import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: true,
  reporter: 'list',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4174',
    channel: 'chrome',
    colorScheme: 'dark',
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: 'compact',
      use: { viewport: { width: 320, height: 568 } },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
