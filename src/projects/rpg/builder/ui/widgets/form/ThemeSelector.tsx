import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import Theme, { ITheme } from 'styles/theme'
import { useStore } from '@nanostores/solid'
import { persistentAtom } from '@nanostores/persistent'
import { onMount } from 'solid-js'
import styles from './ThemeSelector.module.css'

const themeInProgressAtom = persistentAtom<string>('themeInProgress', '0')

const themes = [
  { value: 'light', label: 'světlý' },
  { value: 'dark', label: 'tmavý' },
]

const ThemeSelector = () => {
  const theme = useStore(Theme.theme)

  onMount(() => {
    const progress = themeInProgressAtom.get()
    if (progress === '1') {
      themeInProgressAtom.set('2')
      location.reload()
    } else if (progress === '2') {
      themeInProgressAtom.set('0')
      location.reload()
    }
  })

  return (
    <>
      {theme() && (
        <div class={styles.themeSelector}>
          <div class={styles.themeLabel}>vzhled:</div>
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
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      )}
    </>
  )
}

export default ThemeSelector
