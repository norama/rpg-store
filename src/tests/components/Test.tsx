import { createSignal } from 'solid-js'
import './Test.css'

type Props = {
  test: ITestCase
  prevResult?: boolean
}

const Test = ({ test, prevResult }: Props) => {
  const { name, action } = test
  const [result, setResult] = createSignal<boolean>(prevResult)
  const [disabled, setDisabled] = createSignal(false)

  const handleClick = async () => {
    setDisabled(true)
    setResult(await action())
    setDisabled(false)
  }

  return (
    <div data-testid={name} class="test">
      <button
        data-testid="action"
        class="action"
        onClick={() => handleClick()}
        disabled={disabled()}
      >
        {name}
      </button>
      <div data-testid="result" class={resultClass(result())} />
    </div>
  )
}

const resultClass = (result?: boolean) =>
  result === true ? 'result success' : result === false ? 'result failure' : 'result'

export default Test
