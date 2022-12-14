import { propertiesMap } from '@builder/business/store/properties'
import StringInput from '@builder/ui/widgets/StringInput'
import { useStore } from '@nanostores/solid'

const NameInput = () => {
  const properties = useStore(propertiesMap)

  return (
    <StringInput
      label="Name"
      value={() => properties().name}
      onChange={(name) => propertiesMap.setKey('name', name)}
      inputProps={{ placeholder: 'Enter character name' }}
      customStyle={{ width: '600px' }}
    />
  )
}

export default NameInput
