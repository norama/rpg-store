import rpgTargetAtom from '@builder/ui/stores/business/rpgTarget'
import { useStore } from '@nanostores/solid'

const Dashboard = () => {
  const rpgTarget = useStore(rpgTargetAtom)

  return <div>{JSON.stringify(rpgTarget())}</div>
}

export default Dashboard
