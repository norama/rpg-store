import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/advantages/store'
import MultiSelect from '@builder/ui/widgets/form/input/MultiSelect'
import { useStore } from '@nanostores/solid'
import { Show, createSignal, createEffect } from 'solid-js'
import readyAtom from '@builder/ui/stores/readyAtom'
import stateAtom from '@builder/ui/stores/stateAtom'
import Tabs from '@builder/ui/widgets/form/Tabs'
import { rowFilter } from '@builder/widgets/table/infoTableFilters'
import { Box } from '@suid/material'

type IFilter = 'advantages' | 'disadvantages' | 'all'

const AdvantagesSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)
  const state = useStore(stateAtom)
  const ready = useStore(readyAtom)

  const [filter, setFilter] = createSignal<IFilter>('all')

  const filters = {
    advantages: (advantage: string) => info()[advantage].points < 0,
    disadvantages: (advantage: string) => info()[advantage].points > 0,
    all: () => true,
  }

  createEffect(() => {
    if (!ready()) {
      return
    }
    rowFilter(filters[filter()])
  })

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
      <Tabs
        tabs={[
          { value: 'advantages', color: 'green', label: 'Výhody' },
          { value: 'disadvantages', color: 'red', label: 'Nevýhody' },
          { value: 'all', color: '#0096fb', label: 'Všechny' },
        ]}
        value={filter}
        onChange={(value) => setFilter(value as IFilter)}
      />
      <Box marginBottom="2rem" height="100%" sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <MultiSelect
          disabled={state() === 'saving'}
          options={() => Object.keys(info()).sort().filter(filters[filter()])}
          values={() => block().advantages.filter(filters[filter()])}
          texts={(advantage) => text(advantage)}
          onSelect={(advantage) => updateAdvantages(advantage, 'select')}
          onRemove={(advantage) => updateAdvantages(advantage, 'remove')}
        />
      </Box>
    </Show>
  )
}

export default AdvantagesSelector
