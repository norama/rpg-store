import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import Theme, { ITheme } from 'styles/theme'
import { useStore } from '@nanostores/solid'
import { persistentAtom } from '@nanostores/persistent'
import { onMount } from 'solid-js'

const themeInProgressAtom = persistentAtom<string>('themeInProgress', '0')

const themes = ['roboto', 'bootstrap', 'dark', 'base']

const ThemeSelector = () => {
  const theme = useStore(Theme.theme)

  onMount(() => {
    if (themeInProgressAtom.get() === '1') {
      themeInProgressAtom.set('2')
      location.reload()
    }
    if (themeInProgressAtom.get() === '2') {
      themeInProgressAtom.set('0')
      location.reload()
    }
  })

  return (
    <>
      theme:
      <select
        onChange={(e) => {
          PubSub.subscribeOnce(M.uiThemeStored, () => {
            themeInProgressAtom.set('1')
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
