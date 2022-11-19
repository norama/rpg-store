import { useStore } from '@nanostores/solid'
import { progressAtom, testCountAtom } from 'tests/stores/tests'

const ProgressBar = () => {
  const progress = useStore(progressAtom)
  const all = useStore(testCountAtom)

  return <>{progress() !== undefined ? <progress max={all()} value={progress()} /> : null}</>
}

export default ProgressBar
