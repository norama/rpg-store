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

    PubSub.publish(M.rpgFormBlock, this.type)
    this.publish()
  }

  rpgProperties(properties: Record<string, IValue>) {
    return { ...this.rpgCharacter.properties, ...properties }
  }

  rpgBlock(block: Record<string, IValue>, properties?: Record<string, IValue>) {
    return {
      data: { ...this.rpgCharacter[this.type], ...block } as B,
      properties: properties ?? ({ ...this.rpgCharacter.properties, ...properties } as IProperties),
    }
  }

  subscribe() {
    PubSub.subscribe(M.rpgSave, async (_msg, { block, properties }) => {
      const response = await fetch(`${API_URL}/${this.type}Block.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.rpgBlock(block, properties)),
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
    PubSub.publish(M.rpgInfo, this.info)
  }
}

export default Block
