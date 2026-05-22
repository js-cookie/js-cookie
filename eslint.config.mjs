import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'

const languageOptions = {
  globals: {
    ...globals.browser
  }
}
export default defineConfig([
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
  },
  {
    files: ['src/**/*.mjs'],
    rules: {
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ArrowFunctionExpression',
          message: 'Arrow functions are not ES5 compatible.'
        },
        {
          selector: 'VariableDeclaration[kind="const"]',
          message: 'const declarations are not ES5 compatible.'
        },
        {
          selector: 'VariableDeclaration[kind="let"]',
          message: 'let declarations are not ES5 compatible.'
        },
        {
          selector: 'TemplateLiteral',
          message: 'Template literals are not ES5 compatible.'
        },
        {
          selector: 'Property[shorthand=true]',
          message: 'Shorthand properties are not ES5 compatible.'
        },
        {
          selector: 'Property[method=true]',
          message: 'Shorthand method definitions are not ES5 compatible.'
        },
        {
          selector: 'CatchClause[param=null]',
          message: 'Optional catch binding is not ES5 compatible.'
        }
      ]
    }
  }
])
