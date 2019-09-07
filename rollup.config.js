import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import license from "rollup-plugin-license";

export default [
  {
    input: "src/js.cookie.mjs",
    output: [
      // config for <script type="module">
      {
        dir: "dist",
        entryFileNames: "[name].mjs",
        format: "esm"
      },
      // config for <script nomodule>
      {
        dir: "dist",
        name: "Cookies",
        entryFileNames: "[name].js",
        format: "umd"
      }
    ]
  },
  {
    input: "src/js.cookie.mjs",
    output: [
      // config for <script type="module">
      {
        dir: "dist",
        entryFileNames: "[name].min.mjs",
        format: "esm"
      },
      // config for <script nomodule>
      {
        dir: "dist",
        name: "Cookies",
        entryFileNames: "[name].min.js",
        format: "umd"
      }
    ],
    plugins: [
      terser(),
      license({
        banner: {
          content:
            "/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */",
          commentStyle: "none"
        }
      }),
      filesize()
    ]
  }
];
