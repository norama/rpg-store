if (import.meta.env.PUBLIC_LOGGING === 'true') {
  await import('pubsub/log')
}

console.log('=== > startup')

import data from '@dashboard/business/data'
await data.init()
import '@dashboard/stores/dashboard'
data.publish()
