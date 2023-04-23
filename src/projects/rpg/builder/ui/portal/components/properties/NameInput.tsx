import { propertiesMap } from '@builder/business/store/properties'
import StringInput from '@input/StringInput'
import { useStore } from '@nanostores/solid'
import readyAtom from '@builder/ui/stores/readyAtom'
import stateAtom from '@builder/ui/stores/stateAtom'

const NameInput = () => {
  const properties = useStore(propertiesMap)
  const state = useStore(stateAtom)
  const ready = useStore(readyAtom)

  return (
    <StringInput
      label="Jméno"
      value={() => properties().name}
      disabled={state() === 'saving'}
      onChange={(name) => propertiesMap.setKey('name', name)}
      placeholder="Zadejte název postavy"
      customStyle={{ width: '100%' }}
    />
  )
}

export default NameInput
