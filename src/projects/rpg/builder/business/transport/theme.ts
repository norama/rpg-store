import { jsonRequest } from 'http/util/request'
import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

class Theme {
  async init() {
    const response = await fetch(`${API_URL}/theme.json`)
    const { theme } = await response.json()
    this.publish(theme)

    this.subscribe()
  }

  subscribe() {
    PubSub.subscribe(M.uiThemeChanged, async (_msg, theme: string) => {
      await fetch(`${API_URL}/theme.json`, jsonRequest({ theme }, { cache: 'no-store' }))
      PubSub.publish(M.uiThemeStored)
    })
  }

  publish(theme: string) {
    PubSub.publish(M.uiTheme, theme)
  }
}

export default Theme
