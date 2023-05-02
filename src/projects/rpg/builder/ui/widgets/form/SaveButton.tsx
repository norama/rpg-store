import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'
import { Button } from '@kobalte/core'
import CircularProgress from '@builder/ui/widgets/form/CircularProgress'
import styles from './FormControls.module.scss'

const SaveButton = () => {
  const state = useStore(stateAtom)

  return (
    <Button.Root
      color="success"
      type="submit"
      disabled={state() !== 'dirty'}
      class={`${styles.button} ${styles.save}`}
      onClick={() => PubSub.publish(M.uiSaveAction)}
    >
      {state() === 'saving' ? <CircularProgress /> : <>✓</>}
    </Button.Root>
  )
}

export default SaveButton
