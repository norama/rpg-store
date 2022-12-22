import { propertiesMap } from '@builder/business/store/properties'
import StringInput from '@builder/ui/widgets/StringInput'
import { useStore } from '@nanostores/solid'

const NameInput = () => {
  const properties = useStore(propertiesMap)

  return (
    <>
      {properties().name}
      <StringInput
        name="name"
        value={() => properties().name}
        onChange={(name) => propertiesMap.setKey('name', name)}
      />
    </>
  )
}

export default NameInput
