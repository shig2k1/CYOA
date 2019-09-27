
import { Dictionary, MapTile, Vector } from '@/types'
import { MAP_CHUNK_SIZE } from '@/config'

/*
  { }
*/

export default class Map {
  private chunks:Dictionary<MapTile[][]> = {}

  constructor (width: number, height: number) {
    this.width = width
    this.height = height
    this.startNewMap()
  }

  public width: number
  public height: number

  private createEmptyChunk(width: number, height: number, offset: Vector): MapTile[][] {
    let data:MapTile[][] = []
    for (let y = 0; y < height; y++) {
      let row:MapTile[] = []
      for (let x = 0; x < width; x++) {
        row.push({ 
          coords: [x + offset[0], y + offset[1]]
        })
      }
      data.push(row)
    }
    return data
  }

  private createNewChunk(offset:Vector, chunk: MapTile[][]) {
    const key = `${offset[0]}:${offset[1]}`
    this.chunks = {
      ...this.chunks,
      [key]: chunk
    }
  }

  public startNewMap() {
    this.createNewChunk([0,0], this.createEmptyChunk(MAP_CHUNK_SIZE, MAP_CHUNK_SIZE, [0, 0]))
  }

  public serialize () {
    return JSON.stringify(this.chunks)
  }

}

