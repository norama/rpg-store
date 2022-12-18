import { ResourceAtom } from '@builder/ui/stores/businessStore'
import M from 'pubsub/messages'

const target = new ResourceAtom<IRpgCharacter>(M.uiTarget)

export const targetAtom = target.atom
