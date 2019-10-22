import { createModule, mutation, action, getter } from 'vuex-class-component'

import mapApi from '@/api/map'

import Map from '@/classes/map'

import { Dictionary, MapTile, Vector } from '../../types'
import { MAP_CHUNK_SIZE } from '../../config'

import { getMaxMinGridRange, getChunksForRange } from '../../utils/map.helper'

const VuexModule = createModule({
  namespaced: true,
  strict: false,
  target: 'nuxt',
})

export interface IAddTile {
  chunkOffset: Vector
  coords: Vector
  tile: MapTile
}

const map = new Map()

export default class MapStore extends VuexModule {
  public selectedCoord: Vector = [0, 0]
  @getter public offset: Vector = [0, 0]

  public mapStr: string = ''
  @getter public mapData: Dictionary<Array<MapTile | number>[]> = {}
  public name = 'test'

  // initial load
  @mutation public selectTile(coord: Vector) {
    this.selectedCoord = coord
  }

  @action public async initGameMap() {
    // this.offset = await mapApi.get('offset') || [ 0, 0 ]
    const chunks = getChunksForRange(getMaxMinGridRange(this.offset))
    if (chunks) this.loadFromLocalStore(chunks)
  }

  @action public async loadFromLocalStore(chunks: string[]) {
    this.mapData = {
      ...this.mapData,
      ...await mapApi.loadMapChunks(chunks) || {},
    }
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
    const { chunkOffset, coords, tile } = payload
    // is there a chunk?
    const key = `${chunkOffset[0]}:${chunkOffset[1]}`
    let chunk = this.mapData[key]
    if (!chunk) chunk = map.createEmptyChunk(MAP_CHUNK_SIZE, MAP_CHUNK_SIZE)
    // update the chunk data
    chunk[coords[1]][coords[0]] = { ...tile }

    // update the map
    this.mapData  = {
      ...this.mapData,
      [key]: chunk,
    }
    // save the data
    mapApi.set('mapData', this.mapData)
  }

  @mutation private updateName(name: string) {
    this.name = name
  }
}
