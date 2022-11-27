import { createClient, SupabaseClient } from '@supabase/supabase-js'

import PubSub from 'pubsub-js'
import { T, apiRequest, apiResponse } from 'pubsub/messages'

class Database {
  db: SupabaseClient

  constructor() {
    console.log('supabase constructor')
    this.init()
  }

  init() {
    console.log('supabase init')
    if (!this.db) {
      console.log('supabase reading env')
      const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = import.meta.env
      console.log('DATABASE_URL', DATABASE_URL)

      this.db = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY)

      console.log('database', this.db)

      this.subscribe()
    }
  }

  subscribe() {
    PubSub.subscribe(apiRequest(T.tiles), async () => {
      const { data: tiles, error } = await this.db.from('tiles').select('id, name, order')
      if (error) {
        console.log('Error while reading tiles', error)
      }
      console.log('tiles', tiles)
      PubSub.publish(
        apiResponse(T.tiles),
        tiles.sort((tile1, tile2) => tile1.order - tile2.order)
      )
    })

    PubSub.subscribe(apiRequest(T.rpgCharacter), async () => {
      const { data: rpgCharacters, error } = await this.db
        .from('rpgCharacter')
        .select('lastActiveTileId')
      if (error) {
        console.log('Error while reading rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.rpgCharacter), rpgCharacters[0])
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
