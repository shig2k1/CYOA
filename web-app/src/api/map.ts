
import localForage from 'localforage'

class Map {
  private store: any

  constructor() {
    this.store = localForage.createInstance({
      name: 'CYOA',
    })
  }

  // data saved into localforage data file
  public async get(key: string) {
    return this.store.getItem(key)
  }
  public async set(key: string, value: any) {
    this.store.setItem(key, value)
  }
}

const map = new Map()
export default map
