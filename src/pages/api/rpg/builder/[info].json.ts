import { select } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

const BLOCKS = ['races', 'advantages', 'equipments']

export function getStaticPaths() {
  return BLOCKS.map((block) => ({ params: { block } }))
}

export async function get({ params }) {
  const block = params.block
  const rpgInfo = await select<IInfoRaces | IInfoAdvantages | IInfoEquipments>(T.rpgInfo, block)

  return new Response(JSON.stringify(rpgInfo), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
