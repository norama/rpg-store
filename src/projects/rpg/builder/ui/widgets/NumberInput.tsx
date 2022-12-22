export type NumberInputProps<T> = {
  mode?: IMode
  name: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const NumberInput = <T,>({
  mode = 'write',
  name,
  value,
  onChange,
  min,
  max,
}: NumberInputProps<T>) => {
  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{value}</>
      ) : (
        <>
          {name}:{' '}
          <input
            type="number"
            id={name}
            name={name}
            value={value}
            onKeyUp={(e) => {
              onChange(Number(e.currentTarget.value))
            }}
            required
            min={min}
            max={max}
            minlength={3}
            maxlength={30}
            size={20}
            disabled={mode === 'disabled'}
          />
        </>
      )}
    </p>
  )
}

export default NumberInput
