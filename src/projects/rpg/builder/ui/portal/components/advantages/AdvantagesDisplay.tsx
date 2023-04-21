import { advantagesInfoAtom } from '@builder/business/blocks/properties/store'
import { targetAtom } from '@builder/business/store/target'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const AdvantagesDisplay = () => {
  const target = useStore(targetAtom)
  const info = useStore(advantagesInfoAtom)

  return (
    <>
      {target() !== undefined &&
        info() !== undefined &&
        target().advantages.advantages.map((advantage) => (
          <SmallChipDisplay value={() => info()[advantage].name} backgroundColor="blue" />
        ))}
    </>
  )
}

export default AdvantagesDisplay
