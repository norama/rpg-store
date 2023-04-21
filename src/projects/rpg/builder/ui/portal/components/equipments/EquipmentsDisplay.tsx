import { equipmentsInfoAtom } from '@builder/business/blocks/properties/store'
import { targetAtom } from '@builder/business/store/target'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'

const EquipmentsDisplay = () => {
  const target = useStore(targetAtom)
  const info = useStore(equipmentsInfoAtom)

  return (
    <>
      {target() !== undefined &&
        info() !== undefined &&
        target().equipments.equipments.map((equipment) => (
          <SmallChipDisplay value={() => info()[equipment].name} backgroundColor="green" />
        ))}
    </>
  )
}

export default EquipmentsDisplay
