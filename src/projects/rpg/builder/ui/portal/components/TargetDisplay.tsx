import { targetAtom } from '@builder/business/store/target'
import { useStore } from '@nanostores/solid'

const TargetDisplay = () => {
  const target = useStore(targetAtom)

  return <div>{JSON.stringify(target())}</div>
}

export default TargetDisplay
