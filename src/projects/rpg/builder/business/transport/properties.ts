import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Properties implements IBlockPage {
  rpgCharacter: IRpgCharacter

  async init() {
    console.log('========== fetching properties')

    let response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    this.subscribe()

    PubSub.publish(M.rpgFormBlock, 'properties')
    this.publish()
  }

  rpgProperties(properties: Record<string, IValue>) {
    return { ...this.rpgCharacter.properties, ...properties }
  }

  subscribe() {
    PubSub.subscribe(M.rpgSave, async (_msg, properties: Record<string, IValue>) => {
      const response = await fetch(`${API_URL}/properties.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.rpgProperties(properties)),
      })
      this.rpgCharacter = await response.json()
      this.publish()
    })

    PubSub.subscribe(M.rpgReset, () => {
      this.publish()
    })
  }

  publish() {
    PubSub.publish(M.rpgTarget, this.rpgCharacter)

    const properties = this.rpgCharacter.properties
    PubSub.publish(M.uiString, {
      key: 'name',
      value: properties.name,
    })
    PubSub.publish(M.uiNumber, {
      key: 'points',
      value: properties.points,
    })
    PubSub.publish(M.uiNumber, {
      key: 'money',
      value: properties.money,
    })
  }
}

export default Properties
