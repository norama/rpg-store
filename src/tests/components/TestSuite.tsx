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
    new Promise<boolean>((_r, reject) =>
      setTimeout(() => {
        if (t) {
          clearInterval(t)
          t = undefined
        }
        reject()
      }, TIMEOUT)
    ),
  ])
}

type Props = {
  suite: ITestConfig
}

const TestSuite = ({ suite }: Props) => {
  const tests = suite.tests.map((test, index) => ({
    name: test.name,
    action: async () => {
      index === 0 && suite.beforeAll && (await suite.beforeAll())
      suite.before && (await suite.before())

      await test.run()
      let result: boolean = undefined
      try {
        result = await validate(test.expect)
      } catch (e) {
        console.error(`${test.name}: timeout`, e)
      }

      suite.after && (await suite.after())
      index === suite.tests.length - 1 && suite.afterAll && (await suite.afterAll())

      return result
    },
  }))

  return <Tests tests={tests} />
}

export default TestSuite
