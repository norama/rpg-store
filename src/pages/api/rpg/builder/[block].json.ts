import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

const BLOCKS = ['races', 'advantages', 'equipments']

export function getStaticPaths() {
  return BLOCKS.map((block) => ({ params: { block } }))
}

export async function get({ params }) {
  const block = params.block
  const rpgBlock = await select<IBlockRaces | IBlockAdvantages | IBlockEquipments>(
    T.rpgBlock,
    block
  )

  return new Response(JSON.stringify(rpgBlock), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function post({ params, request }) {
  const block = params.block
  if (request.headers.get('Content-Type') === 'application/json') {
    const data = await request.json()

    await update<IRpgBlock>(T.rpgBlock, { type: block, ...data })

    return {
      type: block,
      data: await get({ params: { block } }),
      properties: await select<IProperties>(T.rpgProperties),
    }
  } else {
    return new Response(null, { status: 400 })
  }
}
