import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low, Memory, JSONFile } from 'lowdb'

import PubSub from 'pubsub-js'
import { T, apiRequest, apiResponse } from 'pubsub/messages'

type IDB = {
  tiles: ITile[]
  rpgCharacter: IRpgCharacter
}

/*
const tiles = [
  { id: 'Race', name: 'My Race' },
  { id: 'Occupation', name: 'My Occupation' },
  { id: 'Abilities', name: 'My Abilities' },
  { id: 'Symbols', name: 'My Symbols' },
]

const rpgCharacter = { lastActiveTileId: 'Race' }
*/

// File path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

class Daatbase {
  db: Low<IDB>

  constructor() {
    this.subscribe()
  }

  async init() {
    if (!this.db) {
      const adapter = new JSONFile<IDB>(file)
      this.db = new Low<IDB>(adapter)

      // Read data from JSON file, this will set db.data content
      await this.db.read()
      console.log('DATA', this.db.data)
    }
  }

  subscribe() {
    PubSub.subscribe(apiRequest(T.tiles), () => {
      PubSub.publish(apiResponse(T.tiles), [...this.db.data.tiles])
    })

    PubSub.subscribe(apiRequest(T.rpgCharacter), () => {
      PubSub.publish(apiResponse(T.rpgCharacter), { ...this.db.data.rpgCharacter })
    })

    PubSub.subscribe(apiRequest(T.storeRpgCharacter), async (msg, rpgCharacter: IRpgCharacter) => {
      this.db.data.rpgCharacter = { ...rpgCharacter }
      await this.db.write()
      PubSub.publish(apiResponse(T.storeRpgCharacter))
    })
  }
}

export default new Daatbase()
