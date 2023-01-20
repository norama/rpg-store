type IValue = string | number | string[] | number[]

type IRpgBlock = {
  type: IBlockType
  data: Record<string, IValue>
  properties?: Record<string, IValue>
}

interface IBlockPage {
  init: () => Promise<void>
  publish: () => void
}

type IState = 'idle' | 'dirty' | 'saving'
