import { InputLabel } from '@suid/material'
import style from 'styles/style'
import Select from '@norama.matema/solid-multiselect'
import { JSX } from 'solid-js'

type Props = {
  disabled?: boolean
  label?: string
  placeholder?: string
  options: () => string[]
  texts?: (option: string) => string
  values: () => string[]
  onChange: (values: string[]) => void
  customSelectStyle?: JSX.CSSProperties
  customOptionStyle?: JSX.CSSProperties
  customOptionsStyle?: JSX.CSSProperties
}

const MultiSelect = ({
  disabled,
  label,
  placeholder = '',
  options,
  texts = (option) => option,
  values,
  onChange,
  customSelectStyle = {},
  customOptionStyle = {},
  customOptionsStyle = {},
}: Props) => {
  return (
    <>
      {label && <InputLabel sx={style('text')}>{label}</InputLabel>}
      <Select
        type="multiList"
        searchable={true}
        placeholder={placeholder}
        displayKey="label"
        idKey="id"
        onSelect={(data) => onChange(data.map((item) => item['id']))}
        onRemove={(data) => onChange(data.map((item) => item['id']))}
        disabled={disabled}
        style={{
          multiSelectContainer: style('select', customSelectStyle),
          optionContainer: style('options', customOptionsStyle),
          option: style('option', customOptionStyle),
        }}
        emptyRecordMsg=""
        options={options().map((option) => ({ id: option, label: texts(option) }))}
        selectedValues={values().map((value) => ({ id: value, label: texts(value) }))}
      />
    </>
  )
}

export default MultiSelect
