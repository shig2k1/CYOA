type Dictionary<t> = {
  [key: string] : t
}

type Vector = [ number, number ]

type Item = {
  id: string,
  name: string,
  description: string
}

type Door = {
  sideA: Vector,
  sideB: Vector,
  locked: boolean,
  keyId: string // <-- item id
}

type Room = {
  doors: Dictionary<Door>
}

type MapTile = {
  coords: Vector,
  room: Dictionary<Room>
}

export { Dictionary, Vector, MapTile, Item, Door, Room }
