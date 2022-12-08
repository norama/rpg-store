import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { atom, map } from 'nanostores'

const blockAtom = atom<string>()

export const stringValuesMap = map<Record<string, string>>({})
export const numberValuesMap = map<Record<string, number>>({})

PubSub.subscribe(M.uiString, (_msg: string, { key, value }: IDataString) => {
  setStringValue(key, value)
})

PubSub.subscribe(M.uiNumber, (_msg: string, { key, value }: IDataNumber) => {
  setNumberValue(key, value)
})

export const setStringValue = (key: string, value: string) => {
  stringValuesMap.setKey(key, value)
}

export const setNumberValue = (key: string, value: number) => {
  numberValuesMap.setKey(key, value)
}

export const save = (properties?: Record<string, IValue>) => {
  const block = { ...stringValuesMap.get(), ...numberValuesMap.get() }
  const values = blockAtom.get() === 'properties' ? block : { block, properties }
  PubSub.publish(M.rpgSave, values)
}

export const reset = () => {
  PubSub.publish(M.rpgReset)
}

PubSub.subscribe(M.rpgFormSave, (_msg, properties?: Record<string, IValue>) => save(properties))
PubSub.subscribe(M.rpgFormReset, () => reset())

PubSub.subscribe(M.rpgFormBlock, (_msg, block: string) => blockAtom.set(block))
