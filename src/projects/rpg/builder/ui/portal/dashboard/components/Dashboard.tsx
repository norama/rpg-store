import targetAtom from '@stores/target'
import { useStore } from '@nanostores/solid'

const Dashboard = () => {
  const rpgTarget = useStore(targetAtom)

  return <div>{JSON.stringify(rpgTarget())}</div>
}

export default Dashboard
