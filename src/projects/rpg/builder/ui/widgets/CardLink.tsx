import { Button, Card, CardActions, CardContent } from '@suid/material'
import style from 'styles/style'

type Props = {
  header: string
  action: string
  href: string
  customStyle?: object
  children: Node
}

const CardLink = ({ header, action, href, customStyle, children }: Props) => {
  return (
    <Card sx={style('chip', customStyle)}>
      <CardContent>
        <div>{header}</div>
        <div>{children}</div>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button href={href} size="small">
          {action}
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardLink
