import map from '@/api/map'

interface IDungeonOptions {
  numberOfRooms: number
  maxRoomsWide: number
}

const ALPHA = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8']

// generate an array of rooms
const makeRooms = function (numberOfRooms:number) {
  let output = []
  for (let i=0; i<numberOfRooms; i++) {
    output.push(ALPHA[i])
  }
  return output
}

// split array of rooms into quad to represent +/- xy
const roomsToQuad = function(rooms:string[]) {
  let grid:any = [[],[],[],[]]
  for (let i = 0, j = 0; i < rooms.length; i++, j++) {
    if (j === grid.length) j = 0
    grid[j].push(rooms[i])
  }
  return grid
}

// fill out empty space in cols/rows of quads to even it out
const padQuads = function (quads:string[][], maxRoomsPerRow:number) {
  let height = Math.ceil(quads[0].length / maxRoomsPerRow)
  return quads.map(quad => padQuad(quad, height, maxRoomsPerRow))
}

const padQuad = function (rooms:string[], height:number, width:number) {
  let quadArr:string[][] = []
  let i = 0
  for (let y = 0; y < height; y++) {
    let newArr = []
    for (let x = 0; x < width; x++) {
      newArr.push(rooms[i] || '-')
      i++
    }
    quadArr.push(newArr)
  }
  return quadArr
}

// halve the map and return
const halveMapQuads = function (quads:string[][][]) {
  let half = Math.floor(quads.length / 2)
  return [
    quads.slice(half, quads.length),
    quads.slice(0, half)
  ]
}

// build a new map array from quads
const placeQuadsInMap = function(quads:string[][][], width: number, height: number) {
  let q1 = quads[0].reverse().map(c => c.reverse())
  let q2 = quads[1].reverse()
  let q3 = quads[2].map(c => c.reverse())
  // place quads with space on edges
  let organisedQuads = [
    [q1,q2],
    [q3,quads[3]]
  ]
  let midX = Math.floor(width / 2)
  let midY = Math.floor(height / 2)
  let newGrid:string[][] = []
  for (let y = 0; y<height; y++) {
    let newRow:string[] = []
    let oy = Math.floor(y / midY)
    for (let x = 0; x < width; x++) {
      let ox = Math.floor(x / midX)
      let nx = x - (ox * midX)
      let ny = y - (oy * midY)
      newRow.push(organisedQuads[oy][ox][ny][nx])
    }
    newGrid.push(newRow)
  }
  return newGrid
}

const BuildDungeon = function (options: IDungeonOptions) {
  let map = []

  // create a series of empty rooms and distribute them in a grid split x+-/y+-
  let rooms = makeRooms(options.numberOfRooms)
  
  // now condense that grid based on the min grid size
  let quadArr:string[][][] = padQuads(roomsToQuad(rooms), options.maxRoomsWide)

  // now we know how big our map is going to be
  let mapHeight = quadArr[0].length * 2
  let mapWidth = quadArr[0][0].length * 2

  let quadMapArr = placeQuadsInMap(quadArr, mapWidth, mapHeight)
  // now we have a 2x2 grid representing x & y
  // grid[0][0] = -x,-y
  // grid[0][1] = +x,-y
  // grid[1][0] = -x,+y
  // grid[1][1] = +x,+y

  // the first row will be indicative of the largest size possible - rebuild the array and square it off

  
  return quadMapArr
}


export { BuildDungeon, IDungeonOptions }