import ResetButton from '@builder/ui/widgets/form/ResetButton'
import SaveButton from '@builder/ui/widgets/form/SaveButton'
import { Stack } from '@suid/material'
import { Toaster } from 'solid-toast'

const FormControls = () => (
  <>
    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
      <SaveButton /> <ResetButton />
    </Stack>
    <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
  </>
)

export default FormControls
