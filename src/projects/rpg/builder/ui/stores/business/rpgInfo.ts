import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

import { atom } from 'nanostores'

const rpgInfoAtom = atom<IInfoRaces>()

PubSub.subscribe(M.rpgInfo, (_msg: string, info: IInfoRaces) => {
  console.log('--> Info', info)
  rpgInfoAtom.set(info)
})

export default rpgInfoAtom
