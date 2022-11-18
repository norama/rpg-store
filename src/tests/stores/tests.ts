import { atom, map, computed } from 'nanostores'
import { ALL } from 'tests/constants'

const INTERVAL = 500
const TIMEOUT = 5000

const validate = (expect: () => boolean) => {
  let t
  return Promise.race([
    new Promise<boolean>((resolve) => {
      t = setInterval(() => {
        if (expect()) {
          clearInterval(t)
          t = undefined
          resolve(true)
        }
      }, INTERVAL)
    }),
    new Promise<boolean>((resolve) =>
      setTimeout(() => {
        if (t) {
          clearInterval(t)
          t = undefined
        }
        resolve(false)
      }, TIMEOUT)
    ),
  ])
}

export const testSuiteAtom = atom<ITestSuite>()

export const resultsAtom = map<Record<string, boolean>>()

export const testActionsAtom = computed([testSuiteAtom], (testSuite) => {
  const tests = testSuite?.tests || []
  const actions = tests.reduce((acc, test) => {
    acc[test.name] = async () => {
      resultsAtom.setKey(test.name, undefined)
      testSuite.before && (await testSuite.before())

      await test.run()

      const result = await validate(test.expect)

      testSuite.after && (await testSuite.after())
      resultsAtom.setKey(test.name, result)

      return result
    }

    return acc
  }, {})
  actions[ALL] = async () => {
    resultsAtom.set({})
    testSuite.beforeAll && (await testSuite.beforeAll())

    let result = true

    for (const test of tests) {
      const action = actions[test.name]
      const testResult = await action()
      result = testResult && result
    }

    testSuite.afterAll && (await testSuite.afterAll())
    resultsAtom.setKey(ALL, result)

    return result
  }
  return actions as Record<string, () => Promise<boolean>>
})
