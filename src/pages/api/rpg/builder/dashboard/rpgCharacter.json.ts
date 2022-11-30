import query from 'projects/rpg/api/query'
import { T } from 'pubsub/messages'

export async function get() {
  const rpgCharacter = await query<IRpgTiles>(T.rpgCharacter)

  return new Response(JSON.stringify(rpgCharacter), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
