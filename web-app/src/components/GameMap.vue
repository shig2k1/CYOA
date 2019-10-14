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

    table
      tr
        td {{ offsetGridCoords }}
        td {{ chunkoffset }}
        td {{ chunkgridxy }}

    pre {{ visibleChunks }}

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
export default class GameMap extends Vue {
  // instanciate mapStore proxy locally
  private mapStore = createProxy(store, MapStore)
  private value = 'This is a test... not sure about having to mark everything as private or public - that should be implicit'

  @Prop() private msg!: string

  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D | null

  private mapGridSize = MAP_GRID_SIZE                        // how big a map tile should be
  private hMapGridSize = Math.floor(this.mapGridSize / 2)

  private vpZoom = 1                               // viewport zoom
  private tileSize = 0

  private centerX = 0
  private centerY = 0
  private width = 0
  private height = 0
  private top = 0
  private left = 0

  private vpGridXY: Vector | null = null       // chunk x, y position
  private mouseGridCoords: Vector | null = null   // nouse
  private offsetGridCoords: Vector | null = null   // relative mouse/grid coords from offset origin
  private offsetChunkCoords: Vector | null = null // which map chunk
  private selectedCoords: Vector | null = null    // currently selected tile
  private cursorMapPosition: Vector | null = null // where the cursor is on the map (or not)this.mouseGridCoords[0]
  private internalGridCoords: Vector | null = null // where in the chunk array the cursor is
  private dataChunkOffset: Vector | null = null // which chunk is active


  // dimensions for calculating chunk range
  private xMaxMin: Vector = [ 0, 0 ]
  private yMaxMin: Vector = [ 0, 0 ]

  // visible chunk addresses
  private visibleChunks: string[] = []

  private canvasSize = 260

  // key handler
  private keyHander!: any

  // mouse handler
  private isMouseDown = false
  private isMouseOver = false

  // animation frame
  private lastRender = 0

  // chunk
  private chunk:MapTile[][] = []

  @Watch('mapStore.offset') onMapOriginChange() {

  }


  @Watch('mapStore.mapData') onMapDataChange() {
    this.setMapChunkRange()
    this.draw()
  }

  private get size () { return `${this.canvasSize}px` }

  private get axisX() {
    return this.centerX + (this.tileSize * this.mapStore.offset[0])
  }

  private get axisY() {
    return this.centerY + (this.tileSize * this.mapStore.offset[1])
  }

  private get origin() {
    return visibleOrigin(this.mapStore.offset)
  }

  get chunkoffset () {
    if (!this.offsetGridCoords) return
    return chunkOffset(this.offsetGridCoords)
  }

  get chunkgridxy () {
    if (!this.offsetGridCoords) return
    return chunkLocalCoords(this.offsetGridCoords)
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
    const hChunk = Math.floor(MAP_CHUNK_SIZE / 2)
    // const isMapChunkOrigin = (coords[0] + hChunk - this.vpOffset[0]) % MAP_CHUNK_SIZE === hChunk && (coords[1] + hChunk - this.vpOffset[1]) % MAP_CHUNK_SIZE === hChunk
    return this.drawCell(coords,'gray')
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

  private drawTile(coords: Vector, fill: string = '#FF0000') {
    if (!coords) return
    this.ctx.fillStyle = fill
    const x = coords[0] * this.tileSize
    const y = coords[1] * this.tileSize
    this.ctx.fillRect(x, y, this.tileSize, this.tileSize)
  }

  private drawMapTile(coords: Vector, fill: string = '#FF0000') {
    if (!coords || !this.ctx) return
    this.ctx.fillStyle = fill
    this.ctx.fillRect(coords[0] * this.tileSize, coords[1] * this.tileSize, this.tileSize, this.tileSize)
  }

  // MOUSE EVENTS
  private mousemove(event: MouseEvent) {
    this.getDims() // update screen info
    this.cursorMapPosition = [ event.clientX - this.left, event.clientY - this.top ]
    // figure out coords relative to grid & data
    if (this.isMouseOver) {
      const hGridSize = Math.floor(this.mapGridSize / 2)
      const offsetX = Math.floor(this.mapStore.offset[0] + hGridSize)
      const offsetY = Math.floor(this.mapStore.offset[1] + hGridSize)
      const hChunk = Math.floor(MAP_CHUNK_SIZE / 2)

      const tileMapSizeChunk = this.tileSize * MAP_CHUNK_SIZE

      this.mouseGridCoords = [
        Math.floor(this.cursorMapPosition[0] / this.tileSize),
        Math.floor(this.cursorMapPosition[1] / this.tileSize)
      ]
      this.offsetChunkCoords = [
        offsetX,
        offsetY
      ]
      this.offsetGridCoords = [
        this.mouseGridCoords[0] - offsetX,
        this.mouseGridCoords[1] - offsetY
      ]
      this.vpGridXY = [
        this.offsetGridCoords[0] + hGridSize,
        this.offsetGridCoords[1] + hGridSize,
      ]

      // HOW DO I GET THE DATA CHUNK OFFSET?
      this.dataChunkOffset = chunkOffset(this.offsetGridCoords)
      // gets the position of the cell, relative to the data chunk
      this.internalGridCoords = chunkLocalCoords(this.offsetGridCoords)
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
    this.isMouseDown = true
    this.mapStore.selectTile(this.offsetGridCoords)
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

    // draw highlight for mouse overlay
    this.drawTile(this.mouseGridCoords, 'rgba(255, 255, 255, 0.3)')

    // figure out selection coordinates
    const offsetSelectedCoord:Vector = [
      this.mapStore.selectedCoord[0] + this.mapStore.offset[0] + this.hMapGridSize,
      this.mapStore.selectedCoord[1] + this.mapStore.offset[1] + this.hMapGridSize
    ]

    // work out the visible chunks and for each cell, draw
    this.drawChunks()

    // highlight the selected cell
    this.drawCell(offsetSelectedCoord, 'lime')
  }


  private drawChunks() {
    // check boundaries
    if (!this.visibleChunks) return
    // get the current required chunk range
    this.visibleChunks.forEach((key:string) => {
      // load the chunk (if it exists)
      const chunk = this.mapStore.mapData[key]

      const chunkOffset = key.split(':')
      if (!chunk) return      
     
      for (let y = 0; y < chunk.length; y++) {
        for (let x = 0; x < chunk[y].length; x++ ) {
          // storing data with 0,0 as centre of data-set - need to offset
          // const chunkArrayCoords = [ x - MAP_HCHUNK_SIZE, y - MAP_HCHUNK_SIZE ]
          if (chunk[y][x]) {
            const xOffset = parseInt(chunkOffset[0]) * MAP_CHUNK_SIZE
            const yOffset = parseInt(chunkOffset[1]) * MAP_CHUNK_SIZE
            
            // clumsy as fuck but it works
            this.ctx.fillStyle = 'yellow'
            this.ctx.fillRect(((x + this.mapStore.offset[0] + MAP_HGRID_SIZE - MAP_HCHUNK_SIZE + xOffset) * this.tileSize), ((y + this.mapStore.offset[1] + MAP_HGRID_SIZE - MAP_HCHUNK_SIZE + yOffset) * this.tileSize), this.tileSize, this.tileSize)
          }
        }
      }
    })
  }


  private startApp() {
    this.draw()
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
      case 'w': return this.changeOffset([this.mapStore.offset[0], this.mapStore.offset[1] - 1])
      case 'a': return this.changeOffset([this.mapStore.offset[0] - 1, this.mapStore.offset[1]])
      case 's': return this.changeOffset([this.mapStore.offset[0], this.mapStore.offset[1] + 1])
      case 'd': return this.changeOffset([this.mapStore.offset[0] + 1, this.mapStore.offset[1]])
    }
  }

  private changeOffset(offset:Vector) {
    this.mapStore.setOffset(offset)
  }

  private getDims() {
    const { width, height, top, left } = this.canvas.getBoundingClientRect()
    this.width = width
    this.height = height        
    this.top = top
    this.left = left
  }

  // track visible chunks for drawing items
  private setMapChunkRange() {
    // set the visible range of map chunks
    this.visibleChunks = getChunksForRange(getMaxMinGridRange(this.origin))
    // if anything missing, get the store to load the required chunk
  }

  private mounted() {
    // get canvas ref
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')

    this.getDims()
    
    this.tileSize = this.width / this.mapGridSize
    this.centerX = this.width / 2
    this.centerY = this.height / 2

    // this.chunk = this.mapStore.mapData.chunks['0:0']

    window.requestAnimationFrame(this.loop)
    this.keyHander = document.addEventListener('keypress', this.onKeyPress)

    this.setMapChunkRange()
    // this.chunk = this.mapStore.mapData.chunks['0:0']
    // this.draw()
  }

  beforeDestroy() {
    document.removeEventListener('keypress', this.onKeyPress)
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .game-map-area {
      border: 1px solid gray;
    }
    #game-map {
        background:black;
    }
</style>
