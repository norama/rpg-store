export const TOPIC = 'rpg'
export const API = 'api'
export const REQUEST = 'request'
export const RESPONSE = 'response'

const msg = (m: string) => TOPIC + '.' + m
const api = (m: string) => TOPIC + '.' + API + '.' + m

export const apiRequest = (t: string) => TOPIC + '.' + API + '.request.' + t
export const apiResponse = (t: string) => TOPIC + '.' + API + '.response.' + t

export const T = {
  tiles: 'tiles',
  rpgCharacter: 'rpgCharacter',
  rpgTiles: 'rpgTiles',
  storeRpgCharacter: 'storeRpgCharacter',
}

const M = {
  tileIds: msg('tileIds'),
  lastActiveTileId: msg('lastActiveTileId'),
  initTiles: msg('initTiles'),
  rpgCharacter: msg('rpgCharacter'),
  rpgStoreString: msg('rpgStoreString'),
  rpgStoreNumber: msg('rpgStoreNumber'),
  rpgResetProperties: msg('rpgResetProperties'),
  rpgSaveProperties: msg('rpgSaveProperties'),
  rpgFormSave: msg('rpgFormSave'),
  rpgFormReset: msg('rpgFormReset'),
}

export default M
