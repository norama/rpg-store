import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'

import { persistentAtom } from '@nanostores/persistent'
import { onMount, onCleanup } from 'solid-js'
import themeHolder, { ITheme } from 'styles/theme'

export const themeAtom = persistentAtom<ITheme>('theme', 'roboto')
const themeInProgressAtom = persistentAtom<string>('themeInProgress', 'false')

const themes = ['roboto', 'bootstrap', 'dark', 'base']

const ThemeSelector = () => {
  const theme = useStore(themeAtom)
  let themeAtomUnsub

  onMount(() => {
    themeAtomUnsub = themeAtom.subscribe((themeValue) => {
      console.log('themeInProgressAtom', themeInProgressAtom.get())
      if (themeInProgressAtom.get() === 'false') {
        PubSub.subscribeOnce(M.uiThemeChanged, () => {
          themeInProgressAtom.set('true')
          location.reload()
        })

        PubSub.publish(M.uiTheme, themeValue)
      } else {
        themeInProgressAtom.set('false')
        themeHolder.setTheme(themeValue)
      }
    })
  })

  onCleanup(() => {
    console.log('CCCCCCCCCC CLEANUP')
    themeAtomUnsub()
  })

  return (
    <>
      theme:
      <select
        onChange={(e) => {
          themeAtom.set(e.currentTarget.value as ITheme)
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
