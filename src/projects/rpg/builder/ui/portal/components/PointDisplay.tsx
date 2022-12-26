import { propertiesMap } from '@builder/business/store/properties'
import ChipDisplay from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const PointDisplay = () => {
  const properties = useStore(propertiesMap)

  return (
    <ChipDisplay
      label="⬤"
      value={() => properties().points}
      chipProps={{ color: 'info' }}
      customStyle={{ marginTop: '30px' }}
    />
  )
}

export default PointDisplay
