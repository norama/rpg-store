import { useStore } from '@nanostores/solid'
import { stringArraysMap, setStringArray } from '@builder/ui/stores/blockAtom'

type Props = {
  mode?: IMode
  name: string
  options: string[]
}

const MultiSelect = ({ mode = 'write', name, options }: Props) => {
  const values = useStore(stringArraysMap)

  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{JSON.stringify(values()[name]) ?? ''}</>
      ) : (
        <>
          {name}:{' '}
          <select
            multiple
            id={name}
            name={name}
            onChange={(e) => {
              const values = Array.from(e.currentTarget.selectedOptions).map((o) => o.value)
              setStringArray(name, values)
            }}
            size={8}
            disabled={mode === 'disabled'}
          >
            {options.map((option) => (
              <option value={option} selected={values()[name] && values()[name].includes(option)}>
                {option}
              </option>
            ))}
          </select>
        </>
      )}
    </p>
  )
}

export default MultiSelect
