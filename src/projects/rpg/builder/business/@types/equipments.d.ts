type IEquipment = {
  name: string
  price: number
  weight: number
}

type IInfoEquipments = Record<string, IEquipment>

type IBlockEquipments = {
  equipments: string[]
}
