import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { atom } from 'nanostores'

export const rpgCharacterAtom = atom<Object>([])

PubSub.subscribe(M.rpgCharacter, (_msg: string, rpgCharacter: Object) => {
  rpgCharacterAtom.set(rpgCharacter)
})
