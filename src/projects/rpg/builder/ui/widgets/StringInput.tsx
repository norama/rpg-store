import { useStore } from '@nanostores/solid'
import { stringValuesMap, setStringValue } from '@builder/ui/stores/blockAtom'

type Props = {
  mode?: IMode
  name: string
}

const StringInput = ({ mode = 'write', name }: Props) => {
  const values = useStore(stringValuesMap)

  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{values()[name] ?? ''}</>
      ) : (
        <>
          {name}:{' '}
          <input
            type="text"
            id={name}
            name={name}
            value={values()[name] ?? ''}
            onKeyUp={(e) => {
              setStringValue(name, e.currentTarget.value)
            }}
            required
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

export default StringInput
