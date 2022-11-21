import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

class Data {
  tiles: ITile[]

  lastActiveTileId: string

  constructor() {
    this.subscribe()
  }

  async initServer() {
    this.tiles = [
      { id: 'Race', name: 'My Race' },
      { id: 'Occupation', name: 'My Occupation' },
      { id: 'Abilities', name: 'My Abilities' },
      { id: 'Symbols', name: 'My Symbols' },
    ]
  }

  async initClient() {
    await this.initServer()

    this.lastActiveTileId = 'Race'
  }

  tileIds() {
    return this.tiles.map((tile) => tile.id)
  }

  subscribe() {
    PubSub.subscribe(M.lastActiveTileId, (_msg: string, lastActiveTileId: string) => {
      this.lastActiveTileId = lastActiveTileId
    })
  }

  publish() {
    PubSub.publish(M.initTiles, this.tiles)
  }
}

export default new Data()
