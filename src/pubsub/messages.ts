export const TOPIC = 'rpg'
export const API = 'api'
export const REQUEST = 'request'
export const RESPONSE = 'response'
export const SELECT = 'select'
export const UPDATE = 'update'

const msg = (m: string) => TOPIC + '.' + m
export const blockInfo = (type: string) => M.uiBlockInfo + '.' + type

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
  uiTheme: 'uiTheme',
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
  uiBlockData: msg('uiBlockData'),
  uiBlockInfo: msg('uiBlockInfo'),
  uiTarget: msg('uiTarget'),
  uiProperties: msg('uiProperties'),
  uiReset: msg('uiReset'),
  uiSave: msg('uiSave'),
  uiSaveAction: msg('uiSaveAction'),
  uiSaveError: msg('uiSaveError'),
  uiDirty: msg('uiDirty'),
  uiBlockType: msg('uiBlockType'),
  uiTheme: msg('uiTheme'),
  uiThemeChanged: msg('uiThemeChanged'),
  uiThemeStored: msg('uiThemeStored'),
}

export default M
