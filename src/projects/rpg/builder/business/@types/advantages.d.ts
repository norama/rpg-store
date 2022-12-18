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
