import { targetAtom } from '@builder/business/store/target'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const AdvantagesDisplay = () => {
  const target = useStore(targetAtom)

  return (
    <>
      {target() !== undefined &&
        target().advantages.advantages.map((advantage) => (
          <SmallChipDisplay
            value={() => advantage}
            customStyle={{ backgroundColor: 'advantage' }}
          />
        ))}
    </>
  )
}

export default AdvantagesDisplay
