import { createModule, mutation, action, getter, createProxy, VuexModule } from 'vuex-class-component'

import mapApi from '@/api/map'

import Map from '@/classes/map'

import { Dictionary, MapTile, Vector } from '@/types'

const VuexModule = createModule({
  namespaced: true,
  strict: false,
  target: 'nuxt',
})

export default class MapStore extends VuexModule {
  private map: Map

  public mapStr: string = ''
  @getter public mapData: Dictionary<MapTile[][]> = {}
  public name = 'test'

  constructor() {
    super()
    this.map = new Map()
  }



  // initial load
  @action public async createNewMap () {
    this.map.startNewMap()
    this.mapStr = this.map.serialize()
  }

  @action public async loadFromLocalStore() {
    this.mapData = await mapApi.get('mapData') || {}
  }

  @action public async changeName(name: string) {
    return await this.updateName(name)
  }

  @action public async addTile(chunkOffset: Vector, coords: Vector) {
    // is there a chunk?
    let chunk = await this.map.getChunk(chunkOffset)
    if (!chunk) await this.map.createNewChunk(chunkOffset)
    chunk = await this.map.getChunk(chunkOffset)
    
  }

  @mutation private updateName(name: string) {
    this.name = name
  }

}
