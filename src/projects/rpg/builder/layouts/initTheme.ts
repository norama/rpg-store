import { select } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'
import themeHolder, { ITheme } from 'styles/theme'

const initTheme = async () => {
  const theme = await select<ITheme>(T.uiTheme)
  themeHolder.setTheme(theme)
}

export default initTheme
