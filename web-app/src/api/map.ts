
import localForage from 'localforage'
import { Dictionary, Vector, MapTile } from '@/types';

class Map {
  private store: any

  constructor() {
    this.store = localForage.createInstance({
      name: 'CYOA',
    })
  }

  public async loadMapChunks(chunks: string[]) {
    if (!chunks) return
    let mapData = await this.get('mapData')
    // traverse the required chunks - for each, load the map data if it exists
    return chunks.reduce((prev:Dictionary<MapTile[][]>, key:string) => {
      if (mapData[key]) prev = {
        ...prev,
        [key]: mapData[key]
      }
      return prev
    }, {})
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
