import { Button, Card, CardActions, CardContent } from '@suid/material'
import { JSXElement, Show } from 'solid-js'
import { useStore } from '@nanostores/solid'
import themeHolder from 'styles/theme'
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
  const theme = useStore(themeHolder.atom)

  return (
    <Show when={theme()}>
      <Card sx={style('card', customStyle)} class="card">
        <CardContent>
          <div>{header}</div>
          <div>{children}</div>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }} class="cardAction">
          <Button href={href} variant="outlined" size="small" sx={style('linkButton')}>
            {action}
          </Button>
        </CardActions>
      </Card>
    </Show>
  )
}

export default CardLink
