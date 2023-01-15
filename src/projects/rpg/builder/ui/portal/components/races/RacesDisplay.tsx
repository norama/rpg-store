import { targetAtom } from '@builder/business/store/target'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const RacesDisplay = () => {
  const target = useStore(targetAtom)

  return (
    <>
      {target() !== undefined &&
        target().races.races.map((race) => (
          <SmallChipDisplay value={() => race} customStyle={{ backgroundColor: 'race' }} />
        ))}
    </>
  )
}

export default RacesDisplay
