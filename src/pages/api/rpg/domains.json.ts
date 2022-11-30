import query from 'projects/rpg/api/query'
import { T } from 'pubsub/messages'
import initdb from 'projects/rpg/db/initdb'

export async function get() {
  await initdb()

  const domains = await query(T.rpgCharacter)

  return new Response(JSON.stringify(domains), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
