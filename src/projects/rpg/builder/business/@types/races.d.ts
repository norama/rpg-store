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
