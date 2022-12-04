import { select } from 'projects/rpg/api/proxy'
import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_RPG_API_URL + '/tiles'

class Data {
  tiles: ITile[]

  rpgTiles: IRpgTiles

  async init() {
    if (import.meta.env.SSR) {
      this.tiles = await select(T.tiles)
    } else {
      console.log('========== fetching tiles')

      let response = await fetch(`${API_URL}/tiles.json`)
      this.tiles = await response.json()

      response = await fetch(`${API_URL}/rpgTiles.json`)
      this.rpgTiles = await response.json()
    }

    this.subscribe()
  }

  tileIds() {
    return this.tiles.map((tile) => tile.id)
  }

  subscribe() {
    PubSub.subscribe(M.lastActiveTileId, async (_msg: string, lastActiveTileId: string) => {
      if (this.rpgTiles.lastActiveTileId !== lastActiveTileId) {
        this.rpgTiles.lastActiveTileId = lastActiveTileId
        await fetch(`${API_URL}/rpgTiles.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.rpgTiles),
        })
      }
    })
  }

  publish() {
    PubSub.publish(M.initTiles, this.tiles)
    PubSub.publish(M.lastActiveTileId, this.rpgTiles.lastActiveTileId)
  }
}

export default new Data()
