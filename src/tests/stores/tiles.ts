import PubSub from 'pubsub-js'
import data from 'business/data'
import { setLastActive, lastActiveTileIdAtom, activeTileIdsAtom } from 'stores/tiles'
import M from 'constants/messages'

const tiles: ITestConfig = {
  tests: [
    {
      name: 'lastActiveTileId',
      action: () =>
        new Promise<boolean>((resolve) => {
          lastActiveTileIdAtom.listen((lastActiveTileId) => {
            if (lastActiveTileId === 'Occupation') {
              resolve(true)
            }
          })
          PubSub.publish(M.lastActiveTileId, 'Occupation')
        }),
    },
    {
      name: 'activeTileIds',
      action: () =>
        new Promise<boolean>((resolve) => {
          activeTileIdsAtom.listen((activeTileIds) => {
            if (activeTileIds.length === 3) {
              resolve(true)
            }
          })
          PubSub.publish(M.lastActiveTileId, 'Abilities')
        }),
    },
  ],
  beforeAll: async () => {
    data.publish()
  },
  before: async () => {
    setLastActive('Race')
  },
  after: async () => {
    lastActiveTileIdAtom.off()
  },
}

export default tiles
