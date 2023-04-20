import PubSub from 'pubsub-js'
import M from 'pubsub/messages'
import themeHolder, { ITheme } from 'styles/theme'
import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'
import SingleSelect from '@builder/ui/widgets/form/input/SingleSelect'
import style from 'styles/style'

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

  return (
    <Show when={theme()}>
      <div style={{ transform: 'scale(0.8)' }}>
        <SingleSelect
          onChange={(value) => {
            if (value !== theme()) {
              PubSub.subscribeOnce(M.uiThemeStored, () => {
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
