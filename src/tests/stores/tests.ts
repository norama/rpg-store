import { atom, map, computed } from 'nanostores'

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

export const testsAtom = computed([testSuiteAtom], (testSuite) =>
  (testSuite?.tests || []).reduce((acc, test) => {
    acc[test.name] = {
      name: test.name,
      description: test.description,
      action: async () => {
        testSuite.before && (await testSuite.before())

        await test.run()

        const result = await validate(test.expect)

        testSuite.after && (await testSuite.after())

        return result
      },
    }
    return acc
  }, {})
)

export const resultsAtom = map<Record<string, boolean>>()
