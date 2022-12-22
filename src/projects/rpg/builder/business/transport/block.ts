import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Block<B, I> implements IBlockPage {
  rpgCharacter: IRpgCharacter
  type: IBlockType
  info: I

  constructor(type: IBlockType) {
    this.type = type
  }

  async init() {
    console.log('========== fetching block')

    let response = await fetch(`${API_URL}/rpgCharacter.json`)
    this.rpgCharacter = await response.json()

    response = await fetch(`${API_URL}/${this.type}Info.json`)
    this.info = (await response.json()) as I

    this.subscribe()

    PubSub.publish(M.uiBlockType, this.type)
    this.publish()
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
        const response = await fetch(`${API_URL}/${this.type}Block.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.rpgBlock(block, properties)),
        })
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
    PubSub.publish(M.uiBlockInfo, this.info)
  }
}

export default Block
