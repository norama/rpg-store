import Info from '@builder/business/transport/info'
import { jsonRequest } from 'http/util/request'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Properties implements IBlockPage {
  rpgCharacter: IRpgCharacter

  infos = [
    new Info<IInfoRaces>('races'),
    new Info<IInfoRaces>('equipments'),
    new Info<IInfoRaces>('advantages'),
  ]

  async init() {
    console.log('========== fetching properties')

    let response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    for (let info of this.infos) {
      await info.init()
    }

    this.subscribe()

    PubSub.publish(M.uiBlockType, 'properties')
  }

  rpgProperties(properties: Partial<IProperties>) {
    return { ...this.rpgCharacter.properties, ...properties }
  }

  subscribe() {
    PubSub.subscribe(M.uiSave, async (_msg, properties: Partial<IProperties>) => {
      try {
        const response = await fetch(
          `${API_URL}/properties.json`,
          jsonRequest(this.rpgProperties(properties))
        )
        this.rpgCharacter = await response.json()
      } catch (e) {
        console.error('Error while saving properties', e)
        PubSub.publish(M.uiSaveError, e)
        return
      }

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

    for (let info of this.infos) {
      info.publish()
    }
  }
}

export default Properties
