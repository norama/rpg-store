import { Input, InputLabel } from '@suid/material'
import { InputProps } from '@suid/material/Input'
import style from 'styles/style'

type Props = {
  disabled?: boolean
  label?: string
  value: () => string
  onChange: (value: string) => void
  inputProps?: InputProps
  customStyle?: object
}

const StringInput = ({
  disabled,
  label,
  value,
  onChange,
  inputProps = {},
  customStyle = {},
}: Props) => {
  return (
    <>
      {label && <InputLabel sx={style('text')}>{label}</InputLabel>}
      <Input
        {...inputProps}
        value={value()}
        onChange={(_e, value) => {
          onChange(value)
        }}
        required
        disabled={disabled}
        sx={style('input', customStyle)}
      />
    </>
  )
}

export default StringInput
