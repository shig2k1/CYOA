<template lang="pug">
  .root
    h1 Hello world!
    pre {{ value }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  private value = 'This is a test... not sure about having to mark everything as private or public - that should be implicit'

  @Prop() private msg!: string

  private mounted() {
    this.$log.debug('Debugging')
    this.$log.info('info')
    this.$log.warn('warn')
    this.$log.error('error')
    this.$log.fatal('fatal!')
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
