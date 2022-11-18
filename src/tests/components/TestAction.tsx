import state from 'tests/components/state'
import { ALL } from 'tests/constants'
import { testActionsAtom } from 'tests/stores/tests'
import './TestAction.css'

const { disabled, setDisabled } = state

type Props = {
  name: string
}

const TestAction = ({ name }: Props) => {
  const handleClick = async () => {
    setDisabled(true)

    const action = testActionsAtom.get()[name]
    await action()

    setDisabled(false)
  }

  return (
    <button data-testid="action" onClick={() => handleClick()} class="action" disabled={disabled()}>
      {name === ALL ? 'Run All' : 'Run'}
    </button>
  )
}

export default TestAction
