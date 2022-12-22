import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/races/store'
import MultiSelect from '@builder/ui/widgets/MultiSelect'
import { useStore } from '@nanostores/solid'
import { computed } from 'nanostores'
import { createEffect } from 'solid-js'

const RaceSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)

  return (
    <MultiSelect
      name="races"
      options={() => Object.keys(info()).sort()}
      values={() => block().races}
      texts={(option) => (info() ? info()[option].name : '')}
      onChange={(races) => blockMap.setKey('races', races)}
    />
  )
}

export default RaceSelector
