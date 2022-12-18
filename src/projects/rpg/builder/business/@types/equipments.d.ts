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
