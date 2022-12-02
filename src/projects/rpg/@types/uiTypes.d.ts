type IDataItem = {
  key: string
}

type IDataString = IDataItem & {
  value: string
}

type IDataStringArray = IDataItem & {
  value: string[]
}

type IDataNumber = IDataItem & {
  value: number
}

type IDataNumberArray = IDataItem & {
  value: number[]
}
