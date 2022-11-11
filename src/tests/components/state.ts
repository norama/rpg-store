import { createSignal } from 'solid-js'

const [disabled, setDisabled] = createSignal(false)

const state = { disabled, setDisabled }

export default state
