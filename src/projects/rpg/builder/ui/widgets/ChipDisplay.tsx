import { Chip, Avatar } from '@suid/material'
import { ChipProps } from '@suid/material/Chip'
import style from 'styles/style'
import { Show } from 'solid-js'
import themeHolder from 'styles/theme'
import { useStore } from '@nanostores/solid'
import './ChipDisplay.scss'

type Props = {
  label?: string
  title?: string
  size?: 'small' | 'large'
  color?: string
  backgroundColor?: string
  value: () => string | number
  chipProps?: ChipProps
  customStyle?: object
}

const ChipDisplay = ({
  label = '',
  title = '',
  value,
  chipProps = {},
  customStyle = {},
  size = 'large',
  color,
  backgroundColor,
}: Props) => {
  const theme = useStore(themeHolder.atom)

  return (
    <>
      <div
        class={`ChipDisplay ${theme()} ${size}`}
        style={{ color: color, 'background-color': backgroundColor }}
        title={title}
      >
        <Show when={!!label}>
          <div class="chip-head">{label}</div>
        </Show>
        <div class="chip-content">{value() ?? ''}</div>
      </div>
      {false && (
        <Chip
          {...chipProps}
          title={title}
          label={value()}
          avatar={label ?? <Avatar>{label}</Avatar>}
          sx={{
            ...style('chip', customStyle),
            height: '4rem',
            borderRadius: '2rem',
          }}
        />
      )}
    </>
  )
}

export const SmallChipDisplay = (props: Props) => (
  <ChipDisplay
    {...props}
    size="small"
    chipProps={{ ...props.chipProps, size: 'small' }}
    customStyle={{ ...props.customStyle, fontSize: 1, height: '2rem', borderRadius: '1rem' }}
  />
)

export default ChipDisplay
