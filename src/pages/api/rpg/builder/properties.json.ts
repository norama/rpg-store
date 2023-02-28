import { jsonResponse } from 'http/util/response'
import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get() {
  const properties = await select<IProperties>(T.rpgProperties)

  return new Response(JSON.stringify(properties), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    try {
      const properties = await request.json()

      await update<IProperties>(T.rpgProperties, properties)

      const rpgCharacter = await select<IRpgCharacter>(T.rpgTarget)

      return jsonResponse(rpgCharacter)
    } catch (error) {
      console.log(error)
      return jsonResponse({ error })
    }
  } else {
    return new Response(null, { status: 400 })
  }
}
