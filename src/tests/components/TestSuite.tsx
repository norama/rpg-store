import { onMount, onCleanup } from 'solid-js'
import Tests from 'tests/components/Tests'

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

type Props = {
  suite: ITestConfig
}

const TestSuite = ({ suite }: Props) => {
  onMount(async () => {
    suite.beforeAll && (await suite.beforeAll())
  })

  onCleanup(async () => {
    suite.afterAll && (await suite.afterAll())
  })

  const tests = suite.tests.map((test, index) => ({
    name: test.name,
    action: async () => {
      suite.before && (await suite.before())

      await test.run()

      const result = await validate(test.expect)

      suite.after && (await suite.after())

      return result
    },
  }))

  return <Tests tests={tests} />
}

export default TestSuite
