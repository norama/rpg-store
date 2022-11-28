import { JSX } from 'solid-js'
import { useStore } from '@nanostores/solid'
import { activeTileIdsAtom, setLastActive, tilesMap } from 'projects/rpg/tiles/stores/tiles'
import styles from './Tile.module.css'

type Props = { id: string; children?: JSX.Element }

const Tile = ({ id, children }: Props) => {
  const tiles = useStore(tilesMap)
  const activeTileIds = useStore(activeTileIdsAtom)

  return (
    <div
      data-testid={id}
      class={tileClasses(id, activeTileIds())}
      onClick={() => setLastActive(id)}
    >
      <div class={styles.content}>
        <h2>{tiles()[id] ? tiles()[id].name : ''}</h2>
        <div>
          Within SOLID on{' '}
          <span class={import.meta.env.SSR ? styles.server : styles.client}>
            {import.meta.env.SSR ? 'SERVER' : 'CLIENT'}
          </span>
        </div>
        <hr />
        <div>{children}</div>
      </div>
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
