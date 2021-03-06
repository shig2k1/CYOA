import { TILE_DIRECTIONS } from '@/enums'
import { Vector } from '@/types'

// generate a simple room for the specified dimensions
function buildRoom(width: number, height: number) {
  const arr: number[][] = []
  for (let y = 0; y < height; y++) {
    const _arr: number[] = []
    for (let x = 0; x < width; x++) {
      const tile = (y === 0) ?
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

function simpleHash(s: string) {
  /* Simple hash function. */
  let a = 1, c = 0, h, o;
  if (s) {
      a = 0;
      /*jshint plusplus:false bitwise:false*/
      for (h = s.length - 1; h >= 0; h--) {
          o = s.charCodeAt(h);
          a = (a << 6 & 268435455) + o + (o << 14);
          c = a & 266338304;
          a = c !== 0 ? a ^ c >> 21 : a;
      }
  }
  return String(a);
};

const ROOM_SEED = 'ABCDE'
const MIN_ROOM_SIZE = 4
const MAX_ROOM_SIZE = 15

/*
 build a series of rooms in a grid
  [ -------------- h/2 | w/2 ------------ ] | [ -------------- h/2 | w/2 ------------ ]
  ------------------------------------------|------------------------------------------
  [ -------------- h/2 | w/2 ------------ ] | [ -------------- h/2 | w/2 ------------ ]
*/
function seededRoom() {
  const roomhash = simpleHash(ROOM_SEED)
  const hashArr: number[] = `${roomhash}`.split('').map((a) => parseInt(a))

  // the number of rooms will be a sum of the hash
  const numberOfRooms = hashArr.reduce((p, c) => p + c, 0)

  // generate the rooms using an algorithm derived from the hash
  const rooms: Vector[] = []

  for (let i = 0; i < numberOfRooms; i++) {
    const width = parseInt(roomhash) * (i + 1)
    const height = parseInt(roomhash) * (i + 1)
    const ow = width % 3
    const oh = height % 3
    const rw = minMax(Math.floor(`${width}`.substring(ow, ow + 2).split('').reduce((p, c) => p + parseInt(c), 0)))
    const rh = minMax(Math.floor(`${height}`.substring(oh, oh + 2).split('').reduce((p, c) => p + parseInt(c), 0)))
    rooms.push([rw, rh])
  }

  // subdivide the map twice to get (4x4)x4 grid - gives an even distribution for building out a map
  const arr = subdivideArray(rooms).map((v: Vector[]) => subdivideArray(v))

  console.log(JSON.stringify(arr[0]), 2)

  // now work out the size of each chunk
  const t = arr.reduce((p, c) => {
    const b = c.reduce((_p, _c) => arrayDimensions(_c), [ 0, 0 ])
    return [ p[0] + b[0], p[1] + b[1] ]
  }, [ 0, 0 ])

  console.log(`width: ${t[0]} * height: ${t[1]}`)

  return `${numberOfRooms} rooms!`
}

function minMax(val: number) {
  if (val < MIN_ROOM_SIZE) val = MIN_ROOM_SIZE
  else if (val > MAX_ROOM_SIZE) val = MAX_ROOM_SIZE
  return val
}


function subdivideArray(arr: Vector[]) {
  const subArr: Vector[][] = [[], [], [], []]
  for (let i = 0, j = 0; i < arr.length; i++, j++) {
    subArr[j].push(arr[i])
    if (j === 3) j = -1;
  }
  return subArr
}

function arrayDimensions(arr: Vector[]): [ number, number ] {
  return arr.reduce((p, c) => [ p[0] + c[0], p[1] + c[1] ], [ 0, 0 ])
}

export { buildRoom, seededRoom }
