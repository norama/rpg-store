import ResetButton from '@builder/ui/widgets/form/ResetButton'
import SaveButton from '@builder/ui/widgets/form/SaveButton'
import { Toaster } from 'solid-toast'
import { Show } from 'solid-js'
import { useStore } from '@nanostores/solid'
import readyAtom from '@builder/ui/stores/readyAtom'
import styles from './FormControls.module.scss'

const FormControls = () => {
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      <div class={styles.controls}>
        <SaveButton /> <ResetButton />
      </div>
      <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
    </Show>
  )
}

export default FormControls
