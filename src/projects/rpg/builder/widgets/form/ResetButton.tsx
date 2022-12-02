import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const ResetButton = () => (
  <button type="reset" onClick={() => PubSub.publish(M.rpgFormReset)}>
    Reset
  </button>
)

export default ResetButton
