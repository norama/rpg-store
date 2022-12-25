import { jsonRequest } from 'http/util/request'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Theme {
  init() {
    this.subscribe()
  }

  subscribe() {
    PubSub.subscribe(M.uiTheme, async (_msg, theme: string) => {
      await fetch(`${API_URL}/theme.json`, jsonRequest({ theme }, { cache: 'no-store' }))
      this.publish(theme)
    })
  }

  publish(theme: string) {
    PubSub.publish(M.uiThemeChanged, theme)
  }
}

export default Theme
