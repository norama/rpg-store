import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { atom, map } from 'nanostores'

const rpgBlock = atom<string>()

export const rpgStringValues = map<Record<string, string>>({})
export const rpgNumberValues = map<Record<string, number>>({})

PubSub.subscribe(M.rpgStoreString, (_msg: string, { key, value }: IDataString) => {
  setStringValue(key, value)
})

PubSub.subscribe(M.rpgStoreNumber, (_msg: string, { key, value }: IDataNumber) => {
  setNumberValue(key, value)
})

export const setStringValue = (key: string, value: string) => {
  rpgStringValues.setKey(key, value)
}

export const setNumberValue = (key: string, value: number) => {
  rpgNumberValues.setKey(key, value)
}

export const save = () => {
  PubSub.publish(M.rpgSaveProperties, { ...rpgStringValues.get(), ...rpgNumberValues.get() })
}

export const reset = () => {
  PubSub.publish(M.rpgResetProperties)
}

PubSub.subscribe(M.rpgFormSave, () => save())
PubSub.subscribe(M.rpgFormReset, () => reset())

PubSub.subscribe(M.rpgFormBlock, (_msg, block: string) => rpgBlock.set(block))
