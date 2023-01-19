import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

import { Button } from '@suid/material'

const ResetButton = () => (
  <Button color="error" variant="outlined" type="reset" onClick={() => PubSub.publish(M.uiReset)}>
    ✖
  </Button>
)

export default ResetButton
