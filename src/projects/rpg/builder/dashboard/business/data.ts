import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_RPG_API_URL + '/builder/dashboard'

class Data {
  rpgCharacter: IRpgCharacter

  async init() {
    console.log('========== fetching dashboard data')

    let response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    this.subscribe()
  }

  subscribe() {}

  publish() {
    PubSub.publish(M.rpgCharacter, this.rpgCharacter.json)
  }
}

export default new Data()
