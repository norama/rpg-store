import { createClient, SupabaseClient } from '@supabase/supabase-js'

import PubSub from 'pubsub-js'
import { T, msgRequest, msgResponse, apiSelect, apiUpdate } from 'pubsub/messages'

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
    PubSub.subscribe(msgRequest(apiSelect(T.tiles)), async () => {
      const { data: tiles, error } = await this.db.from('tiles').select('id, name, order')
      if (error) {
        console.log('Error while reading tiles', error)
      }
      PubSub.publish(
        msgResponse(apiSelect(T.tiles)),
        tiles.sort((tile1, tile2) => tile1.order - tile2.order)
      )
    })

    PubSub.subscribe(msgRequest(apiSelect(T.rpgTiles)), async () => {
      const { data: rpgCharacters, error } = await this.db
        .from('rpgCharacter')
        .select('lastActiveTileId')
      if (error) {
        console.log('Error while reading rpgCharacter', error)
      }
      PubSub.publish(msgResponse(apiSelect(T.rpgTiles)), rpgCharacters[0])
    })

    PubSub.subscribe(
      msgRequest(apiUpdate(T.rpgCharacter)),
      async (msg, rpgCharacter: IRpgTiles) => {
        const { error } = await this.db
          .from('rpgCharacter')
          .update({ ...rpgCharacter })
          .eq('id', 1)
        if (error) {
          console.log('Error while storing rpgCharacter', error)
        }
        PubSub.publish(msgResponse(apiUpdate(T.rpgCharacter)))
      }
    )
  }
}

export const db = new Database()
