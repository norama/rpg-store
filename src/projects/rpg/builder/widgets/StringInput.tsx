import { useStore } from '@nanostores/solid'
import { rpgStringValues, setStringValue } from '@builder/store'
import { createSignal } from 'solid-js'

type Props = {
  mode: IMode
  name: string
}

const StringInput = ({ mode = 'write', name }: Props) => {
  const values = useStore(rpgStringValues)

  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {mode === 'read' ? (
        <>{values()['name'] ?? ''}</>
      ) : (
        <>
          {name}:{' '}
          <input
            type="text"
            id="name"
            name="name"
            value={values()['name'] ?? ''}
            onKeyDown={(e) => {
              setStringValue(name, e.currentTarget.value)
            }}
            required
            minlength="4"
            maxlength="18"
            size="10"
            disabled={mode === 'disabled'}
          />
        </>
      )}
    </p>
  )
}

export default StringInput
