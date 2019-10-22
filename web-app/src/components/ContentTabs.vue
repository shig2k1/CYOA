<template lang="pug">
  // content tabs
  .content-tabs
    ul
      li(v-for="item in items" :key="item" :class="{ 'active': item === value }" @click="$emit('input', item)") 
        span {{ item }}
        span
          v-btn(icon)
            v-icon star

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import { Vector, MapTile } from '../types'
import { Dictionary } from 'vue-router/types/router'
import { MAP_CHUNK_SIZE, MAP_GRID_SIZE, MAP_HCHUNK_SIZE, MAP_HGRID_SIZE } from '../config'


import { chunkLocalCoords, chunkOffset, getMaxMinGridRange, getChunksForRange, visibleOrigin } from '../utils/map.helper'
import { buildRoom } from '../utils/room.helper'

const GRID_COLOR = '#AAA'

@Component
export default class ContentTabs extends Vue {
  @Prop() public value!: string | null
  @Prop({ default: () => [] }) public items!: string[]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
