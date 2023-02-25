type IRace = {
  name: string
  points: number
  strength: number
  wiki: string
  agility: number
  skill: number
  physicalEndurance: number
  mentalEndurance: number
  IQ: number
  wisdom: number
  conduct: number
  beauty: number
  HP: number
  lifeExpectancy: number
}

type IInfoRaces = Record<string, IRace>

type IBlockRaces = {
  races: string[]
}
