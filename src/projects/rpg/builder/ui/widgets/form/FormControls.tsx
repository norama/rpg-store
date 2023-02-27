import ResetButton from '@builder/ui/widgets/form/ResetButton'
import SaveButton from '@builder/ui/widgets/form/SaveButton'
import { Stack } from '@suid/material'
import { Toaster } from 'solid-toast'
import { Show } from 'solid-js'
import { useStore } from '@nanostores/solid'
import readyAtom from '@builder/ui/stores/readyAtom'

const FormControls = () => {
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
        <SaveButton /> <ResetButton />
      </Stack>
      <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
    </Show>
  )
}

export default FormControls
