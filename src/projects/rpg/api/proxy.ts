import PubSub from 'pubsub-js'
import { msgRequest, msgResponse, apiSelect, apiUpdate } from 'pubsub/messages'

export const select = <T>(target: string) =>
  new Promise<T>((resolve) => {
    PubSub.subscribeOnce(msgResponse(apiSelect(target)), (msg, data: T) => {
      resolve(data)
    })
    PubSub.publish(msgRequest(apiSelect(target)))
  })

export const update = <T>(target: string, data: T) =>
  new Promise<void>((resolve) => {
    PubSub.subscribeOnce(msgResponse(apiUpdate(target)), () => {
      resolve()
    })
    PubSub.publish(msgRequest(apiUpdate(target)), data)
  })
