import base from './themes/base'
import bootstrap from './themes/bootstrap'
import dark from './themes/dark'
import light from './themes/light'
import M from 'pubsub/messages'
import PubSub from 'pubsub-js'
import { atom } from 'nanostores'

export type ITheme = 'base' | 'bootstrap' | 'dark' | 'light'

class Theme {
  theme = atom<ITheme>()

  constructor() {
    this.subscribe()
  }

  subscribe() {
    PubSub.subscribe(M.uiTheme, async (_msg, theme: ITheme) => {
      this.setTheme(theme)
    })
  }

  setTheme(newTheme: ITheme) {
    if (this.theme.get() === newTheme) {
      return false
    }
    this.theme.set(newTheme)
    return true
  }

  getTheme() {
    switch (this.theme.get()) {
      case 'base':
        return base
      case 'bootstrap':
        return bootstrap
      case 'dark':
        return dark
      case 'light':
      default:
        return light
    }
  }
}

export default new Theme()
