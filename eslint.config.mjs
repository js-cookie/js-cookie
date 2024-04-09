import globals from 'globals'
import js from '@eslint/js'

const languageOptions = {
  globals: {
    ...globals.browser
  }
}
export default [
  {
    ignores: ['dist/*']
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
    ignores: ['examples/**/src/*.js'],
    languageOptions: {
      ...languageOptions,
      sourceType: 'commonjs'
    }
  },
  {
    ...js.configs.recommended,
    files: ['**/*.mjs'],
    languageOptions: {
      ...languageOptions,
      ecmaVersion: 2021
    }
  }
]
