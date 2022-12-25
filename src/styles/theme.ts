import base from './themes/base'
import bootstrap from './themes/bootstrap'
import dark from './themes/dark'
import roboto from './themes/roboto'

export type ITheme = 'base' | 'bootstrap' | 'dark' | 'roboto'

class Theme {
  theme = 'roboto'

  setTheme(newTheme: ITheme) {
    console.log('========> setTheme server: ' + import.meta.env.SSR, newTheme)
    this.theme = newTheme
  }

  getTheme() {
    console.log('=============> server: ' + import.meta.env.SSR + ' theme: ' + this.theme)

    switch (this.theme) {
      case 'base':
        return base
      case 'bootstrap':
        return bootstrap
      case 'dark':
        return dark
      case 'roboto':
      default:
        return roboto
    }
  }
}

export default new Theme()
