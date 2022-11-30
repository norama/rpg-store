import query from 'projects/rpg/api/query'
import { T } from 'pubsub/messages'
import initdb from 'projects/rpg/db/initdb'

export async function get() {
  await initdb()

  const tiles = await query(T.tiles)

  return new Response(JSON.stringify(tiles), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
