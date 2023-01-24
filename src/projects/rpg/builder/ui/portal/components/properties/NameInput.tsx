import { propertiesMap } from '@builder/business/store/properties'
import stateAtom from '@builder/ui/stores/stateAtom'
import StringInput from '@input/StringInput'
import { useStore } from '@nanostores/solid'

const NameInput = () => {
  const properties = useStore(propertiesMap)
  const state = useStore(stateAtom)

  return (
    <StringInput
      label="Jméno"
      value={() => properties().name}
      disabled={state() === 'saving'}
      onChange={(name) => propertiesMap.setKey('name', name)}
      inputProps={{ placeholder: 'Enter character name' }}
      customStyle={{ width: '100%' }}
    />
  )
}

export default NameInput
