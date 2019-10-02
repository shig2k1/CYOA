const path = require('path')
const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
        'three/OBJLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/OBJLoader.js'),
        'three/MTLLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/MTLLoader.js'),
        'three/GLTFLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/GLTFLoader.js'),
      },
      extensions: ['.js', '.vue']
    },
    plugins: [
      new webpack.ProvidePlugin({
        'THREE': 'three'
      })
    ]
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
}
