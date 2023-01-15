import RacesDisplay from '@components/races/RacesDisplay'
import EquipmentsDisplay from '@components/equipments/EquipmentsDisplay'
import AdvantagesDisplay from '@components/advantages/AdvantagesDisplay'

type Props = {
  type: string
}

const BlockDisplay = ({ type }: Props) => {
  switch (type) {
    case 'races':
      return <RacesDisplay />
    case 'equipments':
      return <EquipmentsDisplay />
    case 'advantages':
      return <AdvantagesDisplay />
    default:
      return null
  }
}

export default BlockDisplay
