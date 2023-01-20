import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { atom } from 'nanostores'
import toast from 'solid-toast'
import style from 'styles/style'

const stateAtom = atom<IState>()

export const errorAtom = atom<object | null>(null)

PubSub.subscribe(M.uiDirty, (_msg, dirty: boolean) => stateAtom.set(dirty ? 'dirty' : 'idle'))

PubSub.subscribe(M.uiSaveAction, () => stateAtom.set('saving'))

PubSub.subscribe(M.uiSaveError, (_msg, error) => {
  stateAtom.set('dirty')
  errorAtom.set(error)
  setTimeout(() => {
    errorAtom.set(null)
  }, 5000)
  toast.error('Chyba při uložení!', { style: style('error') })
})

export default stateAtom
