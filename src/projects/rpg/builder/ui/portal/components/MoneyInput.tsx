import RpgNumberInput from '@widgets/business/RpgNumberInput'

const MoneyInput = () => {
  return (
    <RpgNumberInput
      name="money"
      min={({ strval, target }) =>
        strval('name', '').startsWith('x')
          ? 1
          : target().advantages.advantages.includes('laziness')
          ? 3
          : 2
      }
    />
  )
}

export default MoneyInput
