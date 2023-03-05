import PubSub from 'pubsub-js'
import { blockInfo } from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Info<I> implements IBlockPage {
  type: IBlockType
  info: I

  constructor(type: IBlockType) {
    this.type = type
  }

  async init() {
    console.log('========== fetching info: ' + this.type)

    const response = await fetch(`${API_URL}/${this.type}Info.json`)
    this.info = (await response.json()) as I
    console.log('INFO', this.info)
  }

  publish() {
    PubSub.publish(blockInfo(this.type), this.info)
  }
}

export default Info
