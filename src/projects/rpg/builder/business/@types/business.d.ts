type IRpgTiles = {
  lastActiveTileId: string
}

type IBlockType = 'races' | 'advantages' | 'equipments'

type IProperties = {
  name: string
  money: number
  points: number
}

type IRace = {
  name: string
  points: number
  strength: number
}

type IInfoRaces = {
  races: Record<string, IRace>
}

type IBlockRaces = {
  races: string[]
}

type IAdvantage = {
  name: string
  points: number
}

type IInfoAdvantages = {
  advantages: Record<string, IAdvantage>
}

type IBlockAdvantages = {
  advantages: string[]
}

type IEquipment = {
  name: string
  price: number
  weight: number
}

type IInfoEquipments = {
  equipments: Record<string, IEquipment>
}

type IBlockEquipments = {
  equipments: string[]
}

type IRpgCharacter = {
  id: number
  properties: IProperties
  races: IBlockRaces
  advantages: IBlockAdvantages
  equipments: IBlockEquipments
}
