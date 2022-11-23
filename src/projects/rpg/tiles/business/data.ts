import { ApiSource } from 'projects/rpg/tiles/business/api'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

class Data {
  tiles: ITile[]

  lastActiveTileId: string

  constructor() {
    this.subscribe()
  }

  async init(apiSource: ApiSource) {
    if (apiSource === ApiSource.Server) {
      await new Promise<void>((resolve) => {
        PubSub.subscribeOnce(M.apiTiles, (msg, tiles) => {
          this.tiles = tiles
          resolve()
        })
        PubSub.publish(M.apiGetTiles)
      })
    } else {
      /*
      const API_URL = '/api/rpg' //import.meta.env.PUBLIC_RPG_API_URL
      console.log('FETCH', `${API_URL}/tiles.json`)
      const response = await fetch(`${API_URL}/tiles.json`)
      console.log('RESP', response)
      const data = await response.json()
      console.log('data', data)
      this.tiles = data.tiles
      */
      console.log('tiles')
      this.tiles = [
        { id: 'Race', name: 'My Race' },
        { id: 'Occupation', name: 'My Occupation' },
        { id: 'Abilities', name: 'My Abilities' },
        { id: 'Symbols', name: 'My Symbols' },
      ]
    }
  }

  async initServer() {
    await this.init(ApiSource.Server)
  }

  async initClient() {
    await this.init(ApiSource.Client)

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
