import { propertiesMap } from '@builder/business/store/properties'
import { targetAtom } from '@builder/business/store/target'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

PubSub.subscribe(M.uiSaveAction, () => {
  PubSub.publish(M.uiSave, propertiesMap.get())
})

export { propertiesMap, targetAtom }
