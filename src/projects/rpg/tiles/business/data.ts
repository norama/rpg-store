import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

class Data {
  tiles = [
    { id: 'Race', name: 'My Race' },
    { id: 'Occupation', name: 'My Occupation' },
    { id: 'Abilities', name: 'My Abilities' },
    { id: 'Symbols', name: 'My Symbols' },
  ]

  lastActiveTileId = 'Race'

  tileIds = this.tiles.map((tile) => tile.id)

  constructor() {
    this.subscribe()
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
