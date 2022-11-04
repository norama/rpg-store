import PubSub from 'pubsub-js'
import M from 'constants/messages'

PubSub.subscribeOnce(M.initTiles, () => {
  const lastActiveTileId = localStorage.getItem('lastActiveTileId')
  if (lastActiveTileId) {
    PubSub.publish(M.lastActiveTileId, lastActiveTileId)
  }
})

PubSub.subscribe(M.lastActiveTileId, (_msg: string, lastActiveTileId: string) => {
  localStorage.setItem('lastActiveTileId', lastActiveTileId)
})
