import { createSignal } from 'solid-js'

export const ALL = '__ALL__'

const [disabled, setDisabled] = createSignal(false)

const state = { disabled, setDisabled }

export default state
