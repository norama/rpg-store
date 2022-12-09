import rpgTargetAtom from '@builder/ui/stores/business/rpgTarget'
import NumberInput, { NumberInputFuncArgs } from '@builder/ui/widgets/NumberInput'
import { useStore } from '@nanostores/solid'

export type Props = {
  mode?: IMode
  name: string
  min?: (args: NumberInputFuncArgs<IRpgCharacter>) => number
  max?: (args: NumberInputFuncArgs<IRpgCharacter>) => number
}

const RpgNumberInput = ({ mode, name, min, max }: Props) => {
  const target = useStore(rpgTargetAtom)

  return (
    <>
      {target() && (
        <NumberInput<IRpgCharacter> mode={mode} name={name} min={min} max={max} target={target} />
      )}
    </>
  )
}

export default RpgNumberInput
