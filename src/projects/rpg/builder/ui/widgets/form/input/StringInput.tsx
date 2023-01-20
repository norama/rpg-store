import { Input, InputLabel } from '@suid/material'
import { InputProps } from '@suid/material/Input'
import style from 'styles/style'

type Props = {
  mode?: IMode
  label?: string
  value: () => string
  onChange: (value: string) => void
  inputProps?: InputProps
  customStyle?: object
}

const StringInput = ({
  mode = 'write',
  label,
  value,
  onChange,
  inputProps = {},
  customStyle = {},
}: Props) => {
  return (
    <>
      {value() !== undefined && (
        <p>
          {label && <InputLabel sx={style('text')}>{label}</InputLabel>}
          <Input
            {...inputProps}
            value={value()}
            onChange={(_e, value) => {
              onChange(value)
            }}
            required
            disabled={mode === 'disabled' || mode === 'read'}
            sx={style('input', customStyle)}
          />
        </p>
      )}
    </>
  )
}

export default StringInput
