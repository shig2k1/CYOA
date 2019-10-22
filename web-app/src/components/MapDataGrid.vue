<template lang="pug">
  div(v-if="value")
    table
      tr(v-for="(row, y) in value" :key="`row-${y}`")
        td.sq(v-for="(col, x) in row" :key="`col-${y}-${x}`" @click="select(x, y)" :class="{ active: isActive(x, y), selected: isSelected(x, y) }") {{ col }}

    p x: {{ x }} || y: {{ y }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Vector } from '../types'

@Component
export default class MapDataGrid extends Vue {
  @Prop() public value!: Vector[][][]
  x = null
  y = null

  select (x, y) {
    this.x = x
    this.y = y
  }

  isActive (x, y) {
    if (this.x === null || this.y === null) return false
    return this.value[this.y][this.x].find(vector => vector[0] === y && vector[1] === x)
  }

  isSelected (x, y) {
    return this.x === x && this.y === y
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  table { 
    border: 1px solid black;
  }
  tr, td {
    border: 1px solid;
  }
  td.sq {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 8pt;
    width: 40px;
    height: 40px;

    &.active, &.selected { 
      background: orange;
      color: white;
    }

    &.selected {
      background: red;
    }
  }
</style>
