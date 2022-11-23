import { Low, Memory } from 'lowdb'

import PubSub from 'pubsub-js'
import { T, apiRequest, apiResponse } from 'pubsub/messages'

type IDB = {
  tiles: ITile[]
  rpgCharacter: IRpgCharacter
}

const tiles = [
  { id: 'Race', name: 'My Race' },
  { id: 'Occupation', name: 'My Occupation' },
  { id: 'Abilities', name: 'My Abilities' },
  { id: 'Symbols', name: 'My Symbols' },
]

const rpgCharacter = { lastActiveTileId: 'Race' }

const db = new Low<IDB>(new Memory<IDB>())

db.data = { tiles, rpgCharacter }

console.log('DATA', db.data)

PubSub.subscribe(apiRequest(T.tiles), () => {
  PubSub.publish(apiResponse(T.tiles), db.data.tiles)
})

PubSub.subscribe(apiRequest(T.rpgCharacter), () => {
  PubSub.publish(apiResponse(T.rpgCharacter), db.data.rpgCharacter)
})

PubSub.subscribe(apiRequest(T.storeRpgCharacter), (msg, rpgCharacter: IRpgCharacter) => {
  db.data.rpgCharacter = { ...rpgCharacter }
  PubSub.publish(apiResponse(T.storeRpgCharacter))
})
