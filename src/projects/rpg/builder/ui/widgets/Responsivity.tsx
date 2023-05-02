import { createMediaQuery } from '@solid-primitives/media'
import { createEffect } from 'solid-js'

type Props = {
  className: string
}

const Responsivity = ({ className }: Props) => {
  const isSmall = createMediaQuery('(max-width: 70rem)')

  createEffect(() => {
    const small = isSmall()
    const newRespClass = small ? 'small' : 'large'
    const oldRespClass = small ? 'large' : 'small'

    const targets = document.querySelectorAll<HTMLElement>(`.${className}`)
    //console.log('targets', targets)

    for (let target of targets) {
      target.classList.remove(oldRespClass)
      target.classList.add(newRespClass)
      target.style.visibility = 'visible'
    }
  })

  return null
}

export default Responsivity
