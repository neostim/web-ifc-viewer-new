import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "examples/web-ifc-three/ambient-oclussion/app.js",
  output: [
    {
      format: "esm",
      file: "examples/web-ifc-three/ambient-oclussion/bundle.js",
    },
  ],
  plugins: [resolve()],
};
