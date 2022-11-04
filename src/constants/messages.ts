export const TOPIC = 'tiles'

const msg = (m: string) => TOPIC + '.' + m

const M = {
  tileIds: msg('tileIds'),
  lastActiveTileId: msg('lastActiveTileId'),
  initTiles: msg('initTiles'),
}

export default M
