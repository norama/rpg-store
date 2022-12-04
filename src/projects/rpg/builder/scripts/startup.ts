if (import.meta.env.PUBLIC_LOGGING === 'true') {
  await import('pubsub/log')
}

console.log('=== > startup')

import transport from '@business/transport'
await transport.init()
import '@stores/store'
transport.publish()
