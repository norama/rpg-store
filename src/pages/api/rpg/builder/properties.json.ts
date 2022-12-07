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
    const properties = await request.json()

    await update<IProperties>(T.rpgProperties, properties)

    return await get()
  } else {
    return new Response(null, { status: 400 })
  }
}
