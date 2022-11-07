import Tests from 'components/tests/Tests'

type Props = {
  suite: ITestConfig
}

const TestSuite = ({ suite }: Props) => {
  const tests = suite.tests.map((test, index) => ({
    name: test.name,
    action: async () => {
      index === 0 && suite.beforeAll && (await suite.beforeAll())
      suite.before && (await suite.before())

      const result = await test.action()

      suite.after && (await suite.after())
      index === suite.tests.length - 1 && suite.afterAll && (await suite.afterAll())

      return result
    },
  }))

  return <Tests tests={tests} />
}

export default TestSuite
