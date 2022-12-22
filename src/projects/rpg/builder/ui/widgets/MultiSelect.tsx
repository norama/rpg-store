type Props = {
  mode?: IMode
  name: string
  options: string[]
  values: string[]
  texts?: Record<string, string>
  onChange: (values: string[]) => void
}

const MultiSelect = ({ mode = 'write', name, options, values, texts = {}, onChange }: Props) => {
  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{JSON.stringify(values) ?? ''}</>
      ) : (
        <>
          {name}:{' '}
          <select
            multiple
            id={name}
            name={name}
            onChange={(e) => {
              const newValues = Array.from(e.currentTarget.selectedOptions).map((o) => o.value)
              onChange(newValues)
            }}
            size={8}
            disabled={mode === 'disabled'}
          >
            {options.map((option) => (
              <option value={option} selected={values.includes(option)}>
                {texts[option] ?? option}
              </option>
            ))}
          </select>
        </>
      )}
    </p>
  )
}

export default MultiSelect
