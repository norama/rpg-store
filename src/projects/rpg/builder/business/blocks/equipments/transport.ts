import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import Block from '@transport/block'

class Equipments extends Block<IBlockEquipments, IInfoEquipments> {
  constructor() {
    super('equipments')
  }

  publish() {
    super.publish()
    const block = this.rpgCharacter.equipments
    PubSub.publish(M.uiBlockData, { ...block })
  }
}

export default Equipments
