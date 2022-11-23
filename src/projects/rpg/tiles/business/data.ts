import query from 'projects/rpg/api/query'
import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'

class Data {
  tiles: ITile[]

  lastActiveTileId: string

  constructor() {
    this.subscribe()
  }

  async init() {
    if (import.meta.env.SSR) {
      this.tiles = await query(T.tiles)
    } else {
      const API_URL = import.meta.env.PUBLIC_RPG_API_URL
      const response = await fetch(`${API_URL}/tiles.json`)
      const data = await response.json()

      this.tiles = data.tiles

      this.lastActiveTileId = 'Race'
    }
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
