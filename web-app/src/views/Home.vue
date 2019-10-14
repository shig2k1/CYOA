<template lang="pug">
  .editor-wrapper
    .left
      .title Dungeon builder
      // world map
      .world-map
        .sub-title World Map
        .map.rounded-border test

      // rooms
      .rooms
        .sub-title Rooms

        .room-list
          ul
            li.active Spawn room | 0, 0
            li room 1 | 1, 0
            li room 2 | 1, 1

    .mid
      .inner
        // content tabs
        .content-tabs
          ul
            li Ground floor: spawn room
            li.active Ground floor: room 2
            li Ground floor: room 3
            li Ground floor: room 4
            li Ground floor: room 5

        // room editor
        .room-editor

          // room map
          .room-map
            canvas

          // room properties
          .room-properties
            .sub-title selected tile properties

        // global items
        .global-items
          .mobs
            .sub-title mobs

          .items
            .sub-title items

  
  //.game-wrapper
    .title-bar
    .main(v-if="mapStore")
      .map-area
        game-map
        
      .map-detail

        three-js
        
      .map-items
        game-tile-detail
        
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import GameMap from '@/components/GameMap.vue' // @ is an alias to /src
import GameTileDetail from '@/components/GameTileDetail.vue'
import ThreeJs from '@/components/ThreeJs.vue'

import { chunkLocalCoords, chunkOffset, getChunksForRange, getMaxMinGridRange } from '../utils/map.helper'

@Component({
  components: {
    GameMap,
    GameTileDetail,
    ThreeJs,
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
    this.mapStore.initGameMap()
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

