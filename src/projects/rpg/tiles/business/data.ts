import query from 'projects/rpg/api/query'
import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_RPG_API_URL + '/tiles'

class Data {
  tiles: ITile[]

  rpgCharacter: IRpgTiles

  async init() {
    if (import.meta.env.SSR) {
      this.tiles = await query(T.tiles)
    } else {
      console.log('========== fetching tiles')

      let response = await fetch(`${API_URL}/tiles.json`)
      this.tiles = await response.json()

      response = await fetch(`${API_URL}/rpgTiles.json`)
      this.rpgCharacter = await response.json()
    }

    this.subscribe()
  }

  tileIds() {
    return this.tiles.map((tile) => tile.id)
  }

  subscribe() {
    PubSub.subscribe(M.lastActiveTileId, async (_msg: string, lastActiveTileId: string) => {
      if (this.rpgCharacter.lastActiveTileId !== lastActiveTileId) {
        this.rpgCharacter.lastActiveTileId = lastActiveTileId
        await fetch(`${API_URL}/rpgTiles.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.rpgCharacter),
        })
      }
    })
  }

  publish() {
    PubSub.publish(M.initTiles, this.tiles)
    PubSub.publish(M.lastActiveTileId, this.rpgCharacter.lastActiveTileId)
  }
}

export default new Data()
