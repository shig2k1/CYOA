import { createModule, mutation, action, createProxy } from 'vuex-class-component'

import map from '@/api/map'

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
  @action public async loadFromLocalStore () {
    this.mapData = await map.get('mapData') || {}
  }

  @action public async changeName(name: string) {
    return await this.updateName(name)
  }

  @mutation private updateName(name: string) {
    this.name = name
  }

}
