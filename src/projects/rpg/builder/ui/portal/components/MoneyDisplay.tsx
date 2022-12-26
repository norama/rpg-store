import { propertiesMap } from '@builder/business/store/properties'
import ChipDisplay from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const MoneyDisplay = () => {
  const properties = useStore(propertiesMap)

  return (
    <ChipDisplay
      label="💰"
      value={() => properties().money}
      customStyle={{ marginTop: '30px', backgroundColor: 'highlight' }}
    />
  )
}

export default MoneyDisplay
