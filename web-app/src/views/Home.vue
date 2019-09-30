<template lang="pug">
  .game-wrapper
    .title-bar
    .main
      .map-area
        game-map
        
      .map-detail
        game-tile-detail
        
        pre {{ mapStore.selectedCoord }}
        
        button(@click="changeName") Change the name
      .map-items
        p items
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import GameMap from '@/components/GameMap.vue' // @ is an alias to /src
import GameTileDetail from '@/components/GameTileDetail.vue'

import { chunkLocalCoords, chunkOffset, getChunksForRange, getMaxMinGridRange } from '../utils/map.helper'

@Component({
  components: {
    GameMap,
    GameTileDetail,
  },
})
export default class Home extends Vue {
  // instanciate mapStore proxy locally
  private mapStore = createProxy(store, MapStore)

  private changeName() {
    this.mapStore.changeName('FUCK!')
    this.mapStore.name = 'shit'
  }

  private mounted() {
    let chunks = getChunksForRange(getMaxMinGridRange(this.mapStore.offset))
    this.mapStore.loadFromLocalStore(chunks)
  }

  public get mapInterestPoints () {
    return 
  }
}
</script>

<style lang="scss" scoped>
  $navbar: 50px;
  .game-wrapper {
    display: block;
    position: relative;
    background: #ccc;
    height: 100vh;
    .title-bar {
      height: $navbar;
      background: #000;
    }

    .main {
      display: flex;
      width: 100vw;
      height: calc(100% - #{$navbar});
      background: #fff;

      div { height: 100%; }
      
      .map-area {
        flex: 1;
        background: orange;
      }
      .map-detail {
        width: 30vw;
      }
      .map-items {
        width: 30vw;
      }
    }
  }
</style>

