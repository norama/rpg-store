type ITest = {
  name: string
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
  action: () => Promise<boolean>
}
