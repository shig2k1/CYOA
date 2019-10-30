import map from '@/api/map'
import router from '@/router'
import { Vector } from '@/types'
import { register } from 'register-service-worker'
import { colors } from 'vuetify/lib'

interface IDungeonOptions {
  numberOfRooms: number
  maxRoomsWide: number
}

function isEven (value: number) {
  return value % 2 === 0
}

function halve (value: number) {
  return value > 0 ? value / 2 : 0
}

function hasValue (map:any[][][], x:number, y:number) {
  return map[y] && map[y][x] && map[y][x].length > 0
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

// as name suggests, only adds value to an array if it doesn't find it already in there
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
      if (col === '-') return // ignore empty columns
      if (x > 0 && map[y][x - 1] !== '-') adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y, x - 1])
      if (x < width - 1 && map[y][x + 1] !== '-') adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y, x + 1])
      if (y > 0 && map[y - 1][x] !== '-') adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y - 1, x])
      if (y < height - 1 && map[y + 1][x] !== '-') adjacentMap[y][x] = addToArrayIfNotAlreadyThere(adjacentMap[y][x], [y + 1, x])
    })
  })
  return adjacentMap
}

// recurse the map and get a count of relationships for the supplied coords
const getCountFromArrayPosition = function(map: Vector[][][], x:number, y:number) {
  let count = 0
  map.forEach(row => {
    row.forEach(col => {
      if (col.length === 0) return
      else count += col.filter(val => val[0] === y && val[1] === x).length
    })
  })
  return count
}

// recurse the map and get all relationships for the supplied coords
const getRelatedCoordsFromArrayPosition = function(map: Vector[][][], x:number, y:number) {
  let coords:Vector[] = []
  map.forEach((row, _y) => {
    row.forEach((col, _x) => {
      if (col.length === 0) return
      else {
        col.forEach(val => { if (val[0] === y && val[1] === x) coords.push([_y, _x]) })
      }
    })
  })
  return coords
}

// get array map of relationship counts
const getRelationshipCountArray = function(map: Vector[][][]) {
  let newMap:number[][] = []

  map.forEach((row, y) => {
    let newRow:number[] = []
    row.forEach((col, x) => {
      newRow.push(getCountFromArrayPosition(map, x, y))
    })
    newMap.push(newRow)
  })

  return newMap
}


/**
 * Not all rooms are going to join up, but every room needs at least one connection.
 */
const createDoorsFromAdjacentRoomMap = function(map: Vector[][][]) {
  let newMap:Vector[][][] = []

  map.forEach((row, y) => {
    let newRow:Vector[][] = []
    row.forEach((col, x) => {
      let b = (Math.random() * 20) > 10
      let rel = getRelatedCoordsFromArrayPosition(map, x, y)
      if (rel.length > 0)
      newRow.push(rel.filter(v => true))

      if (b) newRow.push(col)
      
      //newRow.push(getRelatedCoordsFromArrayPosition(map, x, y))
    })
    newMap.push(newRow)
  })

  return newMap
}


const removeRoomLinkageOrNot = function (relationships: Vector[]) {

}

const selectivelyDeleteRoomLinkages = function (map: Vector[][][]) {
  // does the room have more than one relationship?

  // for each relationship

  // is this the last one? - are there any others?
  console.log('cell', map[2][4])

  let x = 4
  let y = 2

  // for this room, check all the connecting rooms
  map[y][x] = map[y][x].reduce((prev:Vector[], current:Vector) => {
    // get the number of connections excluding the current room; if it's more than zero, decide whether to remove this link or not...
    let adjacentRooms = map[current[0]][current[1]].filter(coords => !(coords[0] === y && coords[1] === x))
    if (adjacentRooms.length > 1) return [ ...prev ]
    else return [ ...prev, current ]
  }, [])

  // console.log(cell)

  return map
}

// this expands the array and shows the connections between rooms
// makes it easier to debug room link generation
const buildRoomConnectionsMap = function(map: Vector[][][]) {
  if (!map) return []
  let grid = []
  for (let y = 0; y < map.length * 2; y++) {
    let row = []
    for (let x = 0; x < map[0].length * 2; x++) {
      if (isEven(y) && isEven(x)) { //  both even = room row
        row.push(map[halve(y)][halve(x)])
      } else if (!isEven(y) && !isEven(x)) { // both odd = x
        row.push('x')
      } else { // mismatched = linkage
        // if x is even, the linkage is vertical
        // if x, y-1 & x, y+1 both have values, link them
        if (isEven(x) && hasValue(map, halve(x), halve(y-1)) && hasValue(map, halve(x), halve(y+1))) row.push('|')
        // if x is odd, the linkage is horizontal
        // if y, x+1 & y, x-1 both have values, link them
        else if (!isEven(x) && hasValue(map, halve(x-1), halve(y)) && hasValue(map, halve(x+1), halve(y))) row.push('-')
        else row.push('o')
      }
    }
    grid.push(row)
  }
  return grid
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

// broken up to make debug easier
const BuildDungeonStage3 = function(relationShipMap: Vector[][][], options: IDungeonOptions) {
  return getRelationshipCountArray(relationShipMap)
}

// broken up to make debug easier
const BuildDungeonStage4 = function(relationShipMap: Vector[][][], options: IDungeonOptions) {
  return buildRoomConnectionsMap(selectivelyDeleteRoomLinkages(relationShipMap))
}

export { BuildDungeon, BuildDungeonStage2, BuildDungeonStage3, BuildDungeonStage4, IDungeonOptions }
