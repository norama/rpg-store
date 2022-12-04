import PubSub from 'pubsub-js'
import { apiRequest, apiResponse } from 'pubsub/messages'

export const query = <T>(target: string) =>
  new Promise<T>((resolve) => {
    PubSub.subscribeOnce(apiResponse(target), (msg, data: T) => {
      resolve(data)
    })
    PubSub.publish(apiRequest(target))
  })

export const send = <T>(target: string, data: T) =>
  new Promise<void>((resolve) => {
    PubSub.subscribeOnce(apiResponse(target), () => {
      resolve()
    })
    PubSub.publish(apiRequest(target), data)
  })
