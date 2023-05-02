import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'
import { Button } from '@kobalte/core'
import styles from './FormControls.module.scss'
import style from 'styles/style'

const ResetButton = () => {
  const state = useStore(stateAtom)

  return (
    <Button.Root
      color="error"
      type="reset"
      disabled={state() !== 'dirty'}
      class={`${styles.button} ${styles.reset}`}
      onClick={() => PubSub.publish(M.uiReset)}
    >
      ✖
    </Button.Root>
  )
}

export default ResetButton
