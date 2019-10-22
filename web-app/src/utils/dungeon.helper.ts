import map from '@/api/map'
import router from '@/router'
import { Vector } from '@/types'
import { register } from 'register-service-worker'

interface IDungeonOptions {
  numberOfRooms: number
  maxRoomsWide: number
}

const ALPHA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '?','A','B']

// generate an array of rooms
const makeRooms = function(numberOfRooms: number) {
  const output = []
  for (let i = 0; i < numberOfRooms; i++) {
    output.push(ALPHA[i])
  }
  return output
}

// split array of rooms into quads to represent +/- xy
const roomsToQuad = function(rooms: string[]) {
  const grid: any = [[], [], [], []]
  for (let i = 0, j = 0; i < rooms.length; i++, j++) {
    if (j === grid.length) j = 0
    grid[j].push(rooms[i])
  }
  return grid
}

// fill out empty space in cols/rows of quads to even it out
const padQuads = function(quads: string[][], maxRoomsPerRow: number) {
  const height = Math.ceil(quads[0].length / maxRoomsPerRow)
  return quads.map((quad) => padQuad(quad, height, maxRoomsPerRow))
}

// fill out empty spaces in a row
const padQuad = function(rooms: string[], height: number, width: number) {
  const quadArr: string[][] = []
  let i = 0
  for (let y = 0; y < height; y++) {
    const newArr = []
    for (let x = 0; x < width; x++) {
      newArr.push(rooms[i] || '-')
      i++
    }
    quadArr.push(newArr)
  }
  return quadArr
}

// build a new map array from quads
// this takes the chunks at -+ xy and reorganises them so that the empty space is on
// the outside. Then it creates a new 2d array
const placeQuadsInMap = function(quads: string[][][], width: number, height: number) {
  const q1 = quads[0].reverse().map((c) => c.reverse())
  const q2 = quads[1].reverse()
  const q3 = quads[2].map((c) => c.reverse())
  // place quads with space on edges [[-x,-y],[+x,-y],[-x,+y],[+x,+y]
  const organisedQuads = [
    [q1, q2],
    [q3, quads[3]],
  ]
  const midX = Math.floor(width / 2)
  const midY = Math.floor(height / 2)
  const newGrid: string[][] = []
  for (let y = 0; y < height; y++) {
    const newRow: string[] = []
    const oy = Math.floor(y / midY)
    for (let x = 0; x < width; x++) {
      const ox = Math.floor(x / midX)
      const nx = x - (ox * midX)
      const ny = y - (oy * midY)
      newRow.push(organisedQuads[oy][ox][ny][nx])
    }
    newGrid.push(newRow)
  }
  return newGrid
}

// make an empty array
const generateEmptyArray = function(width: number, height: number, defaultValue:any) {
  let arr:any[][] = []
  for (let y = 0; y < height; y++) {
    let row:any[] = []
    for (let x = 0; x < width; x++) {
      row.push(defaultValue)
    }
    arr.push(row)
  }
  return arr
}


const addToArrayIfNotAlreadyThere = function(array:any[], value:any) {
  if (array && array.includes(value)) return array
  else return [ ...array, value ]
}

/** for each room, get all the relationships
 * [
 *  0: y, x - 1,
 *  1: y, x + 1,
 *  2: y - 1, x,
 *  3: y + 1, x,
 * ] */
const adjacentRoomsFromMap = function(map: string[][]) {
  const height = map.length
  const width = map[0].length
  const adjacentMap: Vector[][][] = generateEmptyArray(width, height, [])
  map.forEach((row, y) => {
    row.forEach((col, x) => {
      // console.log(row[])
      /*
       [[x-1,y],[x+1,y],[x,y-1],[x,y+1], [...]]
      */
      if (x > 0) adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y, x - 1])
      if (x < width - 1) adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y, x + 1])
      if (y > 0) adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y - 1, x])
      if (y < height - 1) adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y + 1, x])
    })
  })
  return adjacentMap
}

const BuildDungeon = function(options: IDungeonOptions) {
  const map = []

  // create a series of empty rooms and distribute them in a grid split x+-/y+-
  const rooms = makeRooms(options.numberOfRooms)

  // now condense that grid based on the min grid size
  const quadArr: string[][][] = padQuads(roomsToQuad(rooms), options.maxRoomsWide)

  // now we know how big our map is going to be
  const mapHeight = quadArr[0].length * 2
  const mapWidth = quadArr[0][0].length * 2

  // get a new array of mapWidth x mapHeight with rooms placed from center outwards
  const quadMapArr = placeQuadsInMap(quadArr, mapWidth, mapHeight)

  // now figure out the adjacent rooms
  // const adjacentRoomMap = adjacentRoomsFromMap(quadMapArr)


  // the first row will be indicative of the largest size possible - rebuild the array and square it off


  return quadMapArr
}

// broken up to make debug easier
const BuildDungeonStage2 = function(quadMapArr: string[][], options: IDungeonOptions) {

  return adjacentRoomsFromMap(quadMapArr)
}

export { BuildDungeon, BuildDungeonStage2, IDungeonOptions }
