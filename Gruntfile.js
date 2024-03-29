/* eslint-env node */
function encodingMiddleware(request, response, next) {
  const URL = require('url').URL
  const url = new URL(request.url, 'http://localhost')

  if (url.pathname !== '/encoding') {
    next()
    return
  }

  const cookieName = url.searchParams.get('name')
  const cookieValue = url.searchParams.get('value')

  response.setHeader('content-type', 'application/json')
  response.end(
    JSON.stringify({
      name: cookieName,
      value: cookieValue
    })
  )
}

const config = {
  qunit: {
    options: {
      puppeteer: {
        headless: 'new'
      },
      inject: [
        'test/fix-qunit-reference.js', // => https://github.com/gruntjs/grunt-contrib-qunit/issues/202
        'node_modules/grunt-contrib-qunit/chrome/bridge.js'
      ]
    },
    all: {
      options: {
        urls: [
          'http://127.0.0.1:9998/',
          'http://127.0.0.1:9998/sub',
          'http://127.0.0.1:9998/module.html',
          'http://127.0.0.1:9998/encoding.html?integration_baseurl=http://127.0.0.1:9998/'
        ]
      }
    }
  },
  watch: {
    options: {
      livereload: true
    },
    files: ['src/**/*.mjs', 'test/**/*.js'],
    tasks: 'default'
  },
  compare_size: {
    files: [
      'dist/js.cookie.mjs',
      'dist/js.cookie.min.mjs',
      'dist/js.cookie.js',
      'dist/js.cookie.min.js'
    ],
    options: {
      compress: {
        gz: (fileContents) => require('gzip-js').zip(fileContents, {}).length
      }
    }
  },
  connect: {
    'build-qunit': {
      options: {
        port: 9998,
        base: ['.', 'test'],
        middleware: function (connect, options, middlewares) {
          middlewares.unshift(encodingMiddleware)
          return middlewares
        }
      }
    },
    tests: {
      options: {
        port: 10000,
        base: ['.', 'test'],
        open: 'http://127.0.0.1:10000',
        keepalive: true,
        livereload: true,
        middleware: function (connect, options, middlewares) {
          middlewares.unshift(encodingMiddleware)
          return middlewares
        }
      }
    }
  },
  exec: {
    format: 'npm run format',
    lint: 'npm run lint',
    rollup: 'npx rollup -c',
    'test-node': 'npx qunit test/node.js',
    'browserstack-runner': 'node_modules/.bin/browserstack-runner --verbose'
  }
}

module.exports = function (grunt) {
  grunt.initConfig(config)

  // Load dependencies
  Object.keys(grunt.file.readJSON('package.json').devDependencies)
    .filter((key) => key !== 'grunt' && key.startsWith('grunt'))
    .forEach(grunt.loadNpmTasks)

  grunt.registerTask('test', [
    'exec:rollup',
    'connect:build-qunit',
    'qunit',
    'exec:test-node'
  ])
  grunt.registerTask('browserstack', [
    'exec:rollup',
    'exec:browserstack-runner'
  ])
  grunt.registerTask('dev', [
    'exec:format',
    'exec:lint',
    'test',
    'compare_size'
  ])
  grunt.registerTask('default', 'dev')
}
