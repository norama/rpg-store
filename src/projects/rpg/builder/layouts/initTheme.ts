import { select } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'
import Theme, { ITheme } from 'styles/theme'

const initTheme = async () => {
  const theme = await select<ITheme>(T.uiTheme)
  Theme.setTheme(theme)
}

export default initTheme
