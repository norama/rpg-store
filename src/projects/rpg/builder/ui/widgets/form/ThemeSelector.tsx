import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import { useStore } from '@nanostores/solid'

import { persistentAtom } from '@nanostores/persistent'
import { onMount, onCleanup } from 'solid-js'

export const themeAtom = persistentAtom<string>('theme', 'roboto')

const themes = ['roboto', 'bootstrap', 'dark', 'base']

const ThemeSelector = () => {
  const theme = useStore(themeAtom)
  let themeAtomUnsub, pubsubUnsub

  onMount(() => {
    themeAtomUnsub = themeAtom.subscribe((theme) => {
      PubSub.publish(M.uiTheme, theme)
    })

    pubsubUnsub = PubSub.subscribe(M.uiThemeChanged, () => {
      location.reload()
    })
  })

  onCleanup(() => {
    themeAtomUnsub()
    PubSub.unsubscribe(pubsubUnsub)
  })

  return (
    <>
      theme:
      <select
        onChange={(e) => {
          themeAtom.set(e.currentTarget.value)
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
