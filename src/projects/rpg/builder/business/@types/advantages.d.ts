type IAdvantage = {
  name: string
  points: number
}

type IInfoAdvantages = Record<string, IAdvantage>

type IBlockAdvantages = {
  advantages: string[]
}
