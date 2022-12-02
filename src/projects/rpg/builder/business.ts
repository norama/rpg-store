import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_RPG_API_URL + '/builder'

class Business {
  rpgCharacter: IRpgCharacter

  async init() {
    console.log('========== fetching dashboard data')

    let response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    this.subscribe()
  }

  subscribe() {
    PubSub.subscribe(M.rpgSaveProperties, async (_msg, values) => {
      const response = await fetch(`${API_URL}/rpgCharacter.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: values.name }),
      })
      this.rpgCharacter = await response.json()
      this.publish()
    })

    PubSub.subscribe(M.rpgResetProperties, () => {
      this.publish()
    })
  }

  publish() {
    PubSub.publish(M.rpgCharacter, this.rpgCharacter)
    PubSub.publish(M.rpgStoreString, {
      key: 'name',
      value: this.rpgCharacter.name,
    })
  }
}

export default new Business()
