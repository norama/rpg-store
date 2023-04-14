type IAdvantage = {
  name: string
  points: number
  multiple: boolean
  advantage: string
  type: string
  typeId: string
  advantageId: string
  money: number
  HP: number
  minPoints: number
  maxPoints: number
}

type IInfoAdvantages = Record<string, IAdvantage>

type IBlockAdvantages = {
  advantages: string[]
}
