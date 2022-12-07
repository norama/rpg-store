import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { atom, map } from 'nanostores'

export const rpgTargetAtom = atom<Object>()

PubSub.subscribe(M.rpgTarget, (_msg: string, rpgTarget: Object) => {
  console.log('--> rpgTarget', rpgTarget)
  rpgTargetAtom.set(rpgTarget)
})

const rpgBlockAtom = atom<string>()

export const rpgStringValues = map<Record<string, string>>({})
export const rpgNumberValues = map<Record<string, number>>({})

PubSub.subscribe(M.uiString, (_msg: string, { key, value }: IDataString) => {
  setStringValue(key, value)
})

PubSub.subscribe(M.uiNumber, (_msg: string, { key, value }: IDataNumber) => {
  setNumberValue(key, value)
})

export const setStringValue = (key: string, value: string) => {
  rpgStringValues.setKey(key, value)
}

export const setNumberValue = (key: string, value: number) => {
  rpgNumberValues.setKey(key, value)
}

export const save = (properties?: Record<string, IValue>) => {
  const block = { ...rpgStringValues.get(), ...rpgNumberValues.get() }
  const values = rpgBlockAtom.get() === 'properties' ? block : { block, properties }
  PubSub.publish(M.rpgSave, values)
}

export const reset = () => {
  PubSub.publish(M.rpgReset)
}

PubSub.subscribe(M.rpgFormSave, (_msg, properties?: Record<string, IValue>) => save(properties))
PubSub.subscribe(M.rpgFormReset, () => reset())

PubSub.subscribe(M.rpgFormBlock, (_msg, block: string) => rpgBlockAtom.set(block))
