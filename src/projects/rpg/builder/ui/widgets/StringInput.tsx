import { Input, InputLabel } from '@suid/material'
import style from 'styles/style'

type Props = {
  mode?: IMode
  name: string
  value: () => string
  onChange: (value: string) => void
}

const StringInput = ({ mode = 'write', name, value, onChange }: Props) => {
  return (
    <>
      {value() && (
        <p>
          <InputLabel sx={style('text')}>{name}</InputLabel>
          <Input
            value={value()}
            onChange={(_e, value) => {
              onChange(value)
            }}
            required
            disabled={mode === 'disabled' || mode === 'read'}
            sx={style('input')}
          />
        </p>
      )}
    </>
  )
}

export default StringInput
