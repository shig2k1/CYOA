
import { Dictionary, MapTile, Vector } from '@/types'
import { MAP_CHUNK_SIZE } from '@/config'

/*
  { }
*/

export default class Map {
  private chunks:Dictionary<(MapTile | number)[][]> = {}

  public get map () {
    return this.chunks
  }

  public createEmptyChunk(width: number, height: number): (MapTile | number)[][] {
    let data:(MapTile | number)[][] = []
    for (let y = 0; y < height; y++) {
      let row:(MapTile | number)[] = []
      for (let x = 0; x < width; x++) {
        row.push(0)
      }
      data.push(row)
    }
    return data
  }

  public getChunk(offset: Vector): (MapTile | number)[][] {
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

  public serialize () {
    return JSON.stringify(this.chunks)
  }
}
