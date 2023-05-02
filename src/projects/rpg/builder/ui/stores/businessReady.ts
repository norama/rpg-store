import { atom } from 'nanostores'

class BusinessReady {
  atom = atom(false)

  resources = new Set<string>()

  resourceToLoad(resource: string) {
    this.resources.add(resource)
    //console.log('TO LOAD', resource)
    //console.log('this.resources.size', this.resources.size)
  }

  resourceLoaded(resource: string) {
    this.resources.delete(resource)
    //console.log('LOADED', resource)
    //console.log('this.resources.size', this.resources.size)
    if (this.resources.size === 0) {
      this.atom.set(true)
    }
  }
}

export default new BusinessReady()
