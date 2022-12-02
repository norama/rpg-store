if (import.meta.env.PUBLIC_LOGGING === 'true') {
  await import('pubsub/log')
}

console.log('=== > startup')

import business from '@builder/business'
await business.init()
import '@builder/store'
business.publish()
