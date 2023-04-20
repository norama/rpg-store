import { propertiesMap } from '@builder/business/store/properties'
import { useStore } from '@nanostores/solid'
import readyAtom from '@builder/ui/stores/readyAtom'
import themeHolder from 'styles/theme'
import { Button } from '@kobalte/core'
import { ITheme } from 'styles/theme'
import './RPGCharacterSupabase.css'

type Props = {
  rpgCharacter: IRpgCharacter
}

const RPGCharacter = ({ rpgCharacter }: Props) => {
  const properties = useStore(propertiesMap)
  const ready = useStore(readyAtom)
  const theme = useStore(themeHolder.atom)

  return (
    <div class="RPGCharacter">
      <h2 class={theme()}>{ready() ? properties().points : rpgCharacter.properties.points}</h2>
      <Button.Root
        disabled={!ready()}
        onClick={() => propertiesMap.setKey('points', properties().points + 1)}
        class={theme()}
      >
        INC
      </Button.Root>
    </div>
  )
}

export default RPGCharacter
