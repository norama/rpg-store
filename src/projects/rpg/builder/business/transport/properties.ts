import { jsonRequest } from 'http/util/request'
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

    PubSub.publish(M.uiBlockType, 'properties')
    this.publish()
  }

  rpgProperties(properties: Partial<IProperties>) {
    return { ...this.rpgCharacter.properties, ...properties }
  }

  subscribe() {
    PubSub.subscribe(M.uiSave, async (_msg, properties: Partial<IProperties>) => {
      const response = await fetch(
        `${API_URL}/properties.json`,
        jsonRequest(this.rpgProperties(properties))
      )
      this.rpgCharacter = await response.json()
      this.publish()
    })

    PubSub.subscribe(M.uiReset, () => {
      this.publish()
    })
  }

  publish() {
    PubSub.publish(M.uiTarget, this.rpgCharacter)

    const properties = this.rpgCharacter.properties
    PubSub.publish(M.uiProperties, { ...properties })
  }
}

export default Properties
