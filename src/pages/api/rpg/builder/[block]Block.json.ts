import { jsonResponse } from 'http/util/response'
import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get({ params }) {
  const block = params.block
  const rpgBlock = await select<IBlockRaces | IBlockAdvantages | IBlockEquipments>(
    T.rpgBlock,
    block
  )

  return jsonResponse(rpgBlock)
}

export async function post({ params, request }) {
  const block = params.block
  if (request.headers.get('Content-Type') === 'application/json') {
    const data = await request.json()

    await update<IRpgBlock>(T.rpgBlock, { type: block, ...data } as IRpgBlock)

    const rpgCharacter = await select<IRpgCharacter>(T.rpgTarget)

    return jsonResponse(rpgCharacter)
  } else {
    return new Response(null, { status: 400 })
  }
}
