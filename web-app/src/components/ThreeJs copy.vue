<template lang="pug">
  #canvas
    slot
</template>

<script>

import 'three'
import 'three/OrbitControls'
import 'three/GLTFLoader'

export default {
  data: () => ({
    $container: null,
    $scene: null,
    $renderer: null,
    $camera: null,
    $controls: null,
    entities: [] //<-- array to hold items
  }),

  methods: {
    addEntity (entity) {
      // keep reference
      this.entities.push (entity)
      // add to scene
      this.$scene.add(entity)
    },
    removeEntity (entity) {
      console.log('remove!')
      this.entities = [ ...this.entities.filter(e => e !== entity) ]
    }
  },

  mounted () {

    const { width, height } = this.$el.parentNode.getBoundingClientRect()
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

    this.$controls = new THREE.OrbitControls( this.$camera );
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
    var loader = new THREE.GLTFLoader();
    loader.crossOrigin = true

    //this.$controls.



    const loadImage = (imageUrl, coords, rotation = 0) => {

      // Load a glTF resource
      loader.load( imageUrl, ( gltf ) => {
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

    // build the room
    loadImage('room-corner.glb', [ 0, 0 ], 3)
    loadImage('room-middle.glb', [ 0, -1 ])
    loadImage('room-corner.glb', [ 0, -2 ])
    
    loadImage('room-middle.glb', [ 1, 0 ], 3)
    loadImage('room-center.glb', [ 1, -1 ])
    loadImage('room-middle.glb', [ 1, -2 ], 1)
  
    loadImage('room-corner.glb', [ 2, 0 ], 2)
    loadImage('room-middle.glb', [ 2, -1 ], 2)
    loadImage('room-corner.glb', [ 2, -2 ], 1)

    // load a sprite
    loadImage('arcade-machine-1.glb', [ 2, -2 ], 2)


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
