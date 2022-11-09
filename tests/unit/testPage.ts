import { expect } from '@playwright/test'

const testPage =
  (url: string) =>
  async ({ page }) => {
    await page.goto(url)

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
  }

export default testPage
