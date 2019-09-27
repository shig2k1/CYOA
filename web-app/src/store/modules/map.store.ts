import { createModule, mutation, action, createProxy } from 'vuex-class-component'

import mapApi from '@/api/map'

import Map from '@/classes/map'

import { Dictionary, MapTile } from '@/types'

const VuexModule = createModule({
  namespaced: true,
  strict: false,
  target: 'nuxt',
})

export default class MapStore extends VuexModule {
  public mapData: Dictionary<MapTile> = {}

  public name = 'test'

  // initial load
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
