import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const SaveButton = () => (
  <button type="submit" onClick={() => PubSub.publish(M.rpgFormSave)}>
    Save
  </button>
)

export default SaveButton
