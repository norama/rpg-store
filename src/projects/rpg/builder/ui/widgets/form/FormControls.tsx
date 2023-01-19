import ResetButton from '@builder/ui/widgets/form/ResetButton'
import SaveButton from '@builder/ui/widgets/form/SaveButton'
import { Stack } from '@suid/material'

const FormControls = () => (
  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
    <SaveButton /> <ResetButton />
  </Stack>
)

export default FormControls
