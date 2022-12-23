type IRace = {
  name: string
  points: number
  strength: number
}

type IInfoRaces = Record<string, IRace>

type IBlockRaces = {
  races: string[]
}
