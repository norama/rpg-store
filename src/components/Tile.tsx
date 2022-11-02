import fetchCount from 'api/client/fetchCount'
import { createEffect, createSignal } from 'solid-js'
import styles from './Tile.module.css'

const Tile = () => {
  const [count, setCount] = createSignal<number>()
  const generateCount = async () => {
    setCount(await fetchCount())
  }
  createEffect(generateCount)
  return (
    <div class={styles.tile} onClick={() => generateCount()}>
      <h2>{count()}</h2>
    </div>
  )
}

export default Tile
