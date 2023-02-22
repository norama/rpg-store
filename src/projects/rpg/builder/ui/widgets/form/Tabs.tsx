import { Radio, RadioGroup, FormControlLabel } from '@suid/material'

type IColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'

type ITab = {
  color: IColor
  label: string
  value: string
}

type Props = {
  tabs: ITab[]
  value: () => string
  onChange: (value: string) => void
}

const Tabs = ({ tabs, value, onChange }: Props) => (
  <RadioGroup row value={value()} onChange={(e, value) => onChange(value)}>
    {tabs.map((tab) => (
      <FormControlLabel
        value={tab.value}
        control={<Radio color={tab.color} size="small" />}
        label={tab.label}
      />
    ))}
  </RadioGroup>
)

export default Tabs
