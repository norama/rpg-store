import Test from 'tests/components/Test'

type Props = {
  tests: ITestCase[]
}

const RunAll = ({ tests }: Props) => {
  return <Test test={tests[0]} />
}

export default RunAll
