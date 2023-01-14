import { propertiesMap } from '@builder/business/store/properties'
import StringInput from '@builder/ui/widgets/StringInput'
import { useStore } from '@nanostores/solid'

const NameInput = () => {
  const properties = useStore(propertiesMap)

  return (
    <StringInput
      label="Název"
      value={() => properties().name}
      onChange={(name) => propertiesMap.setKey('name', name)}
      inputProps={{ placeholder: 'Enter character name' }}
      customStyle={{ width: 'calc(100% - 30px)' }}
    />
  )
}

export default NameInput
