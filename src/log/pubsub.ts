import PubSub from 'pubsub-js'
import { TOPIC } from 'constants/messages'

PubSub.subscribe(TOPIC, (msg, data) => {
  console.log('--- ' + msg + ' ---> ', data)
})
