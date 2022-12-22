import { createEffect } from 'solid-js'

type Props = {
  mode?: IMode
  name: string
  value: () => string
  onChange: (value: string) => void
}

const StringInput = ({ mode = 'write', name, value, onChange }: Props) => {
  return (
    <>
      {value() && (
        <p
          style={{
            color: import.meta.env.SSR ? 'red' : 'green',
            'font-weight': 700,
            'font-size': '1.5rem',
          }}
        >
          {mode === 'read' ? (
            <>{value()}</>
          ) : (
            <>
              {name}:{' '}
              <input
                type="text"
                id={name}
                name={name}
                value={value()}
                onKeyUp={(e) => {
                  onChange(e.currentTarget.value)
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
      )}
    </>
  )
}

export default StringInput
