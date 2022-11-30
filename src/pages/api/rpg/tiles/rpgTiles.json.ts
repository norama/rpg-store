import query from 'projects/rpg/api/query'
import send from 'projects/rpg/api/send'
import { T } from 'pubsub/messages'

export async function get() {
  const rpgTiles = await query<IRpgTiles>(T.rpgTiles)
  console.log('page rpgCharacter', rpgTiles)

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

    await send<IRpgTiles>(T.storeRpgCharacter, rpgCharacter)

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