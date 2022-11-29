if (import.meta.env.PUBLIC_LOGGING === 'true') {
  await import('pubsub/log')
}

console.log('=== > startup')

import data from 'projects/rpg/tiles/business/data'
await data.init()
import 'projects/rpg/tiles/stores/tiles'
data.publish()
