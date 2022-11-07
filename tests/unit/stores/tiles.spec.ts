import { test, expect } from '@playwright/test'

test('unit:stores.tiles', async ({ page }) => {
  await page.goto('/tests/stores/tiles')
  await expect(page).toHaveTitle('Unit tests: stores.tiles')

  const Tests = await page.locator('.test')
  let count = 0
  while (count === 0) {
    count = await Tests.count()
  }

  for (let i = 0; i < count; ++i) {
    const Test = await Tests.nth(i)
    const TestButton = await Test.getByTestId('action')
    TestButton.click()
    const TestResult = await Test.getByTestId('result')
    await expect(TestResult).toHaveClass(/success/)
  }
})
