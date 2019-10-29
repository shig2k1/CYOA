<template lang="pug">
  .maze-css(v-if="data")
    .row(v-for="(row, i) in data" :key="`row-${i}`")
      .cell(v-for="(cell, j) in row" :key="`row-${i}-cell-${j}`" :class="getClass(cell)")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class MazeCss extends Vue {
  @Prop() private data!: any

  getClass (cell:any) {
    return {
      t: (cell[0] == 0),
      r: (cell[1] == 0), 
      b: (cell[2] == 0), 
      l: (cell[3] == 0) 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $cellSize: 20px;

    .game-map-area {
      border: 1px solid gray;
    }
    #game-map {
        background:black;
    }

    .cell {
      display: block;
      width: $cellSize;
      height: $cellSize;
      border: 1px solid black;
      background: black;
      &.t { border-top: 1px solid white; }
      &.r { border-right: 1px solid white; }
      &.b { border-bottom: 1px solid white; }
      &.l { border-left: 1px solid white; }
    }

    .row {
      display: flex;
    }

</style>
