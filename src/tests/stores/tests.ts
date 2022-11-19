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

export const testCountAtom = computed(
  [testSuiteAtom],
  (testSuite) => (testSuite?.tests || []).length
)

export const resultsAtom = map<Record<string, boolean>>()

export const successCountAtom = computed(
  [resultsAtom],
  (results) =>
    Object.values(results).filter((result) => result === true).length -
    (results[ALL] === true ? 1 : 0)
)
export const failureCountAtom = computed(
  [resultsAtom],
  (results) =>
    Object.values(results).filter((result) => result === false).length -
    (results[ALL] === false ? 1 : 0)
)

export const progressAtom = atom<number>()

export const testActionsAtom = computed([testSuiteAtom], (testSuite) => {
  const tests = testSuite?.tests || []
  const actions = tests.reduce((acc, test) => {
    acc[test.name] = async (progress?: number) => {
      progressAtom.set(progress)
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

    for (let i = 0; i < tests.length; ++i) {
      const action = actions[tests[i].name]
      const testResult = await action(i)
      result = testResult && result
    }

    testSuite.afterAll && (await testSuite.afterAll())
    resultsAtom.setKey(ALL, result)
    progressAtom.set(tests.length)

    return result
  }
  return actions as Record<string, (progress?: number) => Promise<boolean>>
})
