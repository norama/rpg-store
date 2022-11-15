import { onCleanup, onMount } from 'solid-js'
import { testSuiteAtom } from 'tests/stores/tests'
import tilesSuite from 'tests/projects/rpg/tiles/stores/tiles'
import dataSuite from 'tests/projects/rpg/tiles/business/data'

type Props = {
  pageSuite: string
}

const TestSuite = ({ pageSuite }: Props) => {
  const suite = toSuite(pageSuite)

  onMount(async () => {
    suite.beforeAll && (await suite.beforeAll())
    testSuiteAtom.set(suite)
  })

  onCleanup(async () => {
    suite.afterAll && (await suite.afterAll())
    testSuiteAtom.set(undefined)
  })

  return null
}

const toSuite = (pageSuite: string) => {
  switch (pageSuite) {
    case 'tests/projects/rpg/tiles/stores/tiles':
      return tilesSuite
    case 'tests/projects/rpg/tiles/business/data':
      return dataSuite
    default:
      return undefined
  }
}

export default TestSuite
