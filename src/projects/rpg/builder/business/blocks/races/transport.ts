import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import Block from '@transport/block'

class Races extends Block<IBlockRaces, IInfoRaces> {
  constructor() {
    super('races')
  }

  publish() {
    super.publish()
    const block = this.rpgCharacter.races
    PubSub.publish(M.uiBlockData, { races: [...block.races] })
  }
}

export default Races
