type IRpgTiles = {
  lastActiveTileId: string
}

type IBlockType = 'races' | 'advantages' | 'equipments'

type IProperties = {
  name: string
  money: number
  points: number
}

type IRpgCharacter = {
  id: number
  properties: IProperties
  races: IBlockRaces
  advantages: IBlockAdvantages
  equipments: IBlockEquipments
}
