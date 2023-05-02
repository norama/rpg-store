import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'
import { select } from 'projects/rpg/api/proxy'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Transport {
  rpgCharacter: IRpgCharacter

  async init() {
    //console.log('========== fetching target')

    if (!import.meta.env.SSR) {
      const response = await fetch(`${API_URL}/rpgCharacter.json`)
      this.rpgCharacter = await response.json()
      this.subscribe()
    } else {
      this.rpgCharacter = await select<IRpgCharacter>(T.rpgTarget)
    }
  }

  subscribe() {
    PubSub.subscribe(M.uiReset, () => {
      this.publish()
    })
  }

  publish() {
    PubSub.publish(M.uiTarget, this.rpgCharacter)
  }
}

export default Transport
