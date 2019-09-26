import { createModule, mutation, action, createProxy } from 'vuex-class-component'

const VuexModule = createModule({
  namespaced: true,
  strict: false,
  target: 'nuxt',
})

export default class MapStore extends VuexModule {

  private rooms = {

  }

  public name = 'test'

  @action public async changeName(name: string) {
    return await this.updateName(name)
  }

  @mutation private updateName(name: string) {
    this.name = name
  }

}
