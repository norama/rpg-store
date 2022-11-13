type ITest = {
  name: string
  description: string
  run: () => Promise<void>
  expect: () => boolean
}

type ITestConfig = {
  tests: ITest[]
  beforeAll?: () => Promise<void>
  afterAll?: () => Promise<void>
  before?: () => Promise<void>
  after?: () => Promise<void>
}

type ITestCase = {
  name: string
  description: string
  action: () => Promise<boolean>
}
