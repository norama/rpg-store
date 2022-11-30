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
