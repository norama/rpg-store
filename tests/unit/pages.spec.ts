import { test } from '@playwright/test'
// @ts-ignore
import testPage from '@unit/testPage.ts'
// @ts-ignore
import config from '@unit/config.ts'

config.pages.forEach((page) => {
  test(page.name, testPage(page.url))
})
