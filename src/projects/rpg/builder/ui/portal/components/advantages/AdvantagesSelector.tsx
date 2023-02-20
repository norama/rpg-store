import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/advantages/store'
import MultiSelect from '@builder/ui/widgets/form/input/MultiSelect'
import { useStore } from '@nanostores/solid'
import { Show, createSignal } from 'solid-js'
import readyAtom from '@builder/ui/stores/readyAtom'
import stateAtom from '@builder/ui/stores/stateAtom'
import { Radio, RadioGroup, FormControlLabel } from '@suid/material'

type IFilter = 'advantages' | 'disadvantages' | 'all'

const AdvantagesSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)
  const state = useStore(stateAtom)
  const ready = useStore(readyAtom)

  const [filter, setFilter] = createSignal<IFilter>('advantages')

  const filters = {
    advantages: (advantage: string) => info()[advantage].points < 0,
    disadvantages: (advantage: string) => info()[advantage].points > 0,
    all: () => true,
  }

  const text = (advantage: string) => info()[advantage].name + ' (' + info()[advantage].points + ')'

  const updateAdvantages = (advantage: string, action: 'select' | 'remove') => {
    const newAdvantages =
      action === 'select'
        ? [...block().advantages, advantage]
        : block().advantages.filter((x) => x !== advantage)
    const sign = action === 'select' ? 1 : -1
    const newPoints = properties().points + sign * info()[advantage].points

    blockMap.setKey('advantages', newAdvantages)
    propertiesMap.setKey('points', newPoints)
  }

  return (
    <Show when={ready()}>
      <RadioGroup row value={filter()} onChange={(e, value) => setFilter(value as IFilter)}>
        <FormControlLabel
          value="advantages"
          control={<Radio color="success" size="small" />}
          label="Výhody"
        />
        <FormControlLabel
          value="disadvantages"
          control={<Radio color="error" size="small" />}
          label="Nevýhody"
        />
        <FormControlLabel
          value="all"
          control={<Radio color="primary" size="small" />}
          label="Všechny"
        />
      </RadioGroup>
      <div style={{ height: '5px' }} />
      <MultiSelect
        disabled={state() === 'saving'}
        options={() => Object.keys(info()).sort().filter(filters[filter()])}
        values={() => block().advantages.filter(filters[filter()])}
        texts={(advantage) => text(advantage)}
        onSelect={(advantage) => updateAdvantages(advantage, 'select')}
        onRemove={(advantage) => updateAdvantages(advantage, 'remove')}
      />
    </Show>
  )
}

export default AdvantagesSelector
