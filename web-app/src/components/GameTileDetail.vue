<template lang="pug">
  .game-tile-detail
    h1 Selected x: {{ x }} y: {{ y }}
    h2 chunk: {{ chunkOffset }}
    h2 coords: {{ chunkCoords }}

    v-btn(@click="createTile")
      | Create tile

    pre {{ map }}
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { createProxy } from 'vuex-class-component'

  // import the store and required map module
  import { store } from '../store'
  import MapStore, { IAddTile } from '../store/modules/map.store'

  import { Vector } from '../types'

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

    private get map () {
      return this.mapStore.mapData
    }

    private get chunkOffset():Vector {
      return [
        Math.round(this.x / MAP_CHUNK_SIZE),
        Math.round(this.y / MAP_CHUNK_SIZE)
      ]
    }

    private get chunkCoords():Vector {
      return [
        (Math.abs((this.x + hChunk) % MAP_CHUNK_SIZE)),
        (Math.abs((this.y + hChunk) % MAP_CHUNK_SIZE))
      ]
    }

    private createTile() {
      let data:IAddTile = {
        chunkOffset: this.chunkOffset,
        coords: this.chunkCoords,
        tile: {
          name: 'test'
        }
      }
      this.mapStore.addTile(data)
    }
  }
</script>

<style lang="scss">

</style>