import PubSub from 'pubsub-js'
import M from 'pubsub/messages'

import { atom, map } from 'nanostores'

// read-only target, block info
export class ResourceAtom<T> {
  atom = atom<T>()

  constructor(resource: string) {
    PubSub.subscribe(resource, (_msg: string, target: T) => {
      this.atom.set(target)
    })
  }
}

// read-write form data (block input, properties)
export class FormData<D extends Object> {
  data: D

  map = map<D>()

  dirtyKeys = new Set<string>()

  constructor(resource: string) {
    PubSub.subscribe(resource, (_msg: string, data: D) => {
      this.data = data
      this.map.set({ ...data })
      this.dirtyKeys.clear()
      PubSub.publish(M.uiDirty, false)
    })

    this.map.listen((value, changedKey) => {
      const changed = JSON.stringify(this.data[changedKey]) !== JSON.stringify(value[changedKey])
      if (changed) {
        const wasDirty = this.dirtyKeys.size > 0
        this.dirtyKeys.add(changedKey)
        if (!wasDirty) {
          PubSub.publish(M.uiDirty, true)
        }
      } else {
        this.dirtyKeys.delete(changedKey)
        const isDirty = this.dirtyKeys.size > 0
        if (!isDirty) {
          PubSub.publish(M.uiDirty, false)
        }
      }
    })
  }
}
