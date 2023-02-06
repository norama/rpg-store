import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import Block from '@transport/block'

class Advantages extends Block<IBlockAdvantages, IInfoAdvantages> {
  constructor() {
    super('advantages')
  }

  publish() {
    super.publish()
    const block = this.rpgCharacter.advantages
    PubSub.publish(M.uiBlockData, { advantages: [...block.advantages] })
  }
}

export default Advantages
