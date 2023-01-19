import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

import { Button } from '@suid/material'

const SaveButton = () => (
  <Button
    color="success"
    variant="contained"
    type="submit"
    onClick={() => PubSub.publish(M.uiSaveAction)}
  >
    ✓
  </Button>
)

export default SaveButton
