
import { Dictionary, MapTile, Vector } from '@/types'
import { MAP_CHUNK_SIZE } from '@/config'

/*
  { }
*/

export default class Map {
  private chunks:Dictionary<MapTile[][]> = {}

  constructor () {
    this.startNewMap()
  }

  public get map () {
    return this.chunks
  }

  public createEmptyChunk(width: number, height: number): MapTile[][] {
    let data:MapTile[][] = []
    for (let y = 0; y < height; y++) {
      let row:MapTile[] = []
      for (let x = 0; x < width; x++) {
        row.push({ 
          coords: [x, y]
        })
      }
      data.push(row)
    }
    return data
  }

  public getChunk(offset: Vector): MapTile[][] {
    return this.chunks[`${offset[0]}:${offset[1]}`]
  }

  public createNewChunk(offset:Vector) {
    const key = `${offset[0]}:${offset[1]}`
    let chunk = this.createEmptyChunk(MAP_CHUNK_SIZE, MAP_CHUNK_SIZE)
    this.chunks = {
      ...this.chunks,
      [key]: chunk
    }
  }

  public startNewMap() {
    this.createNewChunk([0, 0])
  }

  public serialize () {
    return JSON.stringify(this.chunks)
  }
}
