<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'ThreeTest',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('container');

        const { innerWidth: w, innerHeight: h } = window;
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100000);
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(0, 0, 0);
        this.scene = new THREE.Scene();

        

        const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.8 )
        this.scene.add(ambientLight)

        //let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
        //let material = new Three.MeshNormalMaterial();

        //this.mesh = new Three.Mesh(geometry, material);
        //this.scene.add(this.mesh);

        // this.scene.add(this.camera)

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio || 1);

        container.appendChild(this.renderer.domElement);

        const loader = new GLTFLoader();
        /*loader.load(
          'arcade-machine-1.glb',
          ( gltf ) => {
            console.log(gltf)
            const object = gltf.scene
            this.scene.add( object );
            this.scene = gltf.scene;
            this.renderer.render(this.scene, this.camera)
          }, 
          // loader event
          ( xhr ) => {
            console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
          },
          // error loading
          ( err ) => {
            console.log(err)
          }
        )*/

        loader.load(
            'arcade-machine-1.gltf',
            ( gltf ) => {
                // called when the resource is loaded
                this.scene.add( gltf.scene );
            },
            ( xhr ) => {
                // called while loading is progressing
                console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
            },
            ( error ) => {
                // called when loading has errors
                console.error( 'An error happened', error );
            },
        );
        this.controls = new OrbitControls(this.camera, this.$el);
        this.controls.type = 'orbit';
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      //this.mesh.rotation.x += 0.01;
      //this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
      console.log('test')
    }
  },
  mounted() {
      this.init();
      this.animate();
  }
}
</script>

<style scoped type="scss">
  #container {
    width: 300px;
    height: 300px;
  }
</style>