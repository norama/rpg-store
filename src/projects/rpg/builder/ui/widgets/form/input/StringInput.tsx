import { TextField } from '@kobalte/core'
import themeHolder from 'styles/theme'
import { useStore } from '@nanostores/solid'
import './StringInput.scss'

type Props = {
  disabled?: boolean
  label?: string
  value: () => string
  onChange: (value: string) => void
  placeholder?: string
  customStyle?: object
}

const StringInput = ({ disabled, label, value, onChange, placeholder, customStyle }: Props) => {
  const theme = useStore(themeHolder.atom)
  const themeObject = useStore(themeHolder.theme)

  return (
    <TextField.Root
      value={value()}
      onValueChange={onChange}
      isDisabled={disabled}
      class={`StringInput ${theme()}`}
      style={{ ...customStyle, color: themeObject()?.colors['text'] }}
    >
      <TextField.Label class="label">{label}</TextField.Label>
      <TextField.Input
        class="input"
        placeholder={placeholder}
        style={{ color: themeObject()?.colors['text'], background: themeObject()?.colors['muted'] }}
      />
    </TextField.Root>
  )
}

export default StringInput
