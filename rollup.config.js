import { terser } from "rollup-plugin-terser";

export default {
  input: "src/js.cookie.mjs",
  output: [
    // config for <script type = "module">
    {
      dir: "build",
      entryFileNames: "[name].min.mjs",
      format: "esm"
    },
    // config for <script nomodule>
    {
      dir: "build",
      name: "Cookies",
      entryFileNames: "[name].min.js",
      format: "umd"
    }
  ],
  // rollup-plugin-uglify only works with babel...
  plugins: [terser()]
};
