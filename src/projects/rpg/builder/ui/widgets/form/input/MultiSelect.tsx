import { InputLabel } from '@suid/material'
import style from 'styles/style'
import Select from '@norama.matema/solid-multiselect'
import { Show } from 'solid-js'

type Props = {
  disabled?: boolean
  label?: string
  placeholder?: string
  options: () => string[]
  texts?: (option: string) => string
  values: () => string[]
  onSelect: (value: string) => void
  onRemove: (value: string) => void
}

const MultiSelect = ({
  disabled,
  label,
  placeholder = 'Hledat',
  options,
  texts = (option) => option,
  values,
  onSelect,
  onRemove,
}: Props) => {
  return (
    <>
      <Show when={label}>
        <InputLabel sx={style('text')}>{label}</InputLabel>
        <div style={{ height: '10px' }} />
      </Show>
      <Select
        type="multiList"
        searchable={true}
        showCheckbox
        placeholder={placeholder}
        displayKey="label"
        idKey="id"
        onSelect={(_data, item) => onSelect(item['id'])}
        onRemove={(_data, item) => onRemove(item['id'])}
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
