import { useStore } from '@nanostores/solid'
import { activeTileIdsAtom, setLastActive, tilesMap } from 'stores/tiles'
import styles from './Tile.module.css'

type Props = { id: string }

const Tile = ({ id }: Props) => {
  const tiles = useStore(tilesMap)
  const activeTileIds = useStore(activeTileIdsAtom)

  return (
    <div
      data-testid={id}
      class={tileClasses(id, activeTileIds())}
      onClick={() => setLastActive(id)}
    >
      <h2>{tiles()[id] ? tiles()[id].name : ''}</h2>
    </div>
  )
}

const tileClasses = (id, ids) => {
  const classes = [styles.tile]
  if (ids.includes(id)) {
    classes.push('active')
    if (ids.indexOf(id) === ids.length - 1) {
      classes.push('lastActive')
    }
  }
  return classes.join(' ')
}

export default Tile
