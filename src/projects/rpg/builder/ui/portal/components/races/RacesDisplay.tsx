import { racesInfoAtom } from '@builder/business/blocks/properties/store'
import { targetAtom } from '@builder/business/store/target'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const RacesDisplay = () => {
  const target = useStore(targetAtom)
  const info = useStore(racesInfoAtom)

  return (
    <>
      {target() !== undefined &&
        info() !== undefined &&
        target().races.races.map((race) => (
          <SmallChipDisplay value={() => info()[race].name} backgroundColor="red" />
        ))}
    </>
  )
}

export default RacesDisplay
