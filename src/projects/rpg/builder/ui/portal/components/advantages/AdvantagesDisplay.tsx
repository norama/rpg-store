import { advantagesInfoAtom } from '@builder/business/blocks/properties/store'
import { targetAtom } from '@builder/business/store/target'
import readyAtom from '@builder/ui/stores/readyAtom'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'

const AdvantagesDisplay = () => {
  const target = useStore(targetAtom)
  const info = useStore(advantagesInfoAtom)
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      {target().advantages.advantages.map((advantage) => (
        <SmallChipDisplay value={() => info()[advantage].name} backgroundColor="blue" />
      ))}
    </Show>
  )
}

export default AdvantagesDisplay
