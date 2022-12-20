import { FormData, ResourceAtom } from '@builder/ui/stores/businessStore'
import { propertiesMap } from '@builder/business/store/properties'
import { targetAtom } from '@builder/business/store/target'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const blockData = new FormData<IBlockEquipments>(M.uiBlockData)

export const blockMap = blockData.map

const blockInfo = new ResourceAtom<IInfoEquipments>(M.uiBlockInfo)

export const infoAtom = blockInfo.atom

PubSub.subscribe(M.uiSaveAction, () => {
  PubSub.publish(M.uiSave, { block: blockMap.get(), properties: propertiesMap.get() })
})

export { propertiesMap, targetAtom }
