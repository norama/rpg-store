import { propertiesMap } from '@builder/business/store/properties'
import { useStore } from '@nanostores/solid'

const PointDisplay = () => {
  const properties = useStore(propertiesMap)

  return <h2>{properties().points}</h2>
}

export default PointDisplay
