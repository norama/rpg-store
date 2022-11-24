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

console.log('import.meta.url', import.meta.url)

// File path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

console.log('__dirname', __dirname)

// Configure lowdb to write to JSONFile
const adapter = new JSONFile<IDB>(file)
const db = new Low<IDB>(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

//db.data ||= { tiles, rpgCharacter }

console.log('DATA', db.data)

PubSub.subscribe(apiRequest(T.tiles), () => {
  PubSub.publish(apiResponse(T.tiles), db.data.tiles)
})

PubSub.subscribe(apiRequest(T.rpgCharacter), () => {
  PubSub.publish(apiResponse(T.rpgCharacter), db.data.rpgCharacter)
})

PubSub.subscribe(apiRequest(T.storeRpgCharacter), async (msg, rpgCharacter: IRpgCharacter) => {
  db.data.rpgCharacter = { ...rpgCharacter }
  await db.write()
  PubSub.publish(apiResponse(T.storeRpgCharacter))
})
