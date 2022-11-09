import { test } from '@playwright/test'
// @ts-ignore
import testPage from '@unit/testPage.ts'

test('unit:stores.tiles', testPage('/tests/projects/rpg/tiles/stores/tiles'))
