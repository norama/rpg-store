import { useStore } from '@nanostores/solid'
import { rpgNumberValues, setNumberValue, rpgStringValues } from '@stores/store'

export type NumberInputFuncArgs<T> = {
  strval: () => Record<string, string>
  numval: () => Record<string, number>
  target: () => T
}

export type NumberInputProps<T> = {
  mode?: IMode
  name: string
  target: () => T
  min?: (args: NumberInputFuncArgs<T>) => number
  max?: (args: NumberInputFuncArgs<T>) => number
}

const NumberInput = <T,>({ mode = 'write', name, target, min, max }: NumberInputProps<T>) => {
  const numval = useStore(rpgNumberValues)
  const strval = useStore(rpgStringValues)

  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{numval()[name] ?? ''}</>
      ) : (
        <>
          {name}:{' '}
          <input
            type="number"
            id={name}
            name={name}
            value={numval()[name] ?? ''}
            onKeyUp={(e) => {
              setNumberValue(name, Number(e.currentTarget.value))
            }}
            required
            min={min ? min({ strval, numval, target }) : undefined}
            max={max ? max({ strval, numval, target }) : undefined}
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
