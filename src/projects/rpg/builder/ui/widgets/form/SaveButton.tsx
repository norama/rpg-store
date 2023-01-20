import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'
import { Button, CircularProgress } from '@suid/material'

const SaveButton = () => {
  const state = useStore(stateAtom)

  return (
    <Button
      color="success"
      variant="contained"
      type="submit"
      disabled={state() !== 'dirty'}
      onClick={() => PubSub.publish(M.uiSaveAction)}
    >
      {state() === 'saving' ? <CircularProgress color="inherit" size={1} /> : <span>✓</span>}
    </Button>
  )
}

export default SaveButton
