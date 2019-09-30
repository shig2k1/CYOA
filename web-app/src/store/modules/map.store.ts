import { createModule, mutation, action, getter } from 'vuex-class-component'

import mapApi from '@/api/map'

import Map from '@/classes/map'

import { Dictionary, MapTile, Vector } from '../../types'
import { MAP_CHUNK_SIZE } from '../../config'

const VuexModule = createModule({
  namespaced: true,
  strict: false,
  target: 'nuxt',
})

export interface IAddTile {
  chunkOffset: Vector
  coords: Vector
  tile:MapTile
}

const map = new Map()

export default class MapStore extends VuexModule {
  public selectedCoord: Vector = [0, 0]
  public offset: Vector = [0, 0]

  public mapStr: string = ''
  @getter public mapData: Dictionary<MapTile[][]> = {}
  public name = 'test'

  // initial load
  @mutation public selectTile(coord:Vector) {
    this.selectedCoord = coord
  }

  @action public async loadFromLocalStore() {
    this.mapData = await mapApi.get('mapData') || {}
  }

  @action public async changeName(name: string) {
    return await this.updateName(name)
  }

  @action public async setOffset(offset: Vector) {
    // save the data
    mapApi.set('offset', offset)
    this.offset = offset
  }

  @action public async addTile(payload: IAddTile) {
    let { chunkOffset, coords, tile } = payload
    // is there a chunk?
    let key = `${chunkOffset[0]}:${chunkOffset[1]}`
    let chunk = this.mapData[key]
    if (!chunk) chunk = map.createEmptyChunk(MAP_CHUNK_SIZE, MAP_CHUNK_SIZE)
    // update the chunk data
    chunk[coords[0]][coords[1]] = {
      ...chunk[coords[0]][coords[1]],
      ...tile
    }
    
    // update the map
    this.mapData  = {
      ...this.mapData,
      [key]: chunk
    }
    // save the data
    mapApi.set('mapData', this.mapData)
  }

  @mutation private updateName(name: string) {
    this.name = name
  }
}
