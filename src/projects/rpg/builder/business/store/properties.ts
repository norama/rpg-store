import { FormData } from '@builder/ui/stores/businessStore'
import M from 'pubsub/messages'

const properties = new FormData<IProperties>(M.uiProperties)

export const propertiesMap = properties.map
