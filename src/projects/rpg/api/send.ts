import PubSub from 'pubsub-js'
import { apiRequest, apiResponse } from 'pubsub/messages'

const send = <T>(target: string, data: T) =>
  new Promise<void>((resolve) => {
    PubSub.subscribeOnce(apiResponse(target), () => {
      resolve()
    })
    PubSub.publish(apiRequest(target), data)
  })

export default send
