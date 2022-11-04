import PubSub from 'pubsub-js'
import M from 'constants/messages'
import { atom, map, computed } from 'nanostores'

export const tileIdsAtom = atom<string[]>([])

export const tilesMap = map<Record<string, Tile>>()

export const lastActiveTileIdAtom = atom<string>()

export const activeTileIdsAtom = computed(
  [tileIdsAtom, lastActiveTileIdAtom],
  (tileIds, lastActiveTileId) => tileIds.slice(0, tileIds.indexOf(lastActiveTileId) + 1)
)

export const setLastActive = (id: string) => lastActiveTileIdAtom.set(id)

PubSub.subscribeOnce(M.initTiles, (_msg: string, tiles: Tile[]) => {
  tiles.forEach((tile) => {
    tilesMap.setKey(tile.id, tile)
  })
  tileIdsAtom.set(tiles.map((tile) => tile.id))
  setLastActive(tiles[0].id)

  lastActiveTileIdAtom.listen((lastActiveTileId) => {
    PubSub.publish(M.lastActiveTileId, lastActiveTileId)
  })
})

PubSub.subscribe(M.lastActiveTileId, (_msg: string, lastActiveTileId: string) => {
  if (lastActiveTileIdAtom.get() !== lastActiveTileId) {
    lastActiveTileIdAtom.set(lastActiveTileId)
  }
})
