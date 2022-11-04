if (import.meta.env.PUBLIC_LOGGING === 'true') {
  await import('log/pubsub')
}

if (import.meta.env.PUBLIC_LOCAL_STORAGE === 'true') {
  await import('business/local/localStorageData')
}

import data from 'business/data'
import 'stores/tiles'
data.publish()
