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
  console.log('Content-Type', request.headers.get('Content-Type'))
  console.log('content-type', request.headers.get('content-type'))
  console.log('request.header', request.headers)

  if (request.headers.get('Content-Type') === 'application/json') {
    const properties = await request.json()

    await update<IProperties>(T.rpgProperties, properties)

    const rpgCharacter = await select<IRpgCharacter>(T.rpgTarget)

    return jsonResponse(rpgCharacter)
  } else {
    return jsonResponse({
      'Content-Type': request.headers.get('Content-Type'),
      'content-type': request.headers.get('content-type'),
    })
    //return new Response(null, { status: 400 })
  }
}
