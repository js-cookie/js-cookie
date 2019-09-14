import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import license from 'rollup-plugin-license'

const licenseBanner = license({
  banner: {
    content: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */',
    commentStyle: 'none'
  }
})

export default [
  {
    input: 'src/js.cookie.mjs',
    output: [
      // config for <script type="module">
      {
        dir: 'dist',
        entryFileNames: '[name].mjs',
        format: 'esm'
      },
      // config for <script nomodule>
      {
        dir: 'dist',
        name: 'Cookies',
        entryFileNames: '[name].js',
        format: 'umd',
        noConflict: true,
        banner: ';'
      }
    ],
    plugins: [licenseBanner]
  },
  {
    input: 'src/js.cookie.mjs',
    output: [
      // config for <script type="module">
      {
        dir: 'dist',
        entryFileNames: '[name].min.mjs',
        format: 'esm'
      },
      // config for <script nomodule>
      {
        dir: 'dist',
        name: 'Cookies',
        entryFileNames: '[name].min.js',
        format: 'umd',
        noConflict: true
      }
    ],
    plugins: [
      terser(),
      licenseBanner, // must be applied after terser, otherwise it's being stripped away...
      filesize()
    ]
  }
]
