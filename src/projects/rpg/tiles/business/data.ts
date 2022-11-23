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
      const API_URL = import.meta.env.PUBLIC_RPG_URL
      console.log('FETCH', `${API_URL}/tiles`)
      const response = await fetch(`${API_URL}/tiles`)
      console.log('RESP', response)
      const data = await response.json()
      console.log('data', data)
      this.tiles = data.tiles
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
