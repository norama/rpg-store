import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

import { atom } from 'nanostores'

const rpgTargetAtom = atom<IRpgCharacter>()

PubSub.subscribe(M.rpgTarget, (_msg: string, target: IRpgCharacter) => {
  console.log('--> Target', target)
  rpgTargetAtom.set(target)
})

export default rpgTargetAtom
