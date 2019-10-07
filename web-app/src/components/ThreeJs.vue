<template lang="pug">
  #canvas
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { createProxy } from 'vuex-class-component'

// import the store and required map module
import { store } from '../store'
import MapStore from '../store/modules/map.store'

import { Vector, MapTile, Model } from '../types'
import { MAP_CHUNK_SIZE, MAP_GRID_SIZE, MAP_HCHUNK_SIZE, MAP_HGRID_SIZE } from '../config'
import { chunkLocalCoords, chunkOffset, getMaxMinGridRange, getChunksForRange, visibleOrigin } from '../utils/map.helper'
import { buildRoom, seededRoom } from '../utils/room.helper'

import { TILE_DIRECTIONS } from '../enums'
import { MapTiles } from '../data'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@Component
export default class GameMap extends Vue {
  $container: any
  $scene: any
  $renderer: any
  $camera: any
  $controls: any
  $loader: any
  entities: any = [] //<-- array to hold items


  addEntity (entity) {
    // keep reference
    this.entities.push (entity)
    // add to scene
    this.$scene.add(entity)
  }

  removeEntity (entity) {
    console.log('remove!')
    this.entities = [ ...this.entities.filter(e => e !== entity) ]
  }

  drawModel(name:TILE_DIRECTIONS, coords:Vector) {
    let model = MapTiles[`r_${name}`]
    if (model) this.loadImage(model.mesh, coords, model.rotation)
  }

  loadImage(imageUrl:string, coords:Vector, rotation:number = 0) {

    // Load a glTF resource
    this.$loader.load( imageUrl, ( gltf ) => {
      //this.$scene.add( gltf.scene );

      const x = coords[0] * 2
      const y = coords[1] * 2
  
      const pos = new THREE.Vector3( y, 0, x );

      const model = gltf.scene.children[ 0 ];
      model.position.copy( pos );
      model.rotation.y =  (Math.PI / 2) * rotation

      this.$scene.add(model)
    },
    // called while loading is progressing
    function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

      console.log( 'An error happened', error);

    });
  }

  mounted () {

    const { width, height } = (this.$el.parentNode as any).getBoundingClientRect()
    // Set the scene size.
    const WIDTH = width
    const HEIGHT = height

    // Get the DOM element to attach to
    this.$container = this.$el

    // Create a WebGL renderer, camera
    // and a scene
    this.$renderer = new THREE.WebGLRenderer()
   
    this.$scene = new THREE.Scene()

    var aspect = WIDTH / HEIGHT
    var d = 10;
    this.$camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );

    this.$camera.position.set( 120, 120, 120 ); // all components equal
    this.$camera.lookAt( this.$scene.position ); // or the origin

    this.$controls = new OrbitControls( this.$camera );
    this.$controls.update()

    // var light = new THREE.AmbientLight( 0xBBBBBB )

    var light = new THREE.DirectionalLight(0x999999, 1);
    //light.castShadow = true;
    //light.shadowCameraVisible = true;
    light.position.set(-3, 5, 3);

    // this.$scene.add(aLight)
    this.$scene.add(light)

    this.$camera.position.z = 50

    // Add the camera to the scene.
    this.$scene.add(this.$camera)

    // Start the renderer.
    this.$renderer.setSize(WIDTH, HEIGHT)

    // Attach the renderer-supplied
    // DOM element.
    this.$container.appendChild(this.$renderer.domElement)

    // Instantiate a loader
    this.$loader = new GLTFLoader();
    //loader.crossOrigin = true

    //this.$controls.
    let plane = new THREE.GridHelper(90, 30)
    this.$scene.add(plane)

    // draw a room

    /*this.drawModel(TILE_DIRECTIONS.TOP_RIGHT, [ 3,-3 ])

    this.drawModel(TILE_DIRECTIONS.TOP_RIGHT, [ -1,-1 ])
    this.drawModel(TILE_DIRECTIONS.TOP_MIDDLE, [ 0,-1 ])
    this.drawModel(TILE_DIRECTIONS.TOP_LEFT, [ 1,-1 ])
    this.drawModel(TILE_DIRECTIONS.MIDDLE_RIGHT, [ -1,0 ])
    this.drawModel(TILE_DIRECTIONS.MIDDLE_MIDDLE, [ 0,0 ])
    this.drawModel(TILE_DIRECTIONS.MIDDLE_LEFT, [ 1,0 ])
    this.drawModel(TILE_DIRECTIONS.BOTTOM_RIGHT, [ -1,1 ])
    this.drawModel(TILE_DIRECTIONS.BOTTOM_MIDDLE, [ 0,1 ])
    this.drawModel(TILE_DIRECTIONS.BOTTOM_LEFT, [ 1,1 ])*/

        
    let arr = buildRoom(4, 4)

    let offset = -(arr.length / 2)

    for (let y = 0, y2 = offset; y < arr.length; y++, y2++) {
      for (let x = 0, x2 = offset; x < arr[y].length; x++, x2++) {
        this.drawModel(arr[y][x], [ x2, y2 ])
      }
    }

    console.log(seededRoom())

    // build the room
    /*loadImage('room-corner.glb', [ 0, 0 ], 3)
    loadImage('room-middle.glb', [ 0, -1 ])
    loadImage('room-corner.glb', [ 0, -2 ])
    
    loadImage('room-middle.glb', [ 1, 0 ], 3)
    loadImage('room-center.glb', [ 0, 0 ])
    loadImage('room-middle.glb', [ 1, -2 ], 1)
  
    loadImage('room-corner.glb', [ 2, 0 ], 2)
    loadImage('room-middle.glb', [ 2, -1 ], 2)
    loadImage('room-corner.glb', [ 2, -2 ], 1)

    // load a sprite
    loadImage('arcade-machine-1.glb', [ 2, -2 ], 2)*/


    const animate = () => {
      requestAnimationFrame(animate)
      //cube.rotation.x += 0.05
      //cube.rotation.y += 0.05
      this.$controls.update()
      this.$renderer.render(this.$scene, this.$camera)

      /*if (this.$children) {
        this.$children.forEach(child => {
          child.animate()
        })
      }*/
    }
    animate()
  }
}
</script>
