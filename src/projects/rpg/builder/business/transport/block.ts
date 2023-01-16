import Info from '@builder/business/transport/info'
import { jsonRequest } from 'http/util/request'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Block<B, I> implements IBlockPage {
  rpgCharacter: IRpgCharacter
  type: IBlockType
  info: Info<I>

  constructor(type: IBlockType) {
    this.type = type
    this.info = new Info<I>(type)
  }

  async init() {
    console.log('========== fetching block ' + this.type)

    const response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    await this.info.init()

    this.subscribe()

    PubSub.publish(M.uiBlockType, this.type)
  }

  rpgProperties(properties: Partial<IProperties>) {
    return { ...this.rpgCharacter.properties, ...properties }
  }

  rpgBlock(block: Partial<B>, properties?: Partial<IProperties>) {
    return {
      data: { ...this.rpgCharacter[this.type], ...block } as B,
      properties: properties ?? { ...this.rpgCharacter.properties, ...properties },
    }
  }

  subscribe() {
    PubSub.subscribe(
      M.uiSave,
      async (
        _msg,
        { block, properties }: { block: Partial<B>; properties?: Partial<IProperties> }
      ) => {
        const response = await fetch(
          `${API_URL}/${this.type}Block.json`,
          jsonRequest(this.rpgBlock(block, properties))
        )
        this.rpgCharacter = await response.json()
        this.publish()
      }
    )

    PubSub.subscribe(M.uiReset, () => {
      this.publish()
    })
  }

  publish() {
    const properties = this.rpgCharacter.properties
    PubSub.publish(M.uiProperties, { ...properties })

    PubSub.publish(M.uiTarget, this.rpgCharacter)
    this.info.publish()
  }
}

export default Block
