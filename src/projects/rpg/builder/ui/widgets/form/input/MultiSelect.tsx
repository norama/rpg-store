import { InputLabel } from '@suid/material'
import style from 'styles/style'
import Select from '@norama.matema/solid-multiselect'

type Props = {
  disabled?: boolean
  label?: string
  placeholder?: string
  options: () => string[]
  texts?: (option: string) => string
  values: () => string[]
  onChange: (values: string[]) => void
}

const MultiSelect = ({
  disabled,
  label,
  placeholder = '',
  options,
  texts = (option) => option,
  values,
  onChange,
}: Props) => {
  return (
    <>
      {label && <InputLabel sx={style('text')}>{label}</InputLabel>}
      <div style={{ height: '10px' }} />
      <Select
        type="multiList"
        searchable={true}
        showCheckbox
        placeholder={placeholder}
        displayKey="label"
        idKey="id"
        onSelect={(data) => onChange(data.map((item) => item['id']))}
        onRemove={(data) => onChange(data.map((item) => item['id']))}
        disabled={disabled}
        style={{
          multiSelectContainer: style('multiSelect'),
          selectedListContainer: style('multiSelectList'),
          optionContainer: style('multiOptions'),
          option: style('multiOption'),
          inputField: style('input'),
        }}
        emptyRecordMsg=""
        options={options().map((option) => ({ id: option, label: texts(option) }))}
        selectedValues={values().map((value) => ({ id: value, label: texts(value) }))}
      />
    </>
  )
}

export default MultiSelect
