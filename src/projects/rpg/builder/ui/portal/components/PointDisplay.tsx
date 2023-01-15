import { propertiesMap } from '@builder/business/store/properties'
import ChipDisplay from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

type Props = {
  title?: string
}

const PointDisplay = ({ title = 'Body' }: Props) => {
  const properties = useStore(propertiesMap)

  return (
    <ChipDisplay
      label="⬤"
      title={title}
      value={() => properties().points}
      chipProps={{ color: 'info' }}
    />
  )
}

export default PointDisplay
