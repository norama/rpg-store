import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

import { atom } from 'nanostores'

const targetAtom = atom<IRpgCharacter>()

PubSub.subscribe(M.rpgTarget, (_msg: string, target: IRpgCharacter) => {
  console.log('--> Target', target)
  targetAtom.set(target)
})

export default targetAtom
