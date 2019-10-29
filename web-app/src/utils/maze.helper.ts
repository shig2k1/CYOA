// what this maze builder does is to pick a random cell in a grid and build a path to a dead end.
// then it walks back to the point at which it has a cell with an adjacent tile it hasn't built a route from
// and walks back from there - this is repeated until no unvisited cells remain

import SeededRandom from '../utils/seeded-rnd.helper'
import { Vector } from '@/types'

let rnd = new SeededRandom(123154)

type cell = [ number, number, number, number ]
// 1. place a random number of rooms in the available area
/* 
  
*/
function drawRoom(array: Array<cell>, coord:Vector, ) {
  

  return array
}


function placeRooms(array: Array<cell>, numberOfAttempts:number, minRoomSize:number, maxRoomSize:number) {
  // get random values for x and y
  let currentCell:Vector = [Math.floor(rnd.nextFloat()*array.length), Math.floor(rnd.nextFloat()*array[0].length)]
  array = drawRoom(array, currentCell)
  // select the range where a
  return array
}

function emptyArray(height:number, width:number, type:number) {
  let cells = new Array()
  for (let i=0; i<height; i++){
    cells[i] = new Array()
    for (let j=0; j<width; j++) {
      cells[i][j] = (type === 0) ? [0,0,0,0] : true
    }
  }
  return cells
}

// 2. attempt to flood-fill a corridor in the remaining space

function isRangeEmpty(arr:Array<Array<cell>>, start:Vector, end:Vector) {
  for (let y = start[0]; y < end[0]; y++) {
    for (let x = start[1]; x < end[1]; x++) {
      if (!arr[y][x]) return false
    }
  }
  return true
}

function newMaze(x:number, y:number, seed: number) {
  // create seeded randomiser for guaranteed random results :-)
  // establish variables and starting grid
  const totalCells = x*y
  let cells = emptyArray(y, x, 0)
  let unvis = emptyArray(y, x, 1)

  const maxAttempts = 40
  const roomMinSize = 3
  const roomMaxSize = 5
  const diff = roomMaxSize - roomMinSize
  const roomGap = 2
  let attempts = 0
  // place some rooms
  while (attempts < maxAttempts) {
    // get the important dimensions for a room
    const start:Vector = [Math.floor(rnd.nextFloat() * y), Math.floor(rnd.nextFloat() * x)]
    const width = roomMinSize + Math.floor(rnd.nextFloat() * diff)
    const height = roomMinSize + Math.floor(rnd.nextFloat() * diff)
    const end:Vector = [start[0] + height, start[1] + width] 
    // now check that the room doesn't extend into already used territory
    let room = Array() // <-- store the room coordinates
    let path = Array() // <-- store the path
    
    // if the range is outside the size of the array, or if it's been visited already, don't bother trying
    const startY = start[0] >= roomGap ? start[0] - roomGap : start[0]
    const endY = end[0] + roomGap < y ? end[0] + roomGap : end[0]
    const startX = start[1] >= roomGap ? start[1] - roomGap : start[1]
    const endX = end[1] + roomGap < x ? end[1] + roomGap : end[1]
    if (endY < y && endX < x && isRangeEmpty(unvis, [startY, startX], [endY, endX])) {
      console.log('build a room!', attempts, `${width} x ${height}`)
      for (let j = start[0]; j < end[0]; j++) {
        for (let i = start[1]; i < end[1]; i++) {
          let cell = [1, 1, 1, 1]
          // if first col
          if (j === 0) cell[0] = 0
          //else if (j === end[1]) cell[3] = 0
          // if first row
          //if (i === 0) cell[1] = 0
          // if last row
          //else if (i === end[0]) cell[2] = 0
          // mark cell as visited
          unvis[j][i] = false
          cells[j][i] = cell
        }
      }
    } else console.log('abandon', attempts)
    attempts += 1
  }



  // set a random position to start from
  let currentCell:any = [Math.floor(rnd.nextFloat()*y), Math.floor(rnd.nextFloat()*x)]
  // register starting point in path array
  let path = [currentCell]
  // mark coord as visited
  unvis[currentCell[0]][currentCell[1]] = false
  // start count of visited cells
  let visited = 1

  const noAttempts = 10
  const rMaxSize = 10
  const rMinSize = 4

  cells = placeRooms(cells, noAttempts, rMinSize, rMaxSize)

  // loop through all the available cell positions
  /*while(visited < totalCells) {
    // determine & store neighbouring cells
    // [*][^][*]
    // [<][o][>]
    // [*][v][*]
    const pot = [ // all surrounding cells - [x, y, axis-neighbour+direction axis-neighbour-direction]
      [currentCell[0]-1, currentCell[1], 0, 2], // top
      [currentCell[0], currentCell[1]+1, 1, 3], // right
      [currentCell[0]+1, currentCell[1], 2, 0], // bottom
      [currentCell[0], currentCell[1]-1, 3, 1]  // left
    ]
    let neighbours = new Array()
    // determine if each neighbouring cell is within the grid and whether it has already been checked
    for (let l=0; l < 4; l++){
      if(pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) neighbours.push(pot[l])
    }

    // if at least one active neighbour has been found
    if (neighbours.length) {
      // choose one of the neighbours at random
      let next = neighbours[Math.floor(rnd.nextFloat()*neighbours.length)]

      // remove the wall between the current cell and the chosen neighbouring cell
      cells[currentCell[0]][currentCell[1]][next[2]] = 1
      cells[next[0]][next[1]][next[3]] = 1
      
      // mark the neighbour as visited, and set it as the current cell
      unvis[next[0]][next[1]] = false
      visited++
      currentCell = [next[0], next[1]]
      path.push(currentCell)
    }
    // otherwise go back up a step and keep going
    else currentCell = path.pop()
  }*/
  return cells
}

export { newMaze }
