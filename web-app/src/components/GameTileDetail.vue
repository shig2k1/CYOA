<template lang="pug">
  .game-tile-detail
    h1 Selected x: {{ x }} y: {{ y }}
    h2 chunk: {{ chunkOffset }}
    h2 coords: {{ chunkCoords }}
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { createProxy } from 'vuex-class-component'

  // import the store and required map module
  import { store } from '../store'
  import MapStore from '../store/modules/map.store'

  import { MAP_CHUNK_SIZE } from '../config'

  const hChunk = Math.floor(MAP_CHUNK_SIZE / 2)

  @Component
  export default class GameTileDetail extends Vue {
    // instanciate mapStore proxy locally
    private mapStore = createProxy(store, MapStore)

    private get x() {
      return this.mapStore.selectedCoord[0]
    }

    private get y() {
      return this.mapStore.selectedCoord[1]
    }

    private get chunkOffset () {
      return [
        Math.round(this.x / MAP_CHUNK_SIZE),
        Math.round(this.y / MAP_CHUNK_SIZE)
      ]
    }

    private get chunkCoords () {
      return [
        (Math.abs((this.x + hChunk) % MAP_CHUNK_SIZE)),
        (Math.abs((this.y + hChunk) % MAP_CHUNK_SIZE))
      ]
    }
  }
</script>

<style lang="scss">

</style>