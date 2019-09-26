<template lang="pug">
  canvas#game-map()
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

@Component
export default class HelloWorld extends Vue {
  // instanciate mapStore proxy locally
  private mapStore = createProxy(store, MapStore)
  
  
  private value = 'This is a test... not sure about having to mark everything as private or public - that should be implicit'

  @Prop() private msg!: string



  private mounted() {
    // create axis
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #game-map {
        background:red;
        width: 100%;
        height: 100%;
    }
</style>
