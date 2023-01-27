import { NativeSelect, InputLabel } from '@suid/material'
import { NativeSelectProps } from '@suid/material/NativeSelect'
import style from 'styles/style'

type Props = {
  disabled?: boolean
  label: string
  options: () => string[]
  texts?: (option: string) => string
  value: () => string
  onChange: (value: string) => void
  selectProps?: NativeSelectProps
  customStyle?: object
}

const SingleSelect = ({
  disabled,
  label,
  options,
  texts = (option) => option,
  value,
  onChange,
  selectProps = {},
  customStyle = {},
}: Props) => {
  return (
    <p>
      {label && <InputLabel sx={style('text')}>{label}</InputLabel>}
      <NativeSelect
        {...selectProps}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        sx={style('select', customStyle)}
      >
        {options().map((option) => (
          <option value={option} selected={option === value()} style={style('option', customStyle)}>
            {texts(option)}
          </option>
        ))}
      </NativeSelect>
    </p>
  )
}

export default SingleSelect
