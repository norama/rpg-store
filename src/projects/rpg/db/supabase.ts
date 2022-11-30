import { createClient, SupabaseClient } from '@supabase/supabase-js'

import PubSub from 'pubsub-js'
import { T, apiRequest, apiResponse } from 'pubsub/messages'

class Database {
  db: SupabaseClient

  constructor() {
    this.init()
  }

  init() {
    if (!this.db) {
      const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = import.meta.env

      this.db = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY)

      this.subscribe()
    }
  }

  subscribe() {
    PubSub.subscribe(apiRequest(T.tiles), async () => {
      const { data: tiles, error } = await this.db.from('tiles').select('id, name, order')
      if (error) {
        console.log('Error while reading tiles', error)
      }
      PubSub.publish(
        apiResponse(T.tiles),
        tiles.sort((tile1, tile2) => tile1.order - tile2.order)
      )
    })

    PubSub.subscribe(apiRequest(T.rpgTiles), async () => {
      const { data: rpgCharacters, error } = await this.db
        .from('rpgCharacter')
        .select('lastActiveTileId')
      if (error) {
        console.log('Error while reading rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.rpgTiles), rpgCharacters[0])
    })

    PubSub.subscribe(apiRequest(T.storeRpgCharacter), async (msg, rpgCharacter: IRpgTiles) => {
      const { error } = await this.db
        .from('rpgCharacter')
        .update({ ...rpgCharacter })
        .eq('id', 1)
      if (error) {
        console.log('Error while storing rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.storeRpgCharacter))
    })

    this.subscribeCharacter()
  }

  subscribeCharacter() {
    PubSub.subscribe(apiRequest(T.rpgCharacter), async () => {
      const { data: rpgCharacter, error } = await this.db.from('rpgCharacter').select(`
        id,
        name,
        points, 
        rpgRaces(race, races(name)),
        rpgAdvantages(advantage, advantages(name, points)),
        rpgEquipments(equipment, equipments(name, price, weight))
      `)
      if (error) {
        console.log('Error while reading rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.rpgCharacter), { json: rpgCharacter })
    })
  }
}

export const db = new Database()
