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
    PubSub.publish(M.uiStringArray, {
      key: 'advantages',
      value: [...block.advantages],
    })
  }
}

export default Advantages
