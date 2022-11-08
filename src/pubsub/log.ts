import PubSub from 'pubsub-js'
import { TOPIC } from 'pubsub/messages'

PubSub.subscribe(TOPIC, (msg, data) => {
  console.log('--- ' + msg + ' ---> ', data)
})
