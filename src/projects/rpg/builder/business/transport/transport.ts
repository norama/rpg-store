import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Transport {
  rpgCharacter: IRpgCharacter

  async init() {
    console.log('========== fetching target')

    let response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    this.subscribe()
  }

  subscribe() {
    PubSub.subscribe(M.rpgReset, () => {
      this.publish()
    })
  }

  publish() {
    PubSub.publish(M.rpgTarget, this.rpgCharacter)
  }
}

export default Transport
