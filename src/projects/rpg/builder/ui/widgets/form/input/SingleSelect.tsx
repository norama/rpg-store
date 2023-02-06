import { InputLabel } from '@suid/material'
import style from 'styles/style'
import Select from '@norama.matema/solid-multiselect'

type Props = {
  disabled?: boolean
  label?: string
  options: () => string[]
  texts?: (option: string) => string
  value: () => string
  onChange: (value: string) => void
  customSelectStyle?: object
  customOptionStyle?: object
  customOptionsStyle?: object
}

const SingleSelect = ({
  disabled,
  label,
  options,
  texts = (option) => option,
  value,
  onChange,
  customSelectStyle = {},
  customOptionStyle = {},
  customOptionsStyle = {},
}: Props) => {
  return (
    <>
      {label && <InputLabel sx={style('text')}>{label}</InputLabel>}
      <Select
        singleSelect
        isObject
        searchable={false}
        placeholder="Vyberte rasu"
        displayValue="label"
        onSelect={(data) => onChange(data[0]['id'])}
        onRemove={(data) => {
          console.log('REMOVE', data)
        }}
        onSearch={(search) => {
          console.log('search', search)
          if (search.trim() === '') {
            onChange(value())
          }
        }}
        disable={disabled}
        style={{
          multiSelectContainer: style('select', customSelectStyle),
          optionContainer: style('options', customOptionsStyle),
          option: style('option', customOptionStyle),
        }}
        emptyRecordMsg=""
        options={options().map((option) => ({ id: option, label: texts(option) }))}
        selectedValues={[{ id: value(), label: texts(value()) }]}
      />
    </>
  )
}

export default SingleSelect
