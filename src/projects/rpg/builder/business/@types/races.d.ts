type IRace = {
  name: string
  points: number
  strength: number
  wiki: string
}

type IInfoRaces = Record<string, IRace>

type IBlockRaces = {
  races: string[]
}
