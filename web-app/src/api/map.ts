
import localForage from 'localforage'

class Map {
  store:any
  
  // data saved into localforage data file
  async get (key:string) {
    return this.store.getItem(key)
  }
  async set (key:string, value:any) {
    this.store.setItem(key, value)
  }

  constructor () {
    this.store = localForage.createInstance({
      name: 'CYOA'
    })
  }
}

const map = new Map()
export default map
