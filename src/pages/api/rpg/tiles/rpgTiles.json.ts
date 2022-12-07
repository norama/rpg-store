import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get() {
  const rpgTiles = await select<IRpgTiles>(T.rpgTiles)

  return new Response(JSON.stringify(rpgTiles), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    const rpgCharacter = await request.json()

    await update<IRpgTiles>(T.rpgTarget, rpgCharacter)

    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } else {
    return new Response(null, { status: 400 })
  }
}
