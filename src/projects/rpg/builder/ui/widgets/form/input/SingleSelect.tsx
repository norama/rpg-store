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
  value: () => string
  onChange: (value: string) => void
  customSelectStyle?: JSX.CSSProperties
  customOptionStyle?: JSX.CSSProperties
  customOptionsStyle?: JSX.CSSProperties
}

const SingleSelect = ({
  disabled,
  label,
  placeholder = '',
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
        type="single"
        searchable={false}
        placeholder={placeholder}
        displayKey="label"
        idKey="id"
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
        disabled={disabled}
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
