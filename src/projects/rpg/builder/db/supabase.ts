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
      PubSub.publish(apiResponse(T.rpgCharacter), rpgCharacter[0])
    })

    PubSub.subscribe(apiRequest(T.storeRpgCharacter), async (msg, rpgCharacter: IRpgCharacter) => {
      const { error } = await this.db
        .from('rpgCharacter')
        .update({ ...rpgCharacter })
        .eq('id', 1)
      if (error) {
        console.log('Error while storing rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.storeRpgCharacter))
    })
  }
}

export const db = new Database()
