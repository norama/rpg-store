import PubSub from 'pubsub-js'
import data from 'projects/rpg/tiles/business/data'
import {
  setLastActive,
  lastActiveTileIdAtom,
  activeTileIdsAtom,
} from 'projects/rpg/tiles/stores/tiles'
import M from 'pubsub/messages'

const tiles: ITestConfig = {
  tests: [
    {
      name: 'lastActiveTileId',
      description: 'Last active tile ID',
      run: async () => {
        PubSub.publish(M.lastActiveTileId, 'Occupation')
      },
      expect: () => lastActiveTileIdAtom.get() === 'Occupation',
    },
    {
      name: 'activeTileIds',
      description:
        'Active tile IDs sdfsd f sdf sd fsd fsd f sd fsd f sd fsd fsd fsd fsd f sdf sd fsd f sd fsd fsd fsd f dfgd aaaaaaaaaaa bbbbbbbbbbbbb cccccccccc ddddddd ww eeeeeeeeeeeeeee ffffffffffffffff',
      run: async () => {
        PubSub.publish(M.lastActiveTileId, 'Abilities')
      },
      expect: () => activeTileIdsAtom.get().length === 3,
    },
  ],
  beforeAll: async () => {
    PubSub.publishSync(M.initTiles, data.tiles)
  },
  before: async () => {
    setLastActive('Race')
  },
}

export default tiles