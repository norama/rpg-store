import { test } from '@playwright/test'
// @ts-ignore
import testPage from '@unit/testPage.ts'

test('unit:business.data', testPage('/tests/projects/rpg/tiles/business/data'))
