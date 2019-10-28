<template lang="pug">
  .editor-wrapper
    

    // room-map
    map-data(v-if="mapData" v-model="mapData")


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
import MapDataGrid from '@/components/MapDataGrid.vue'
import MapDataRooms from '@/components/MapDataRooms.vue'

import { IDungeonOptions, BuildDungeon, BuildDungeonStage2, BuildDungeonStage3, BuildDungeonStage4 } from '../utils/dungeon.helper'

import { chunkLocalCoords, chunkOffset, getChunksForRange, getMaxMinGridRange } from '../utils/map.helper'

@Component({
  components: {
    GameMap,
    RoomMap,
    GameTileDetail,
    ThreeJs,
    ContentTabs,
    MapData,
    MapDataGrid,
    MapDataRooms,
  },
})
export default class Home extends Vue {

  mapData:any = null
  mapDataStage2:any = null
  mapDataStage3:any = null
  mapDataStage4:any = null

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
    this.mapDataStage2 = BuildDungeonStage2(this.mapData)
    this.mapDataStage3 = BuildDungeonStage3(this.mapDataStage2)
    this.mapDataStage4 = BuildDungeonStage4(this.mapDataStage2)
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

