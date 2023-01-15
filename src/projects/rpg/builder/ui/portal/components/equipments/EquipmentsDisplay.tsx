import { targetAtom } from '@builder/business/store/target'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const EquipmentsDisplay = () => {
  const target = useStore(targetAtom)

  return (
    <>
      {target() !== undefined &&
        target().equipments.equipments.map((equipment) => (
          <SmallChipDisplay
            value={() => equipment}
            customStyle={{ backgroundColor: 'equipment' }}
          />
        ))}
    </>
  )
}

export default EquipmentsDisplay
