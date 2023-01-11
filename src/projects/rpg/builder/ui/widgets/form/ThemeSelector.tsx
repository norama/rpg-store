import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import Theme, { ITheme } from 'styles/theme'
import { useStore } from '@nanostores/solid'
import { persistentAtom } from '@nanostores/persistent'
import { onMount } from 'solid-js'

const themeInProgressAtom = persistentAtom<string>('themeInProgress', 'false')

const themes = ['roboto', 'bootstrap', 'dark', 'base']

const ThemeSelector = () => {
  const theme = useStore(Theme.theme)

  onMount(() => {
    if (themeInProgressAtom.get() === 'true') {
      themeInProgressAtom.set('false')
      setTimeout(() => {
        location.reload()
      }, 500)
    }
  })

  return (
    <>
      theme:
      <select
        onChange={(e) => {
          PubSub.subscribeOnce(M.uiThemeStored, () => {
            themeInProgressAtom.set('true')
            location.reload()
          })
          PubSub.publish(M.uiThemeChanged, e.currentTarget.value as ITheme)
        }}
        value={theme()}
      >
        {themes.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </>
  )
}

export default ThemeSelector
