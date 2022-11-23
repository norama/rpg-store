export const TOPIC = 'tiles'
export const API = 'api'
export const REQUEST = 'request'
export const RESPONSE = 'response'

const msg = (m: string) => TOPIC + '.' + m
const api = (m: string) => TOPIC + '.' + API + '.' + m

export const apiRequest = (t: string) => TOPIC + '.' + API + '.request.' + t
export const apiResponse = (t: string) => TOPIC + '.' + API + '.response.' + t

export const T = {
  tiles: 'tiles',
}

const M = {
  tileIds: msg('tileIds'),
  lastActiveTileId: msg('lastActiveTileId'),
  initTiles: msg('initTiles'),
}

export default M
