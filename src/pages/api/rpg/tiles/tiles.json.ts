import { select } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get() {
  const tiles = await select(T.tiles)

  return new Response(JSON.stringify(tiles), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
