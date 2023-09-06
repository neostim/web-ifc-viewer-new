import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'examples/web-ifc-viewer/gltf-export/app.js?version=f36af92',
  output: [
    {
      format: 'esm',
      file: 'examples/web-ifc-viewer/gltf-export/bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
};
