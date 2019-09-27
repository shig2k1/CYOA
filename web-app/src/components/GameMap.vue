<template lang="pug">
  .game-map-area()
    canvas#game-map(ref="canvas" 
      :width="canvasSize" 
      :height="canvasSize"
      :class="{ width: size, height: size }"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mouseenter="mouseenter" 
      @mouseleave="mouseleave" 
      @mousemove="mousemove")

    div offset {{ vpOffset }}
    div highlight {{ highlightCoords }}
    div chunkArrayPosition {{ chunkGridXY }}
    div mouse {{ mouseGridCoords }}
    div cursor {{ cursorMapPosition }}
        
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import { Vector } from '../types'
import { Dictionary } from 'vue-router/types/router'

const GRID_COLOR = '#AAA'

@Component
export default class HelloWorld extends Vue {
  // map will generate a starting chunk - array of fixed size with player at center

  // [  0,1,2
  //  0[0,0,0],
  //  1[0,0,0],
  //  2[0,0,0]
  // ]


  // instanciate mapStore proxy locally
  private mapStore = createProxy(store, MapStore)
  private value = 'This is a test... not sure about having to mark everything as private or public - that should be implicit'

  @Prop() private msg!: string

  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D | null

  private mapGridSize = 21                        // how big a map tile should be

  private vpOffset: Vector = [ 0, 0 ]              // viewport offset
  private vpZoom = 1                               // viewport zoom
  private tileSize = 0

  private centerX = 0
  private centerY = 0
  private width = 0
  private height = 0
  private top = 0
  private left = 0

  private chunkGridXY: Vector | null = null       // chunk x, y position
  private mouseGridCoords: Vector | null = null   // nouse
  private highlightCoords: Vector | null = null   // relative mouse/grid coords
  private selectedCoords: Vector | null = null    // currently selected tile
  private cursorMapPosition: Vector | null = null // where the cursor is on the map (or not)

  private canvasSize = 700

  // key handler
  private keyHander!: any

  // mouse handler
  private isMouseDown = false
  private isMouseOver = false

  // animation frame
  private lastRender = 0

  private get size () { return `${this.canvasSize}px` }

  private get axisX() {
    return this.centerX + (this.tileSize * this.vpOffset[0])
  }

  private get axisY() {
    return this.centerY + (this.tileSize * this.vpOffset[1])
  }

  private drawGrid() {
    // draw a grid - for now it's 20x20
    for (let y = 0; y < this.mapGridSize; y++) {
      for (let x = 0; x < this.mapGridSize; x++) {
        this.drawGridCell([x, y])
      }
    }

    // axis
    this.drawLine([this.axisX, 0], [this.axisX, this.height], 'red')
    this.drawLine([0, this.axisY], [this.width, this.axisY], 'red')
  }

  private drawLine(from: Vector, to: Vector, color: string = '#FFFFFF') {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.ctx.strokeStyle = color
    this.ctx.moveTo(from[0], from[1])
    this.ctx.lineTo(to[0], to[1])
    this.ctx.stroke()
  }

  private drawGridCell(coords: Vector) {
    return this.drawCell(coords, GRID_COLOR)
  }

  private drawCell(coords: Vector, color: string) {
    if (!coords) return
    const x1 = coords[0] * this.tileSize
    const y1 = coords[1] * this.tileSize
    const x2 = x1 + this.tileSize
    const y2 = y1 + this.tileSize

    this.drawLine([x1, y1], [x2, y1], color)
    this.drawLine([x2, y1], [x2, y2], color)
    this.drawLine([x2, y2], [x1, y2], color)
    this.drawLine([x1, y2], [x1, y1], color)
  }

  private highlight(coords:Vector) {

  }

  private drawTile(coords: Vector, fill: string = '#FF0000') {
    if (!coords) return
    this.ctx.fillStyle = fill
    const x = coords[0] * this.tileSize
    const y = coords[1] * this.tileSize
    this.ctx.fillRect(x, y, this.tileSize, this.tileSize)
  }

  private cursorToGrid(cursor:Vector):Vector {
    
    return 
  }

  // MOUSE EVENTS
  private mousemove(event: MouseEvent) {
    this.cursorMapPosition = [ event.clientX - this.left, event.clientY - this.top ]
    this.$log.debug('event: ', this.cursorMapPosition)
    if (this.isMouseOver) {
      const hGridSize = Math.floor(this.mapGridSize / 2)
      let offsetX = Math.floor(this.vpOffset[0] + hGridSize)
      let offsetY = Math.floor(this.vpOffset[1] + hGridSize)
      this.mouseGridCoords = [
        Math.floor(this.cursorMapPosition[0] / this.tileSize),
        Math.floor(this.cursorMapPosition[1] / this.tileSize)
      ]
      this.highlightCoords = [
        this.mouseGridCoords[0] - offsetX,
        this.mouseGridCoords[1] - offsetY
      ]
      this.chunkGridXY = [
        this.highlightCoords[0] + hGridSize,
        this.highlightCoords[1] + hGridSize,
      ]
    } 
    
    if (this.isMouseDown) this.$log.debug('dragging!')
  }

  private mouseenter() {
    this.isMouseOver = true
  }

  private mouseleave() {
    this.isMouseOver = true
    this.cursorMapPosition = null
  }

  private mousedown() {
    this.$log.debug('mousedown')
    this.isMouseDown = true
  }

  private mouseup() {
    this.$log.debug('mouseup')
    this.isMouseDown = false
  }

  private update(progress: number) {
    // Update the state of the world for the elapsed time since last render
  }

  private draw() {
    if (!this.ctx) return
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.drawGrid()

    this.drawTile(this.mouseGridCoords, 'rgba(255, 255, 255, 0.3)')
  }

  private loop(timestamp: number) {
    const progress = timestamp - this.lastRender

    this.update(progress)
    this.draw()

    this.lastRender = timestamp
    window.requestAnimationFrame(this.loop)
  }


  // handle the canvas movement with keyboard
  private onKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'w': return this.vpOffset = [this.vpOffset[0], this.vpOffset[1] - 1]
      case 'a': return this.vpOffset = [this.vpOffset[0] - 1, this.vpOffset[1]]
      case 's': return this.vpOffset = [this.vpOffset[0], this.vpOffset[1] + 1]
      case 'd': return this.vpOffset = [this.vpOffset[0] + 1, this.vpOffset[1]]
    }
  }

  private mounted() {
    // get canvas ref
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')

    const { width, height, top, left } = this.canvas.getBoundingClientRect()

    this.tileSize = width / this.mapGridSize
    this.centerX = width / 2
    this.centerY = height / 2
    this.width = width
    this.height = height
    this.top = top
    this.left = left

    window.requestAnimationFrame(this.loop)
    this.keyHander = document.addEventListener('keypress', this.onKeyPress)
  }

  beforeDestroy() {
    document.removeEventListener('keypress', this.keyHander)
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
    }
</style>
