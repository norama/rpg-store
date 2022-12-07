import PubSub from 'pubsub-js'
import { msgRequest, msgResponse, apiSelect, apiUpdate } from 'pubsub/messages'

export const select = <T>(target: string, params?: any) =>
  new Promise<T>((resolve) => {
    PubSub.subscribeOnce(msgResponse(apiSelect(target)), (msg, data: T) => {
      resolve(data)
    })
    PubSub.publish(msgRequest(apiSelect(target)), params)
  })

export const update = <T>(target: string, data: T) =>
  new Promise<void>((resolve) => {
    PubSub.subscribeOnce(msgResponse(apiUpdate(target)), () => {
      resolve()
    })
    PubSub.publish(msgRequest(apiUpdate(target)), data)
  })
