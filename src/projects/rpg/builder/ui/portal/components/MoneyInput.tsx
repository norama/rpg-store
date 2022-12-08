import RpgNumberInput from '@widgets/business/RpgNumberInput'

const MoneyInput = () => {
  return (
    <RpgNumberInput
      name="money"
      min={({ strval }) => (strval()['name'] && strval()['name'].startsWith('x') ? 1 : 2)}
    />
  )
}

export default MoneyInput
