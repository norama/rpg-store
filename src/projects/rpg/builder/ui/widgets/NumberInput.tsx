import { useStore } from '@nanostores/solid'
import { numberValuesMap, setNumberValue, stringValuesMap } from '@builder/ui/stores/blockAtom'
import { createMemo } from 'solid-js'

export type NumberInputFuncArgs<T> = {
  strval: (key: string, defval?: string) => string
  numval: (key: string, defval?: number) => number
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
  const numberValues = useStore(numberValuesMap)
  const stringValues = useStore(stringValuesMap)

  const numval = createMemo(
    () =>
      (key: string, defval = 0) =>
        numberValues()[key] ?? defval
  )
  const strval = createMemo(
    () =>
      (key: string, defval = '') =>
        stringValues()[key] ?? defval
  )

  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{numval()(name)}</>
      ) : (
        <>
          {name}:{' '}
          <input
            type="number"
            id={name}
            name={name}
            value={numval()(name)}
            onKeyUp={(e) => {
              setNumberValue(name, Number(e.currentTarget.value))
            }}
            required
            min={min ? min({ strval: strval(), numval: numval(), target }) : undefined}
            max={max ? max({ strval: strval(), numval: numval(), target }) : undefined}
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
