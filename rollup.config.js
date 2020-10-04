import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import license from 'rollup-plugin-license'
import pkg from './package.json'

const licenseBanner = license({
  banner: {
    content: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */',
    commentStyle: 'none'
  }
})

export default [
  {
    input: 'src/api.mjs',
    output: [
      // config for <script type="module">
      {
        file: pkg.module,
        format: 'esm'
      },
      // config for <script nomodule>
      {
        file: pkg.unpkg.replace('.min.js', '.js'),
        format: 'umd',
        name: 'Cookies',
        noConflict: true,
        banner: ';'
      },
      // config for older Node.js versions
      {
        file: pkg.main,
        format: 'cjs'
      }
    ],
    plugins: [licenseBanner]
  },
  {
    input: 'src/api.mjs',
    output: [
      // config for <script type="module">
      {
        file: pkg.module.replace('.mjs', '.min.mjs'),
        format: 'esm'
      },
      // config for <script nomodule>
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'Cookies',
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
