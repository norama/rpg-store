export const TOPIC = 'rpg'
export const API = 'api'
export const REQUEST = 'request'
export const RESPONSE = 'response'
export const SELECT = 'select'
export const UPDATE = 'update'

const msg = (m: string) => TOPIC + '.' + m
const api = (m: string) => TOPIC + '.' + API + '.' + m

export const msgRequest = (t: string) => `${TOPIC}.${API}.${REQUEST}.${t}`
export const msgResponse = (t: string) => `${TOPIC}.${API}.${RESPONSE}.${t}`
export const apiSelect = (t: string) => `${SELECT}.${t}`
export const apiUpdate = (t: string) => `${UPDATE}.${t}`

export const T = {
  tiles: 'tiles',
  rpgInfo: 'rogInfo',
  rpgBlock: 'rpgBlock',
  rpgProperties: 'rpgProperties',
  rpgTarget: 'rpgTarget',
  rpgTiles: 'rpgTiles',
}

const M = {
  tileIds: msg('tileIds'),
  lastActiveTileId: msg('lastActiveTileId'),
  initTiles: msg('initTiles'),
  rpgTarget: msg('rpgTarget'),
  rpgBlock: msg('rpgBlock'),
  rpgInfo: msg('rpgInfo'),
  uiString: msg('uiString'),
  uiNumber: msg('uiNumber'),
  uiStringArray: msg('uiStringArray'),
  uiNumberArray: msg('uiNumberArray'),
  rpgReset: msg('rpgReset'),
  rpgSave: msg('rpgSave'),
  rpgFormSave: msg('rpgFormSave'),
  rpgFormReset: msg('rpgFormReset'),
  rpgFormBlock: msg('rpgFormBlock'),
}

export default M
