<template lang="pug">
  .editor-wrapper
    .left
      .title Dungeon builder
      // world map
      .world-map
        .sub-title World Map
        .map
          game-map

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
        content-tabs(:items="activeTiles" v-model="selectedActiveTile")

        // room editor
        .room-editor

          // room map
          .room-map
            // room-map
            map-data(v-model="mapData")

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
import RoomMap from '@/components/RoomMap.vue' // @ is an alias to /src
import ContentTabs from '@/components/ContentTabs.vue'
import GameTileDetail from '@/components/GameTileDetail.vue'
import ThreeJs from '@/components/ThreeJs.vue'
import MapData from '@/components/MapData.vue'

import { IDungeonOptions, BuildDungeon } from '../utils/dungeon.helper'

import { chunkLocalCoords, chunkOffset, getChunksForRange, getMaxMinGridRange } from '../utils/map.helper'

@Component({
  components: {
    GameMap,
    RoomMap,
    GameTileDetail,
    ThreeJs,
    ContentTabs,
    MapData,
  },
})
export default class Home extends Vue {

  mapData:any = []

  public get mapInterestPoints() {
    return
  }

  public activeTiles: string[] = ['a', 'b', 'c']
  public selectedActiveTile: string = this.activeTiles[0]

  public options: IDungeonOptions = { numberOfRooms: 50, maxRoomsWide: 5 }
  // instanciate mapStore proxy locally
  private mapStore = createProxy(store, MapStore)

  private changeName() {
    this.mapStore.changeName('FUCK!')
    this.mapStore.name = 'shit'
  }

  private mounted() {
    this.mapStore.initGameMap()

    this.mapData = BuildDungeon(this.options)
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

