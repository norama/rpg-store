import { propertiesMap } from '@builder/business/store/properties'
import ChipDisplay from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

type Props = {
  title?: string
}

const MoneyDisplay = ({ title = 'Prachy' }: Props) => {
  const properties = useStore(propertiesMap)

  return (
    <ChipDisplay
      label="💰"
      title={title}
      value={() => properties().money}
      customStyle={{ backgroundColor: 'highlight' }}
    />
  )
}

export default MoneyDisplay
