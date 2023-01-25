type Props = {
  mode?: IMode
  name: string
  options: () => string[]
  values: () => string[]
  texts?: (option: string) => string
  disabled?: (option: string) => boolean
  onChange: (value: string) => void
}

const SingleSelect = ({
  mode = 'write',
  name,
  options,
  values,
  texts = (option) => option,
  disabled = () => false,
  onChange,
}: Props) => {
  return (
    <>
      {values() && options() && (
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
                id={name}
                name={name}
                onChange={(e) => {
                  const newValues = Array.from(e.currentTarget.selectedOptions).map((o) => o.value)
                  onChange(newValues[0])
                }}
                size={8}
                disabled={mode === 'disabled'}
              >
                {options().map((option) => (
                  <option
                    value={option}
                    selected={values().includes(option)}
                    disabled={disabled(option)}
                  >
                    {texts(option)}
                  </option>
                ))}
              </select>
            </>
          )}
        </p>
      )}
    </>
  )
}

export default SingleSelect
