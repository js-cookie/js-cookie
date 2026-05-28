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
  // NOTE: we are not transpiling the distributed modules, therefore must
  // refrain from using certain ES syntax not supported by IE/ES5. The rules
  // specified here do not provide full coverage, only for the most prominent
  // features that aren't ES5..
  {
    files: ['src/**/*.mjs'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ArrowFunctionExpression',
          message: 'Arrow functions are not ES5 compatible.'
        },
        {
          selector: 'CatchClause[param=null]',
          message: 'Optional catch bindings are not ES5 compatible.'
        },
        {
          selector: 'ForOfStatement',
          message: 'for...of loops are not ES5 compatible.'
        },
        {
          selector: 'Property[method=true]',
          message: 'Shorthand method definitions are not ES5 compatible.'
        },
        {
          selector: 'Property[shorthand=true]',
          message: 'Shorthand properties are not ES5 compatible.'
        },
        {
          selector: 'TemplateLiteral',
          message: 'Template literals are not ES5 compatible.'
        },
        {
          selector: 'VariableDeclaration[kind="let"]',
          message: 'let declarations are not ES5 compatible.'
        },
        {
          selector: 'VariableDeclaration[kind="const"]',
          message: 'const declarations are not ES5 compatible.'
        }
      ],
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }]
    }
  }
])
