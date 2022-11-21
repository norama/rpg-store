import PubSub from 'pubsub-js'
import { lastActiveTileIdAtom, activeTileIdsAtom } from 'projects/rpg/tiles/stores/tiles'
import M from 'pubsub/messages'

const tilesSuite: ITestSuite = {
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
    const tiles = [
      { id: 'Race', name: 'My Race' },
      { id: 'Occupation', name: 'My Occupation' },
      { id: 'Abilities', name: 'My Abilities' },
      { id: 'Symbols', name: 'My Symbols' },
    ]
    PubSub.publishSync(M.initTiles, tiles)
    PubSub.publishSync(M.lastActiveTileId, 'Race')
  },
  before: async () => {
    PubSub.publishSync(M.lastActiveTileId, 'Race')
  },
}

export default tilesSuite
