import PubSub from 'pubsub-js'

import { atom, map } from 'nanostores'

// read-only target, block info
export class ResourceAtom<T> {
  atom = atom<T>()

  constructor(resource: string) {
    PubSub.subscribe(resource, (_msg: string, target: T) => {
      console.log('--> Target', target)
      this.atom.set(target)
    })
  }
}

// read-write form data (block input, properties)
export class FormData<D extends Object> {
  map = map<D>()

  constructor(resource: string) {
    PubSub.subscribe(resource, (_msg: string, data: D) => {
      console.log('--> Data', data)
      this.map.set(data)
    })
  }
}
