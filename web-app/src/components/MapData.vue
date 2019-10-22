<template lang="pug">
  div(v-if="value")
    table
      tr(v-for="(row, y) in value" :key="`row-${y}`")
        td(v-for="(col, x) in row" :key="`col-${y}-${x}`") {{ col }}

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class MapData extends Vue {
  @Prop() public value!: string[][]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
