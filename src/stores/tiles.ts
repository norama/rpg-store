import PubSub from 'pubsub-js'
import M from 'constants/messages'
import { atom, map, computed } from 'nanostores'
import data from 'business/data'

export const tileIdsAtom = atom<string[]>([])

export const tilesMap = map<Record<string, Tile>>()

export const lastActiveTileIdAtom = atom<string>('Race')

export const activeTileIdsAtom = computed(
  [tileIdsAtom, lastActiveTileIdAtom],
  (tileIds, lastActiveTileId) => tileIds.slice(0, tileIds.indexOf(lastActiveTileId) + 1)
)

export const setLastActive = (id: string) => lastActiveTileIdAtom.set(id)

PubSub.subscribeOnce(M.initTiles, (_msg: string, { tiles, lastActiveTileId }) => {
  tiles.forEach((tile) => {
    tilesMap.setKey(tile.id, tile)
  })
  tileIdsAtom.set(tiles.map((tile) => tile.id))
  lastActiveTileIdAtom.set(lastActiveTileId)
})

data.publish()
