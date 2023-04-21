import { propertiesMap } from '@builder/business/store/properties'
import ChipDisplay from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'
import themeHolder from 'styles/theme'

type Props = {
  title?: string
}

const MoneyDisplay = ({ title = 'Prachy' }: Props) => {
  const properties = useStore(propertiesMap)
  const theme = useStore(themeHolder.theme)

  return (
    <ChipDisplay
      label="💰"
      title={title}
      value={() => properties().money}
      backgroundColor={theme()?.colors['highlight']}
    />
  )
}

export default MoneyDisplay
