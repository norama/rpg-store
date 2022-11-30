import { test, expect } from '@playwright/test'

test('integration:index', async ({ page }) => {
  await page.goto('/tiles')
  await expect(page).toHaveTitle('RPG Store')

  const Race = page.getByTestId('Race')
  Race.click()

  await expect(Race).toHaveClass(/active/)
  await expect(Race).toHaveClass(/lastActive/)

  const active = page.locator('.active')
  await expect(active).toHaveCount(1)

  const Symbols = page.getByTestId('Symbols')
  Symbols.click()

  await expect(Symbols).toHaveClass(/active/)
  await expect(Symbols).toHaveClass(/lastActive/)
  await expect(active).toHaveCount(4)
})
