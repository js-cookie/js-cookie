import { terser } from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import pkg from "./package.json";

export default {
  input: "src/js.cookie.mjs",
  output: [
    // config for <script type="module">
    {
      dir: "build",
      entryFileNames: "[name].min.mjs",
      format: "esm"
    },
    {
      dir: "build",
      entryFileNames: `[name]-${pkg.version}.min.mjs`,
      format: "esm"
    },
    // config for <script nomodule>
    {
      dir: "build",
      name: "Cookies",
      entryFileNames: "[name].min.js",
      format: "umd"
    },
    {
      dir: "build",
      name: "Cookies",
      entryFileNames: `[name]-${pkg.version}.min.js`,
      format: "umd"
    }
  ],
  // rollup-plugin-uglify only works with babel...
  plugins: [
    terser(),
    license({
      banner: {
        content:
          "/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */",
        commentStyle: "none"
      }
    })
  ]
};
