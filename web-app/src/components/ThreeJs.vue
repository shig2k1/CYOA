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
    // Set the scene size.
    const WIDTH = 200
    const HEIGHT = 200

    // Set some camera attributes.
    // const VIEW_ANGLE = 45
    // const ASPECT = WIDTH / HEIGHT
    // const NEAR = 0.1
    // const FAR = 10000

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

    let plane = new THREE.GridHelper(90, 30)
    this.$scene.add(plane)

    /*this.$camera =
      new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
      )
    */

    var aLight = new THREE.AmbientLight( 0xBBBBBB )

    var light = new THREE.DirectionalLight(0x999999, 1);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    light.position.set(-3, 1, 5);

    this.$scene.add(aLight)
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
    // Load a glTF resource
    loader.load( 'arcade-machine-1.glb', ( gltf ) => {
        this.$scene.add( gltf.scene );

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      },
      // called while loading is progressing
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened', error);

      }
    );

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
