import { createClient, SupabaseClient } from '@supabase/supabase-js'

import PubSub from 'pubsub-js'
import { T, apiRequest, apiResponse } from 'pubsub/messages'

class Database {
  db: SupabaseClient

  constructor() {
    this.init()
    this.subscribe()
  }

  init() {
    if (!this.db) {
      const DATABASE_URL = process.env.DATABASE_URL ?? import.meta.env.DATABASE_URL
      const SUPABASE_SERVICE_API_KEY =
        process.env.SUPABASE_SERVICE_API_KEY ?? import.meta.env.SUPABASE_SERVICE_API_KEY

      this.db = createClient(
        'https://fwquxyatrztkypzlvnmp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXV4eWF0cnp0a3lwemx2bm1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2OTM5ODA2NywiZXhwIjoxOTg0OTc0MDY3fQ.S2NQpdIsZLfKJcpw3zlvQHQTJK7jlT7m9jdxvp5Z9sY'
      )
    }
  }

  subscribe() {
    PubSub.subscribe(apiRequest(T.tiles), async () => {
      const { data: tiles, error } = await this.db.from('tiles').select('id, name, order')
      if (error) {
        console.error('Error while reading tiles', error)
      }
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
        console.error('Error while reading rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.rpgCharacter), rpgCharacters[0])
    })

    PubSub.subscribe(apiRequest(T.storeRpgCharacter), async (msg, rpgCharacter: IRpgCharacter) => {
      const { error } = await this.db
        .from('rpgCharacter')
        .update({ ...rpgCharacter })
        .eq('id', 1)
      if (error) {
        console.error('Error while storing rpgCharacter', error)
      }
      PubSub.publish(apiResponse(T.storeRpgCharacter))
    })
  }
}

export const db = new Database()
