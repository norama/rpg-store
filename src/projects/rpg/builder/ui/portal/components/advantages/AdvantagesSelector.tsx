import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/advantages/store'
import MultiSelect from '@builder/ui/widgets/form/input/MultiSelect'
import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'
import readyAtom from '@builder/ui/stores/readyAtom'
import stateAtom from '@builder/ui/stores/stateAtom'

const AdvantagesSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)
  const state = useStore(stateAtom)
  const ready = useStore(readyAtom)

  const text = (advantage: string) => info()[advantage].name + ' (' + info()[advantage].points + ')'

  const points = (advantages: string[]) =>
    advantages.reduce((sum, advantage) => sum + info()[advantage].points, 0)

  const updateAdvantages = (advantages: string[]) => {
    const newPoints = properties().points - points(block().advantages) + points(advantages)

    blockMap.setKey('advantages', advantages)
    propertiesMap.setKey('points', newPoints)
  }

  return (
    <Show when={ready()}>
      <MultiSelect
        label="Výhody - nevýhody"
        disabled={state() === 'saving'}
        options={() => Object.keys(info()).sort()}
        values={() => block().advantages}
        texts={(advantage) => text(advantage)}
        onChange={updateAdvantages}
      />
    </Show>
  )
}

export default AdvantagesSelector
