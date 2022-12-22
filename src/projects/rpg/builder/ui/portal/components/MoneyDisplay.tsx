import { propertiesMap } from '@builder/business/store/properties'
import { useStore } from '@nanostores/solid'

const MoneyDisplay = () => {
  const properties = useStore(propertiesMap)

  return <h2>{properties().money}</h2>
}

export default MoneyDisplay
