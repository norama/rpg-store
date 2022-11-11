import Test from 'tests/components/Test'
import './Tests.css'

type Props = {
  tests: ITestCase[]
}

const Tests = ({ tests }: Props) => {
  return (
    <div class="tests">
      {tests.map((test, i) => (
        <div class="item">
          <h2>{i + 1}.</h2>
          <Test test={test} />
        </div>
      ))}
    </div>
  )
}

export default Tests
