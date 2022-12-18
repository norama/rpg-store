import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { atom } from 'nanostores'

const blockAtom = atom<string>()

PubSub.subscribe(M.uiBlockType, (_msg, block: string) => blockAtom.set(block))

export default blockAtom
