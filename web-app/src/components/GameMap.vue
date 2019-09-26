<template lang="pug">
  .game-map-area()
    canvas#game-map(ref="canvas" 
      :width="canvasSize" 
      :height="canvasSize"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mouseenter="mouseenter" 
      @mouseleave="mouseleave" 
      @mousemove="mousemove")

    div {{ vpOffset }}
        
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import { Vector } from '../types'

const GRID_COLOR = '#CCC'

@Component
export default class HelloWorld extends Vue {
  // instanciate mapStore proxy locally
  private mapStore = createProxy(store, MapStore)
  
  
  private value = 'This is a test... not sure about having to mark everything as private or public - that should be implicit'

  @Prop() private msg!: string

  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D

  private mapGridSize = 5                        // how big a map tile should be

  private selectedCoords:Vector | null = null     // currently selected tile
  private vpOffset:Vector = [ 0, 0 ]              // viewport offset
  private vpZoom:number = 1                       // viewport zoom
  private tileSize = 0

  private centerX = 0
  private centerY = 0
  private width = 0
  private height = 0
  private top = 0
  private left = 0

  private cursorMapPosition: Vector | null = null // where the cursor is on the map (or not)

  private canvasSize = 500

  // mouse handler
  private isMouseDown = false

  private get axisX () {
    return this.centerX + (this.tileSize * this.vpOffset[0])
  }

  private get axisY () {
    return this.centerY + (this.tileSize * this.vpOffset[1])
  }

  private drawGrid () {
    // draw a grid - for now it's 20x20
    for(let y=0; y<this.mapGridSize; y++) {
      for(let x=0; x<this.mapGridSize; x++) {
        this.drawGridCell([x, y])
      }
    }
    
    // axis
    this.drawLine([this.axisX, 0], [this.axisX, this.height], 'red')
    this.drawLine([0, this.axisY], [this.width, this.axisY], 'red')
  }

  private drawLine (from:Vector, to:Vector, color: string = '#FFFFFF') {
    this.ctx.beginPath()
    this.ctx.strokeStyle = color
    this.ctx.moveTo(from[0], from[1])
    this.ctx.lineTo(to[0], to[1])
    this.ctx.stroke()
  }

  private drawGridCell (coords:Vector) {
    let x1 = coords[0] * this.tileSize
    let y1 = coords[1] * this.tileSize
    let x2 = x1 + this.tileSize
    let y2 = y1 + this.tileSize

    this.drawLine([x1,y1], [x2,y1], GRID_COLOR)
    this.drawLine([x2,y1], [x2,y2], GRID_COLOR)
    this.drawLine([x2,y2], [x1,y2], GRID_COLOR)
    this.drawLine([x1,y2], [x1,y1], GRID_COLOR)
  }

  private drawTile (coords:Vector, border: string = '#FF0000') {

  }

  // MOUSE EVENTS
  private mousemove (event:MouseEvent) {
    this.cursorMapPosition = [ event.clientX - this.left, event.clientY - this.top ]
    console.log('event: ', this.cursorMapPosition)
    if (this.isMouseDown) console.log('dragging!')
  }

  private mouseenter () {
    console.log('mouse enter')
  }

  private mouseleave () {
    console.log('mouse leave')
    this.cursorMapPosition = null
  }

  private mousedown () {
    console.log('mousedown')
    this.isMouseDown = true
  }

  private mouseup () {
    console.log('mouseup')
    this.isMouseDown = false
  }

  private mounted() {
    // get canvas ref
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')

    let { width, height, top, left } = this.canvas.getBoundingClientRect()
    
    this.tileSize = width / this.mapGridSize
    this.centerX = width / 2
    this.centerY = height / 2
    this.width = width
    this.height = height
    this.top = top
    this.left = left

    this.drawGrid()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .game-map-area {
      border: 1px solid gray;
      padding:20px;
    }
    #game-map {
        background:black;
        width: 500px;
        height: 500px;
    }
</style>
