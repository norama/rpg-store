import PubSub from 'pubsub-js'
import data from 'projects/rpg/tiles/business/data'
import M from 'pubsub/messages'

const dataSuite: ITestSuite = {
  tests: [
    {
      name: 'lastActiveTileId',
      description: 'Last active tile ID',
      run: async () => {
        PubSub.publish(M.lastActiveTileId, 'Occupation')
      },
      expect: () => data.rpgTiles.lastActiveTileId === 'Occupation',
    },
  ],
  beforeAll: async () => {
    await data.init()
  },
  before: async () => {
    data.rpgTiles = { lastActiveTileId: 'Race' }
  },
}

export default dataSuite
