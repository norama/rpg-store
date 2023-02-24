import { Button, Card, CardActions, CardContent } from '@suid/material'
import { JSXElement, Show } from 'solid-js'
import { useStore } from '@nanostores/solid'
import readyAtom from '@builder/ui/stores/readyAtom'
import { createMediaQuery } from '@solid-primitives/media'
import style from 'styles/style'
import './CardLink.css'

type Props = {
  header: string
  action: string
  href: string
  customStyle?: object
  children: JSXElement
}

const CardLink = ({ header, action, href, customStyle, children }: Props) => {
  const ready = useStore(readyAtom)
  const isSmall = createMediaQuery('(max-width: 60rem)')

  return (
    <Show when={ready()}>
      <Card sx={style('card', customStyle)} class={`card ${isSmall() ? 'small' : 'large'}`}>
        <CardContent>
          <h3>{header}</h3>
          <div>{children}</div>
        </CardContent>
        <CardActions
          sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}
          class="cardAction"
        >
          <Button href={href} variant="outlined" size="small" sx={style('linkButton')}>
            {action}
          </Button>
        </CardActions>
      </Card>
    </Show>
  )
}

export default CardLink
