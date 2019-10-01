<template lang="pug">
  .game-tile-detail
    h1 Selected x: {{ x }} y: {{ y }}

    v-btn(@click="createTile")
      | Create tile

    pre {{ offset }}
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { createProxy } from 'vuex-class-component'

  // import the store and required map module
  import { store } from '../store'
  import MapStore, { IAddTile } from '../store/modules/map.store'

  import { Vector } from '../types'

  import { MAP_CHUNK_SIZE } from '../config'

  import { chunkLocalCoords, chunkOffset, getChunksForRange, getMaxMinGridRange } from '../utils/map.helper'

  const hChunk = Math.ceil(MAP_CHUNK_SIZE / 2)

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

    private get offset() {
      if (!this.mapStore.selectedCoord) return
      return chunkOffset(this.mapStore.selectedCoord)
    }

    private get map() {
      return this.mapStore.mapData
    }

    private get test() {
      return getChunksForRange(getMaxMinGridRange(this.mapStore.offset))
    }

    private createTile() {
      let data:IAddTile = {
        chunkOffset: chunkOffset(this.mapStore.selectedCoord),
        coords: chunkLocalCoords(this.mapStore.selectedCoord),
        tile: {
          name: 'test'
        }
      }

      console.log(chunkOffset(this.mapStore.selectedCoord), chunkLocalCoords(this.mapStore.selectedCoord))

      this.mapStore.addTile(data)
    }
  }
</script>

<style lang="scss">

</style>