import { equipmentsInfoAtom } from '@builder/business/blocks/properties/store'
import { targetAtom } from '@builder/business/store/target'
import readyAtom from '@builder/ui/stores/readyAtom'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'

const EquipmentsDisplay = () => {
  const target = useStore(targetAtom)
  const info = useStore(equipmentsInfoAtom)
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      {target().equipments.equipments.map((equipment) => (
        <SmallChipDisplay value={() => info()[equipment].name} backgroundColor="green" />
      ))}
    </Show>
  )
}

export default EquipmentsDisplay
