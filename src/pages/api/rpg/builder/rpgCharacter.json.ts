import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get() {
  const rpgCharacter = await select<IRpgCharacter>(T.rpgCharacter)

  return new Response(JSON.stringify(rpgCharacter), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    const rpgCharacter = await request.json()

    await update<IRpgCharacter>(T.rpgCharacter, rpgCharacter)

    return await get()
  } else {
    return new Response(null, { status: 400 })
  }
}
