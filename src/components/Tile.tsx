import { useStore } from '@nanostores/solid'
import { activeTileIdsAtom, setLastActive, tilesMap } from 'stores/tiles'
import styles from './Tile.module.css'

type Props = { id: string }

const Tile = ({ id }: Props) => {
  const tile = useStore(tilesMap)
  const activeTileIds = useStore(activeTileIdsAtom)

  return (
    <div class={tileClasses(id, activeTileIds())} onClick={() => setLastActive(id)}>
      <h2>{tile()[id].name}</h2>
    </div>
  )
}

const tileClasses = (id, ids) => {
  const classes = [styles.tile]
  if (ids.includes(id)) {
    classes.push(styles.active)
    if (ids.indexOf(id) === ids.length - 1) {
      classes.push(styles.lastActive)
    }
  }
  return classes.join(' ')
}

export default Tile
