if (import.meta.env.PUBLIC_LOGGING === 'true') {
  await import('pubsub/log')
}

if (import.meta.env.PUBLIC_LOCAL_STORAGE === 'true') {
  await import('projects/rpg/tiles/business/localStorageData')
}

import data from 'projects/rpg/tiles/business/data'
import 'projects/rpg/tiles/stores/tiles'
data.publish()
