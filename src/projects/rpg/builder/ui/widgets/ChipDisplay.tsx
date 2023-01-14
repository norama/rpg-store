import { Chip, Avatar } from '@suid/material'
import { ChipProps } from '@suid/material/Chip'
import style from 'styles/style'

type Props = {
  label?: string
  title?: string
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
}: Props) => {
  return (
    <>
      {value() !== undefined && (
        <Chip
          {...chipProps}
          title={title}
          label={value()}
          avatar={label ?? <Avatar>{label}</Avatar>}
          sx={style('chip', customStyle)}
        />
      )}
    </>
  )
}

export default ChipDisplay
