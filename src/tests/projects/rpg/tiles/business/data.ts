import PubSub from 'pubsub-js'
import data from 'projects/rpg/tiles/business/data'
import M from 'pubsub/messages'

const dataSuite: ITestSuite = {
  tests: [
    {
      name: 'lastActiveTileId',
      description: 'Last acrive tile ID',
      run: async () => {
        PubSub.publish(M.lastActiveTileId, 'Occupation')
      },
      expect: () => data.lastActiveTileId === 'Occupation',
    },
  ],

  before: async () => {
    data.lastActiveTileId = 'Race'
  },
}

export default dataSuite
