import { useStore } from '@nanostores/solid'
import { successCountAtom, failureCountAtom, progressAtom } from 'tests/stores/tests'
import sign from 'tests/components/sign'
import './ProgressResultText.css'

const ProgressResultText = () => {
  const progress = useStore(progressAtom)
  const successCount = useStore(successCountAtom)
  const failureCount = useStore(failureCountAtom)

  return (
    <>
      {progress() !== undefined ? (
        <div class="allResult">
          <div>
            <h3 class="successCount">{successCount() ? sign(true) + ' ' + successCount() : ''}</h3>
            <h3 class="failureCount">{failureCount() ? sign(false) + ' ' + failureCount() : ''}</h3>
            <h3 class="processedCount">{successCount() + failureCount()}</h3>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProgressResultText
