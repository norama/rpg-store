import PubSub from 'pubsub-js'
import data from 'projects/rpg/tiles/business/data'
import M from 'pubsub/messages'

const tiles: ITestConfig = {
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

export default tiles
