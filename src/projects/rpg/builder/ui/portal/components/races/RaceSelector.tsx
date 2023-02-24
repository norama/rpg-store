import { propertiesMap, blockMap, infoAtom } from '@builder/business/blocks/races/store'
import SingleSelect from '@input/SingleSelect'
import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'
import readyAtom from '@builder/ui/stores/readyAtom'
import stateAtom from '@builder/ui/stores/stateAtom'
import style from 'styles/style'

const RaceSelector = () => {
  const properties = useStore(propertiesMap)
  const block = useStore(blockMap)
  const info = useStore(infoAtom)
  const state = useStore(stateAtom)
  const ready = useStore(readyAtom)

  const text = (race: string) => info()[race].name + ' (' + info()[race].points + ')'

  const updateRace = (race: string) => {
    const prevRace = block().races[0]
    const newPoints = properties().points - info()[prevRace].points + info()[race].points

    blockMap.setKey('races', [race])
    propertiesMap.setKey('points', newPoints)
  }

  return (
    <Show when={ready()}>
      <SingleSelect
        label="Rasa"
        placeholder="Vyberte rasu"
        disabled={state() === 'saving'}
        options={() => Object.keys(info()).sort()}
        value={() => block().races[0]}
        texts={(race) => (info() ? text(race) : '')}
        onChange={updateRace}
        customSelectStyle={style('races')}
        customOptionStyle={style('races')}
        customOptionsStyle={style('races')}
      />
    </Show>
  )
}

export default RaceSelector
