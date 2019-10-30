<template lang="pug">
  .editor-wrapper
    

    // room-map
    maze-css(v-if="mapData" :data="mapData")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import MazeCss from '@/components/MazeCss.vue'

import { newMaze } from '../utils/maze.helper'

@Component({
  components: {
    MazeCss
  },
})
export default class Home extends Vue {

  mapData:any = null

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

    this.mapData = newMaze(140, 80, 212331)
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

