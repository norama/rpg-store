import rpgTargetAtom from '@builder/ui/stores/business/rpgTarget'
import { numberValuesMap } from '@builder/ui/stores/blockAtom'
import { useStore } from '@nanostores/solid'

const MoneyDisplay = () => {
  const target = useStore(rpgTargetAtom)
  const numval = useStore(numberValuesMap)
  console.log('numval', numval())

  return <h2>{target() && target().properties.money}</h2>
}

export default MoneyDisplay
