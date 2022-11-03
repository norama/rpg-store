import { atom, map, computed } from 'nanostores'

export const tileIdsAtom = atom<string[]>(['Race', 'Occupation', 'Abilities', 'Symbols'])

type Tile = {
  id: string
  name: string
}

export const tilesMap = map<Record<string, Tile>>({
  Race: { id: 'Race', name: 'My Race' },
  Occupation: { id: 'Occupation', name: 'My Occupation' },
  Abilities: { id: 'Abilities', name: 'My Abilities' },
  Symbols: { id: 'Symbols', name: 'My Symbols' },
})

export const lastActiveTileIdAtom = atom<string>('Race')

export const activeTileIdsAtom = computed(
  [tileIdsAtom, lastActiveTileIdAtom],
  (tileIds, lastActiveTileId) => tileIds.slice(0, tileIds.indexOf(lastActiveTileId) + 1)
)

export const setLastActive = (id: string) => lastActiveTileIdAtom.set(id)
