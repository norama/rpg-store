import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'
import { Button, CircularProgress } from '@suid/material'
import style from 'styles/style'

const SaveButton = () => {
  const state = useStore(stateAtom)

  return (
    <Button
      color="success"
      variant="contained"
      type="submit"
      disabled={state() !== 'dirty'}
      sx={style(
        'controlButton',
        state() !== 'dirty'
          ? { backgroundColor: 'green !important', color: 'white !important' }
          : {}
      )}
      onClick={() => PubSub.publish(M.uiSaveAction)}
    >
      {state() === 'saving' ? <CircularProgress color="inherit" size="2rem" /> : <>✓</>}
    </Button>
  )
}

export default SaveButton
