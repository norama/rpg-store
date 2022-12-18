import { propertiesMap } from '@builder/business/store/properties'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

PubSub.subscribe(M.uiSaveAction, () => {
  PubSub.publish(M.uiSave, propertiesMap.get())
})
