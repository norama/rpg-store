import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/races/store'
import SingleSelect from '@input/SingleSelect'
import { useStore } from '@nanostores/solid'

const RaceSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)

  const text = (race: string) => info()[race].name + ' (' + -info()[race].points + ')'

  const updateRace = (race: string) => {
    const newPoints = properties().points + info()[block().races[0]].points - info()[race].points

    blockMap.setKey('races', [race])
    propertiesMap.setKey('points', newPoints)
  }

  return (
    <SingleSelect
      name="Rasa"
      options={() => Object.keys(info()).sort()}
      values={() => block().races}
      texts={(race) => (info() ? text(race) : '')}
      onChange={updateRace}
    />
  )
}

export default RaceSelector
