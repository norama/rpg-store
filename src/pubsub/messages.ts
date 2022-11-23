export const TOPIC = 'tiles'
export const API = 'api'

const msg = (m: string) => TOPIC + '.' + m
const api = (m: string) => TOPIC + '.' + API + '.' + m

const M = {
  tileIds: msg('tileIds'),
  lastActiveTileId: msg('lastActiveTileId'),
  initTiles: msg('initTiles'),
  apiGetTiles: api('getTiles'),
  apiTiles: api('tiles'),
}

export default M
