import businessReady from '@builder/ui/stores/businessReady'
import { computed } from 'nanostores'
import themeHolder from 'styles/theme'

const readyAtom = computed([businessReady.atom, themeHolder.atom], (ready, theme) => ready && theme)

export default readyAtom
