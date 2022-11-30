import query from 'projects/rpg/api/query'
import send from 'projects/rpg/api/send'
import { T } from 'pubsub/messages'

export async function get() {
  const rpgCharacter = await query<IRpgTiles>(T.rpgCharacter)
  console.log('rpgCharacter', rpgCharacter)

  return new Response(JSON.stringify(rpgCharacter), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
