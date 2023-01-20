import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/races/store'
import MultiSelect from '@input/MultiSelect'
import { useStore } from '@nanostores/solid'

const RaceSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)

  const text = (race: string) => info()[race].name + ' (' + info()[race].points + ')'

  const points = (races: string[]) => races.reduce((sum, race) => sum + info()[race].points, 0)

  const updateRaces = (races: string[]) => {
    const newPoints = properties().points - points(block().races) + points(races)

    blockMap.setKey('races', races)
    propertiesMap.setKey('points', newPoints)
  }

  const disabled = (race: string) =>
    !block().races.includes(race) && properties().points + info()[race].points < 0

  return (
    <MultiSelect
      name="races"
      options={() => Object.keys(info()).sort()}
      values={() => block().races}
      texts={(race) => (info() ? text(race) : '')}
      disabled={disabled}
      onChange={updateRaces}
    />
  )
}

export default RaceSelector
