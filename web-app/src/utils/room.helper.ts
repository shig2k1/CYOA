import { TILE_DIRECTIONS } from '@/enums'
import { Vector } from '@/types'

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

function simpleHash (s:string) {
  /* Simple hash function. */
  var a = 1, c = 0, h, o;
  if (s) {
      a = 0;
      /*jshint plusplus:false bitwise:false*/
      for (h = s.length - 1; h >= 0; h--) {
          o = s.charCodeAt(h);
          a = (a<<6&268435455) + o + (o<<14);
          c = a & 266338304;
          a = c!==0?a^c>>21:a;
      }
  }
  return String(a);
};

const ROOM_SEED = 'ABCDE234eds'

/*
 build a series of rooms in a grid
  [ -------------- h/2 | w/2 ------------ ] | [ -------------- h/2 | w/2 ------------ ]
  ------------------------------------------|------------------------------------------
  [ -------------- h/2 | w/2 ------------ ] | [ -------------- h/2 | w/2 ------------ ]
*/
function seededRoom () {
  const roomhash = simpleHash(ROOM_SEED)
  const hashArr:number[] = `${roomhash}`.split('').map(a => parseInt(a))
  
  // the number of rooms will be a sum of the hash
  const numberOfRooms = hashArr.reduce((p, c) => p + c, 0)

  // generate the rooms using an algorithm derived from the hash
  let rooms:Vector[] = []

  for (let i = 0; i < numberOfRooms; i++) {
    let width = parseInt(roomhash) * (i + 1)
    let height = parseInt(roomhash) * (i + 2)
    let ow = width % 3
    let oh = height % 3
    let rw = `${width}`.replace('0', `1`).substring(ow, ow + 3).split('').reduce((p, c) => p + parseInt(c), 0)
    let rh = `${height}`.replace('0', `1`).substring(oh, oh + 3).split('').reduce((p, c) => p + parseInt(c), 0)
    rooms.push([rw, rh])
  }

  // subdivide the map twice to get (4x4)x4 grid - gives an even distribution for building out a map
  let arr = subdivideArray(rooms).map((v:Vector[]) => subdivideArray(v))
  // now work out the size of each chunk
  let t = arr.reduce((p, c) => { 
    let b = c.reduce((_p, _c) => arrayDimensions(_c), [ 0, 0 ])
    return [ p[0] + b[0], p[1] + b[1] ]
  }, [ 0, 0 ])

  console.log(`width: ${t[0]} * height: ${t[1]}`)

  return `${numberOfRooms} rooms!`
}


function subdivideArray(arr:Vector[]) {
  let subArr:Vector[][] = [[],[],[],[]]
  for (let i = 0, j = 0; i < arr.length; i++, j++) {
    subArr[j].push(arr[i])
    if (j === 3) j = -1;
  }
  return subArr
}

function arrayDimensions(arr:Vector[]): [ number, number ] {
  return arr.reduce((p, c) => [ p[0] + c[0], p[1] + c[1] ], [ 0, 0 ])
}

export { buildRoom, seededRoom }
