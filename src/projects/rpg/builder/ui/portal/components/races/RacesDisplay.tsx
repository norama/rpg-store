import { racesInfoAtom } from '@builder/business/blocks/properties/store'
import { targetAtom } from '@builder/business/store/target'
import readyAtom from '@builder/ui/stores/readyAtom'
import { SmallChipDisplay } from '@builder/ui/widgets/ChipDisplay'
import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'

const RacesDisplay = () => {
  const target = useStore(targetAtom)
  const info = useStore(racesInfoAtom)
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      {target().races.races.map((race) => (
        <SmallChipDisplay value={() => info()[race].name} backgroundColor="red" />
      ))}
    </Show>
  )
}

export default RacesDisplay
