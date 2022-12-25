import { Input, Text } from '@hope-ui/core'
import style from 'styles/style'

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
        <p>
          {mode === 'read' ? (
            <>{value()}</>
          ) : (
            <>
              <Text sx={style('text', { fontWeight: 'heading' })}>{name}</Text>
              <Input
                value={value()}
                onInput={(e) => {
                  onChange(e.currentTarget.value)
                }}
                size="sm"
                isRequired
                isDisabled={mode === 'disabled'}
                sx={style('input')}
              />
            </>
          )}
        </p>
      )}
    </>
  )
}

export default StringInput
