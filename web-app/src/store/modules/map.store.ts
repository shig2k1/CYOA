import { createModule, mutation, action, getter, createProxy } from 'vuex-class-component'

import mapApi from '@/api/map'

import Map from '@/classes/map'

import { Dictionary, MapTile } from '@/types'

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

  @mutation private updateName(name: string) {
    this.name = name
  }

}
