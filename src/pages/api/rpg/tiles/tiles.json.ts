import { query } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get() {
  const tiles = await query(T.tiles)

  return new Response(JSON.stringify(tiles), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
