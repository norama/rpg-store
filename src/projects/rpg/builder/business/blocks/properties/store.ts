import { ResourceAtom } from '@builder/ui/stores/businessStore'
import { propertiesMap } from '@builder/business/store/properties'
import { targetAtom } from '@builder/business/store/target'
import PubSub from 'pubsub-js'
import M, { blockInfo } from 'pubsub/messages'

const racesInfo = new ResourceAtom<IInfoRaces>(blockInfo('races'))
const equipmentsInfo = new ResourceAtom<IInfoEquipments>(blockInfo('equipments'))
const advantagesInfo = new ResourceAtom<IInfoAdvantages>(blockInfo('advantages'))

export const racesInfoAtom = racesInfo.atom
export const equipmentsInfoAtom = equipmentsInfo.atom
export const advantagesInfoAtom = advantagesInfo.atom

PubSub.subscribe(M.uiSaveAction, () => {
  PubSub.publish(M.uiSave, propertiesMap.get())
})

export { propertiesMap, targetAtom }
