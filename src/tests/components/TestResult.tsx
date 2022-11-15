import { useStore } from '@nanostores/solid'
import { createEffect, createSignal } from 'solid-js'
import { resultsAtom } from 'tests/stores/tests'
import './TestResult.css'

type Props = {
  name: string
}

const TestResult = ({ name }: Props) => {
  const results = useStore(resultsAtom)
  const [result, setResult] = createSignal<boolean>()

  createEffect(() => {
    setResult(results()[name])
  })

  return (
    <div data-testid="result" class={resultClass(result())}>
      {sign(result())}
    </div>
  )
}

const sign = (result?: boolean) => (result === true ? '\u2713' : result === false ? '\u2716' : '')

const resultClass = (result?: boolean) =>
  result === true ? 'result success' : result === false ? 'result failure' : 'result'

export default TestResult
