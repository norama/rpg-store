import { rpgCharacterAtom } from '@dashboard/stores/dashboard'
import { useStore } from '@nanostores/solid'

const Dashboard = () => {
  const rpgCharacter = useStore(rpgCharacterAtom)

  return <div>{JSON.stringify(rpgCharacter())}</div>
}

export default Dashboard
