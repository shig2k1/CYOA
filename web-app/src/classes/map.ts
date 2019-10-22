
import { Dictionary, MapTile, Vector } from '@/types'
import { MAP_CHUNK_SIZE } from '@/config'
/*
  Map takes care of locating items within a chunked 0/0 origin tilemap
*/

export default class Map {
  private chunks: Dictionary<Array<MapTile | number>[]> = {}

  public get map() {
    return this.chunks
  }

  public createEmptyChunk(width: number, height: number): Array<MapTile | number>[] {
    const data: Array<MapTile | number>[] = []
    for (let y = 0; y < height; y++) {
      const row: Array<MapTile | number> = []
      for (let x = 0; x < width; x++) {
        row.push(0)
      }
      data.push(row)
    }
    return data
  }

  public getChunk(offset: Vector): Array<MapTile | number>[] {
    return this.chunks[`${offset[0]}:${offset[1]}`]
  }

  public createNewChunk(offset: Vector) {
    const key = `${offset[0]}:${offset[1]}`
    const chunk = this.createEmptyChunk(MAP_CHUNK_SIZE, MAP_CHUNK_SIZE)
    this.chunks = {
      ...this.chunks,
      [key]: chunk,
    }
  }

  public serialize() {
    return JSON.stringify(this.chunks)
  }
}
