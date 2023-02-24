import { Box, Radio, RadioGroup, FormControlLabel } from '@suid/material'
import './Tabs.css'

type ITab = {
  color: string
  label: string
  value: string
}

type Props = {
  tabs: ITab[]
  value: () => string
  onChange: (value: string) => void
}

const Tabs = ({ tabs, value, onChange }: Props) => (
  <RadioGroup row value={value()} onChange={(e, value) => onChange(value)} class="tabs">
    {tabs.map((tab) => (
      <Box
        class={`tab ${tab.value === value() ? 'selected' : ''}`}
        sx={tab.value === value() ? { borderBottom: `2px solid ${tab.color}` } : undefined}
      >
        <FormControlLabel
          value={tab.value}
          control={<Radio />}
          label={<h3>{tab.label}</h3>}
          disableTypography
        />
      </Box>
    ))}
  </RadioGroup>
)

export default Tabs
