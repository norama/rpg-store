import { createSignal } from 'solid-js'
import state from 'tests/components/state'
import { ALL } from 'tests/constants'
import './Test.css'

const sign = (result?: boolean) => (result === true ? '\u2713' : result === false ? '\u2716' : '')

const { disabled, setDisabled } = state

type Props = {
  test: ITestCase
}

const Test = ({ test }: Props) => {
  const { name, description, action } = test
  const [result, setResult] = createSignal<boolean>()

  const handleClick = async () => {
    setDisabled(true)
    setResult(undefined)
    setResult(await action())
    setDisabled(false)
  }

  return (
    <div data-testid={name} data-test={name === ALL ? 'test-all' : 'test-item'} class="test">
      <div class="name">{name}</div>
      <div class="description">{description}</div>
      <button
        data-testid="action"
        class="action"
        onClick={() => handleClick()}
        disabled={disabled()}
      >
        {name === ALL ? 'Run All' : 'Run'}
      </button>
      <div data-testid="result" class={resultClass(result())}>
        {sign(result())}
      </div>
    </div>
  )
}

const resultClass = (result?: boolean) =>
  result === true ? 'result success' : result === false ? 'result failure' : 'result'

export default Test
