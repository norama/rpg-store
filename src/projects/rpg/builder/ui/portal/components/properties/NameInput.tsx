import { propertiesMap } from '@builder/business/store/properties'
import StringInput from '@input/StringInput'
import { useStore } from '@nanostores/solid'
import stateAtom from '@builder/ui/stores/stateAtom'

const NameInput = () => {
  const properties = useStore(propertiesMap)
  const state = useStore(stateAtom)

  return (
    <StringInput
      label="Jméno"
      value={() => (properties() ? properties().name : '')}
      disabled={state() === 'saving'}
      onChange={(name) => propertiesMap.setKey('name', name)}
      placeholder="Zadejte název postavy"
      customStyle={{ width: '100%' }}
    />
  )
}

export default NameInput
