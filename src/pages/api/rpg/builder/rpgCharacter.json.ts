import { jsonResponse } from 'http/util/response'
import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get() {
  const rpgCharacter = await select<IRpgCharacter>(T.rpgTarget)

  return jsonResponse(rpgCharacter)
}

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    const rpgCharacter = await request.json()

    await update<IRpgCharacter>(T.rpgTarget, rpgCharacter)

    return await get()
  } else {
    return new Response(null, { status: 400 })
  }
}
