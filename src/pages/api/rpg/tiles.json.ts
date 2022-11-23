import query from 'projects/rpg/api/query'
import initdb from 'projects/rpg/db/initdb'
import { T } from 'pubsub/messages'

export async function get() {
  await initdb()

  const tiles = await query(T.tiles)

  return new Response(JSON.stringify({ tiles }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
