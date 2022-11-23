import { Low, Memory } from 'lowdb'

import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const tiles = [
  { id: 'Race', name: 'My Race' },
  { id: 'Occupation', name: 'My Occupation' },
  { id: 'Abilities', name: 'My Abilities' },
  { id: 'Symbols', name: 'My Symbols' },
]

const db = new Low(new Memory())

db.data = tiles

console.log('DATA', db.data)

PubSub.subscribe(M.apiGetTiles, () => {
  PubSub.publish(M.apiTiles, db.data)
})
