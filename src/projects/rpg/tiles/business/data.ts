import query from 'projects/rpg/api/query'
import PubSub from 'pubsub-js'
import M, { T } from 'pubsub/messages'

class Data {
  tiles: ITile[]

  rpgCharacter: IRpgCharacter

  constructor() {
    this.subscribe()
  }

  async init() {
    if (import.meta.env.SSR) {
      this.tiles = await query(T.tiles)
    } else {
      console.log('========== fetching tiles')
      const API_URL = import.meta.env.PUBLIC_RPG_API_URL

      let response = await fetch(`${API_URL}/tiles.json`)
      this.tiles = await response.json()

      response = await fetch(`${API_URL}/rpgCharacter.json`)
      this.rpgCharacter = await response.json()
    }
  }

  tileIds() {
    return this.tiles.map((tile) => tile.id)
  }

  subscribe() {
    PubSub.subscribe(M.lastActiveTileId, async (_msg: string, lastActiveTileId: string) => {
      if (this.rpgCharacter.lastActiveTileId !== lastActiveTileId) {
        const API_URL = import.meta.env.PUBLIC_RPG_API_URL
        this.rpgCharacter.lastActiveTileId = lastActiveTileId
        await fetch(`${API_URL}/rpgCharacter.json`, {
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
  }
}

export default new Data()
