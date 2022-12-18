import { FormData, ResourceAtom } from '@builder/ui/stores/businessStore'
import { propertiesMap } from '@builder/business/store/properties'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const blockData = new FormData<IBlockRaces>(M.uiBlockData)

export const blockMap = blockData.map

const blockInfo = new ResourceAtom<IInfoRaces>(M.uiBlockInfo)

export const infoAtom = blockInfo.atom

PubSub.subscribe(M.uiSaveAction, () => {
  PubSub.publish(M.uiSave, { block: blockMap.get(), properties: propertiesMap.get() })
})
