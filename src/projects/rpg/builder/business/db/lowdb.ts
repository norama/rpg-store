//import { join, dirname } from 'node:path'
//import { fileURLToPath } from 'node:url'

import { Low, Memory, JSONFile } from 'lowdb'

import PubSub from 'pubsub-js'
import { T, msgRequest, msgResponse, apiSelect, apiUpdate } from 'pubsub/messages'

type IDB = {
  tiles: ITile[]
  rpgCharacter: IRpgTiles
}

const tiles = [
  { id: 'Race', name: 'My Race' },
  { id: 'Occupation', name: 'My Occupation' },
  { id: 'Abilities', name: 'My Abilities' },
  { id: 'Symbols', name: 'My Symbols' },
]

const rpgCharacter = { lastActiveTileId: 'Race' }

// File path
//const __dirname = dirname(fileURLToPath(import.meta.url))
//const file = join(__dirname, 'db.json')

class Database {
  db: Low<IDB>

  constructor() {
    this.init()
    this.subscribe()
  }

  init() {
    if (!this.db) {
      //const adapter = new JSONFile<IDB>(file)
      //this.db = new Low<IDB>(adapter)
      this.db = new Low<IDB>(new Memory<IDB>())
      this.db.data = { tiles, rpgCharacter }

      // Read data from JSON file, this will set db.data content
      //await this.db.read()
      console.log('DATA', this.db.data)
    }
  }

  subscribe() {
    PubSub.subscribe(msgRequest(apiSelect(T.tiles)), () => {
      PubSub.publish(msgResponse(apiSelect(T.tiles)), [...this.db.data.tiles])
    })

    PubSub.subscribe(msgRequest(apiSelect(T.rpgTiles)), () => {
      PubSub.publish(msgResponse(apiSelect(T.rpgTiles)), { ...this.db.data.rpgCharacter })
    })

    PubSub.subscribe(msgRequest(apiUpdate(T.rpgTarget)), async (msg, rpgCharacter: IRpgTiles) => {
      console.log('lowdb rpgCharacter', rpgCharacter)

      this.db.data.rpgCharacter = { ...rpgCharacter }
      //await this.db.write()
      PubSub.publish(msgResponse(apiUpdate(T.rpgTarget)))
    })
  }

  subscribeCharacter() {}
}

export const db = new Database()
