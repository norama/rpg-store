import PubSub from 'pubsub-js'
import data from 'business/data'
import M from 'constants/messages'

let t = undefined

const tiles: ITestConfig = {
  tests: [
    {
      name: 'lastActiveTileId',
      action: () =>
        new Promise<boolean>((resolve) => {
          t = setInterval(() => {
            clearInterval(t)
            if (data.lastActiveTileId === 'Occupation') {
              resolve(true)
            }
          }, 500)
          PubSub.publish(M.lastActiveTileId, 'Occupation')
        }),
    },
  ],

  before: async () => {
    data.lastActiveTileId = 'Race'
  },
  after: async () => {
    t && clearInterval(t)
    t = undefined
  },
}

export default tiles
