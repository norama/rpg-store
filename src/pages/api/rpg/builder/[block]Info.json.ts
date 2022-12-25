import { jsonResponse } from 'http/util/response'
import { select } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'

export async function get({ params }) {
  const block = params.block
  const rpgInfo = await select<IInfoRaces | IInfoAdvantages | IInfoEquipments>(T.rpgInfo, block)

  return jsonResponse(rpgInfo)
}
