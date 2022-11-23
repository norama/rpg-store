import PubSub from 'pubsub-js'
import { apiRequest, apiResponse } from 'pubsub/messages'

const query = <T>(target: string) =>
  new Promise<T>((resolve) => {
    PubSub.subscribeOnce(apiResponse(target), (msg, data: T) => {
      resolve(data)
    })
    PubSub.publish(apiRequest(target))
  })

export default query
