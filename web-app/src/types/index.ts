import Model from './model'

interface Dictionary<t> {
  [key: string]: t,
}

type Vector = [ number, number ]

interface Item  {
  id: string,
  name: string,
  description: string,
}

interface Door {
  sideA: Vector,
  sideB: Vector,
  locked: boolean,
  keyId: string, // <-- item id
}

interface Room {
  doors: Dictionary<Door>,
}

interface MapChunk {
  
}

interface MapTile {
  coords: Vector,
  room?: Dictionary<Room>,
  items?: Dictionary<Item>
  name?: string
}

export { Dictionary, Vector, MapChunk, MapTile, Item, Door, Room, Model }
