import MultiSelect from '@builder/ui/widgets/MultiSelect'
import { useStore } from '@nanostores/solid'
import rpgInfoAtom from '@builder/ui/stores/business/rpgInfo'

export type Props = {
  mode?: IMode
  name: string
}

const RpgMultiSelect = ({ name }) => {
  const info = useStore(rpgInfoAtom)
  return <>{info() && <MultiSelect name={name} options={Object.keys(info())} />}</>
}

export default RpgMultiSelect
