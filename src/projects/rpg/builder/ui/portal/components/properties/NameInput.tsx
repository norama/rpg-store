import { propertiesMap } from '@builder/business/store/properties'
import StringInput from '@input/StringInput'
import { Show } from 'solid-js'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'
import readyAtom from '@builder/ui/stores/readyAtom'

const NameInput = () => {
  const properties = useStore(propertiesMap)
  const state = useStore(stateAtom)
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      <StringInput
        label="Jméno"
        value={() => properties().name}
        disabled={state() === 'saving'}
        onChange={(name) => propertiesMap.setKey('name', name)}
        placeholder="Zadejte název postavy"
        customStyle={{ width: '100%' }}
      />
    </Show>
  )
}

export default NameInput
