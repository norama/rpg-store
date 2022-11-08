import Test from 'tests/components/Test'

type Props = {
  tests: ITest[]
}

const Tests = ({ tests }: Props) => {
  return (
    <>
      {tests.map((test) => (
        <Test test={test} />
      ))}
    </>
  )
}

export default Tests
