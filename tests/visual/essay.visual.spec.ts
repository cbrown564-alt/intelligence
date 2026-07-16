import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('shape-motion', 'reduced')
    window.localStorage.setItem('shape-quality', 'lite')
  })
})

test('opening remains legible without animation', async ({ page }) => {
  await page.goto('/#shape')
  await page.evaluate(() => document.fonts.ready)

  await expect(page.getByRole('heading', { name: 'What is the shape of intelligence?' })).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page).toHaveScreenshot('opening-reduced.png', { fullPage: false })
})

test('a direct chapter link renders the semantic preview', async ({ page }) => {
  await page.goto('/#silicon')
  await page.evaluate(() => document.fonts.ready)

  await expect(page.getByRole('heading', { name: 'Teaching sand how to think.' })).toBeVisible()
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', await page.locator('html').evaluate((el) => el.clientWidth))
  await expect(page).toHaveScreenshot('silicon-preview-reduced.png', { fullPage: false })
})

test('keyboard focus starts with the skip link and stays visible', async ({ page }) => {
  await page.goto('/#shape')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: 'Skip to the essay' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toHaveCSS('outline-style', 'solid')
  await expect(skipLink).toHaveCSS('outline-width', '3px')
})

test('a distant chapter jump settles after interactive chapters expand', async ({ page }) => {
  await page.goto('/#shape')
  await page.evaluate(() => window.localStorage.setItem('shape-motion', 'full'))
  await page.reload()

  const navigation = page.getByRole('navigation', { name: 'Essay chapters' })
  await navigation.getByRole('link', { name: '08 Vision' }).click()

  await expect(page).toHaveURL(/#vision$/)
  await expect(page.locator('#vision')).toBeInViewport({ ratio: 0.5 })
  await expect(navigation.getByRole('link', { name: '08 Vision' })).toHaveAttribute(
    'aria-current',
    'location'
  )
})
