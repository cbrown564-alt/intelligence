import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window.localStorage.getItem('shape-motion') !== 'full') {
      window.localStorage.setItem('shape-motion', 'reduced')
    }
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
  await page.goto('/#scent')
  await page.evaluate(() => document.fonts.ready)

  await expect(page.getByRole('heading', { name: 'What can a machine smell?' })).toBeVisible()
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', await page.locator('html').evaluate((el) => el.clientWidth))
  await expect(page).toHaveScreenshot('scent-preview-reduced.png', { fullPage: false })
})

test('keyboard focus starts with the skip link and stays visible', async ({ page }) => {
  await page.goto('/#shape')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: 'Skip to the essay' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toHaveCSS('outline-style', 'solid')
  await expect(skipLink).toHaveCSS('outline-width', '3px')
})

test('compact chapter controls reveal the complete journey', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Compact controls are used below the desktop breakpoint')
  await page.goto('/#scent')

  const controls = page.getByRole('navigation', { name: 'Chapter controls' })
  await expect(controls).toBeVisible()
  await controls.locator('summary').click()
  await expect(controls.getByRole('link', { name: 'Vision' })).toBeVisible()
  await controls.getByRole('link', { name: 'Vision' }).click()

  await expect(page).toHaveURL(/#vision$/)
  await expect(controls.locator('summary')).toContainText('Vision')
})

test('the essay reflows at a 200 percent equivalent viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The desktop project supplies the 2x reference width')
  await page.setViewportSize({ width: 640, height: 800 })
  await page.goto('/#shape')

  await expect(page.getByRole('heading', { name: 'What is the shape of intelligence?' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Chapter controls' })).toBeVisible()
  await expect(page.locator('html')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('html').evaluate((element) => element.clientWidth)
  )
})

test('a distant chapter jump settles after interactive chapters expand', async ({ page }, testInfo) => {
  await page.goto('/#shape')
  await page.evaluate(() => window.localStorage.setItem('shape-motion', 'full'))
  await page.reload()

  await expect(page.locator('.hero-visual canvas')).toHaveCount(1, { timeout: 5_000 })

  const navigation = testInfo.project.name === 'desktop'
    ? page.getByRole('navigation', { name: 'Essay chapters' })
    : page.getByRole('navigation', { name: 'Chapter controls' })
  if (testInfo.project.name === 'desktop') {
    await navigation.getByRole('link', { name: '06 Vision' }).click()
  } else {
    await navigation.locator('summary').click()
    await navigation.getByRole('link', { name: 'Vision' }).click()
  }

  await expect(page).toHaveURL(/#vision$/)
  await expect(page.locator('#vision')).toBeInViewport({
    ratio: testInfo.project.name === 'compact' ? 0.4 : 0.5,
  })
  if (testInfo.project.name === 'desktop') {
    await expect(navigation.getByRole('link', { name: '06 Vision' })).toHaveAttribute(
      'aria-current',
      'location'
    )
  } else {
    await expect(navigation.locator('summary')).toContainText('Vision')
  }
})
