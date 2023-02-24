import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'
import { Button } from '@suid/material'
import style from 'styles/style'

const ResetButton = () => {
  const state = useStore(stateAtom)

  return (
    <Button
      color="error"
      variant="outlined"
      type="reset"
      disabled={state() !== 'dirty'}
      sx={style('controlButton', state() !== 'dirty' ? { color: '#B82D2E !important' } : {})}
      onClick={() => PubSub.publish(M.uiReset)}
    >
      ✖
    </Button>
  )
}

export default ResetButton
