import { Vector } from '../types'

import { MAP_CHUNK_SIZE, MAP_HCHUNK_SIZE, MAP_GRID_SIZE, MAP_HGRID_SIZE } from '../config'

// get the visible origin from the offset
function visibleOrigin(offset: Vector):Vector {
  return [
    -offset[0],
    -offset[1]
  ]
}

// based on the size of a map chunk, figure out the offset of the chunk used to store this data
function chunkOffset(coords: Vector): Vector {
  return [
    Math.round(coords[0] / MAP_CHUNK_SIZE),
    Math.round(coords[1] / MAP_CHUNK_SIZE)
  ]
}

// based on the size of a map chunk and a center origin, figure out the coordinates relative to the chunk
function chunkLocalCoords(coords: Vector): Vector {
  let x = (coords[0] + MAP_HCHUNK_SIZE) % MAP_CHUNK_SIZE
  let y = (coords[1] + MAP_HCHUNK_SIZE) % MAP_CHUNK_SIZE
  // if calculating in negative, need a positive
  if (x < 0) x = MAP_CHUNK_SIZE + x
  if (y < 0) y = MAP_CHUNK_SIZE + y
  return [
    x,
    y
  ]
}

// get max/min x & y range for visible returns [[xMin, xMax], [yMin, yMax]]
function getMaxMinGridRange(coords: Vector): Vector[] {
  const startX = coords[0] - MAP_HGRID_SIZE
  const endX = startX + (MAP_GRID_SIZE-1)
  const startY = coords[1] - MAP_HGRID_SIZE
  const endY = startY + (MAP_GRID_SIZE-1)
  return [
    [
      startX,
      endX,
    ],
    [
      startY,
      endY,
    ],
  ]
}

// from the extremes of the grid, work out what chunks to load
function getChunksForRange(xyMinMax: Vector[]) {
  if (!xyMinMax) return

  const xMin = xyMinMax[0][0]
  const xMax = xyMinMax[0][1]
  const yMin = xyMinMax[1][0]
  const yMax = xyMinMax[1][1]

  // figure out the offset if the x / y range falls outside
  const xRange = chunkOffset([xMin, yMin])
  const yRange = chunkOffset([xMax, yMax])

  let requiredChunks = []

  // iterate over the range loading all necessary chunks (if they exist)
  for (let x = xRange[0]; x <= yRange[0]; x++) {
    for (let y = xRange[1]; y <= yRange[1]; y++) {
      requiredChunks.push(`${x}:${y}`)
    }
  }

  return requiredChunks
}

export { chunkLocalCoords, chunkOffset, getMaxMinGridRange, getChunksForRange, visibleOrigin }
