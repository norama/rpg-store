type ITest = {
  name: string
  action: () => Promise<boolean>
}

type ITestConfig = {
  tests: ITest[]
  beforeAll?: () => Promise<void>
  afterAll?: () => Promise<void>
  before?: () => Promise<void>
  after?: () => Promise<void>
}
