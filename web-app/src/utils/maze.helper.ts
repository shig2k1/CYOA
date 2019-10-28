// what this maze builder does is to pick a random cell in a grid and build a path to a dead end.
// then it walks back to the point at which it has a cell with an adjacent tile it hasn't built a route from
// and walks back from there 

import SeededRandom from '../utils/seeded-rnd.helper'

function newMaze(x:number, y:number, seed: number) {
  // create seeded randomiser for guaranteed random results :-)
  let rnd = new SeededRandom(seed)
  
  // establish variables and starting grid
  const totalCells = x*y
  let cells = new Array()
  let unvis = new Array()
  for (let i=0; i<y; i++){
    cells[i] = new Array()
    unvis[i] = new Array()
    for (let j=0; j<x; j++) {
      cells[i][j] = [0,0,0,0]
      unvis[i][j] = true
    }
  }

  // set a random position to start from
  let currentCell:any = [Math.floor(rnd.nextFloat()*y), Math.floor(rnd.nextFloat()*x)]
  // register starting point in path array
  let path = [currentCell]
  // mark coord as visited
  unvis[currentCell[0]][currentCell[1]] = false
  // start count of visited cells
  let visited = 1

  // loop through all the available cell positions
  while(visited < totalCells) {
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
  }

  console.log(JSON.stringify(path))

  console.log(JSON.stringify(cells))
  return cells
}

export { newMaze }
