import { Button, Link } from '@kobalte/core'
import { JSXElement, Show } from 'solid-js'
import themeHolder from 'styles/theme'
import { useStore } from '@nanostores/solid'
import readyAtom from '@builder/ui/stores/readyAtom'
import { createMediaQuery } from '@solid-primitives/media'
import './CardLink.scss'

type Props = {
  header: string
  action: string
  href: string
  customStyle?: object
  children: JSXElement
}

const CardLink = ({ header, action, href, customStyle, children }: Props) => {
  const isSmall = createMediaQuery('(max-width: 70rem)')
  const themeObject = useStore(themeHolder.theme)
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      <div
        style={{
          color: themeObject()?.colors['sharp'],
          'background-color': themeObject()?.colors['card'],
          ...customStyle,
        }}
        class={`card ${isSmall() ? 'small' : 'large'}`}
      >
        <h2 style={{ color: themeObject()?.colors['background'] }}>{header}</h2>

        <div>{children}</div>
        <div class="cardAction">
          <Button.Root
            style={{
              color: themeObject()?.colors['linkButton'],
              'border-color': themeObject()?.colors['muted'],
              background: 'transparent',
            }}
            class="LinkButton cardAction"
          >
            <Link.Root href={href}>{action}</Link.Root>
          </Button.Root>
        </div>
      </div>
    </Show>
  )
}

export default CardLink
