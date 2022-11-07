import { test, expect } from '@playwright/test'

test('unit:business.data', async ({ page }) => {
  await page.goto('/tests/business/data')
  await expect(page).toHaveTitle('Unit tests: business.data')

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
