export default {
  input: "src/js.cookie.mjs",
  output: [
    // config for <script type="module">
    {
      dir: "build",
      entryFileNames: "[name].mjs",
      format: "esm"
    },
    // config for <script nomodule>
    {
      dir: "build",
      name: "Cookies",
      entryFileNames: "[name].js",
      format: "umd"
    }
  ]
};
