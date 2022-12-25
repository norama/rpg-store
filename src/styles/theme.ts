import base from './themes/base'
import bootstrap from './themes/bootstrap'
import dark from './themes/dark'
import roboto from './themes/roboto'

export type ITheme = 'base' | 'bootstrap' | 'dark' | 'roboto'

let theme = 'roboto'

export const setTheme = (newTheme: ITheme) => {
  theme = newTheme
}

const getTheme = () => {
  switch (theme) {
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

export default getTheme
