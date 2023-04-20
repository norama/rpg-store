import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import themeHolder, { ITheme } from 'styles/theme'
import { useStore } from '@nanostores/solid'
import { persistentAtom } from '@nanostores/persistent'
import { Show, onMount } from 'solid-js'
import SingleSelect from '@builder/ui/widgets/form/input/SingleSelect'
import style from 'styles/style'

const themeInProgressAtom = persistentAtom<string>('themeInProgress', '0')

const themes = [
  { value: 'light', label: 'světlý' },
  { value: 'dark', label: 'tmavý' },
]

const themeMap = themes.reduce((acc, curr) => {
  acc[curr.value] = curr
  return acc
}, {})

const ThemeSelector = () => {
  const theme = useStore(themeHolder.atom)

  onMount(() => {
    const progress = themeInProgressAtom.get()
    if (progress === '1') {
      themeInProgressAtom.set('0')
      //location.reload()
    } else if (progress === '2') {
      themeInProgressAtom.set('0')
      location.reload()
    }
  })

  return (
    <Show when={theme()}>
      <div style={{ transform: 'scale(0.8)' }}>
        <SingleSelect
          onChange={(value) => {
            if (value !== theme()) {
              PubSub.subscribeOnce(M.uiThemeStored, () => {
                themeInProgressAtom.set('1')
                location.reload()
              })
              PubSub.publish(M.uiThemeChanged, value as ITheme)
            }
          }}
          options={() => themes.map((o) => o.value)}
          texts={(value) => themeMap[value].label}
          value={() => theme()}
          customSelectStyle={style('theme')}
          customOptionStyle={style('theme')}
          customOptionsStyle={style('theme')}
        />
      </div>
    </Show>
  )
}

export default ThemeSelector
