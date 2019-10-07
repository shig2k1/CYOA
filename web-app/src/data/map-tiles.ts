import { Model, Dictionary } from '@/types'
import { TILE_DIRECTIONS } from  '@/enums'

const MapTiles:Dictionary<Model> = {
  [TILE_DIRECTIONS.TOP_RIGHT]: { mesh: 'room-corner.glb', rotation: 0 },
  [TILE_DIRECTIONS.TOP_MIDDLE]: { mesh: 'room-middle.glb', rotation: 1 },
  [TILE_DIRECTIONS.TOP_LEFT]: { mesh: 'room-corner.glb', rotation: 1 },
  [TILE_DIRECTIONS.MIDDLE_RIGHT]: { mesh: 'room-middle.glb', rotation: 0 },
  [TILE_DIRECTIONS.MIDDLE_MIDDLE]: { mesh: 'room-center.glb', rotation: 0 },
  [TILE_DIRECTIONS.MIDDLE_LEFT]: { mesh: 'room-middle.glb', rotation: 2 },
  [TILE_DIRECTIONS.BOTTOM_RIGHT]: { mesh: 'room-corner.glb', rotation: 3 },
  [TILE_DIRECTIONS.BOTTOM_MIDDLE]: { mesh: 'room-middle.glb', rotation: 3 },
  [TILE_DIRECTIONS.BOTTOM_LEFT]: { mesh: 'room-corner.glb', rotation: 2 },
}

export default MapTiles
