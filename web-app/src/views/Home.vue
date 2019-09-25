<template lang="pug">
  .game-wrapper
    .title-bar
    .main
      .map-area
        p map
      .map-detail
        p detail
      .map-items
        p items
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
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

