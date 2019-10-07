import { Vector } from '@/types'

import { MapTiles } from '@/data'
import { TILE_DIRECTIONS } from '@/enums'

// generate a simple room for the specified dimensions
function buildRoom(width: number, height: number) {
  let arr:number[][] = []
  for (let y = 0; y < height; y++) {
    let _arr:number[] = []
    for (let x = 0; x < width; x++) {
      let tile = (y === 0) ?
          /* top row */((x === 0) ? TILE_DIRECTIONS.TOP_RIGHT : (x === width - 1) ? TILE_DIRECTIONS.TOP_LEFT : TILE_DIRECTIONS.TOP_MIDDLE) :
        (y === height - 1) ?
          /* bottom row */((x === 0) ? TILE_DIRECTIONS.BOTTOM_RIGHT : (x === width - 1) ? TILE_DIRECTIONS.BOTTOM_LEFT : TILE_DIRECTIONS.BOTTOM_MIDDLE) :
          /* middle row */((x === 0) ? TILE_DIRECTIONS.MIDDLE_RIGHT : (x === width - 1) ? TILE_DIRECTIONS.MIDDLE_LEFT : TILE_DIRECTIONS.MIDDLE_MIDDLE)
      _arr.push(tile)
    }
    arr.push(_arr)
  }
  return arr
}

export { buildRoom }
