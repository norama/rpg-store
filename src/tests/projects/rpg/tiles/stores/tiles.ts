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
      run: async () => {
        PubSub.publish(M.lastActiveTileId, 'Occupation')
      },
      expect: () => lastActiveTileIdAtom.get() === 'Occupation',
    },
    {
      name: 'activeTileIds',
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
