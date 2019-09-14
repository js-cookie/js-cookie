module.exports = function (grunt) {
  function encodingMiddleware (request, response, next) {
    const URL = require('url').URL
    var url = new URL(request.url, 'http://localhost')

    if (url.pathname !== '/encoding') {
      next()
      return
    }

    var cookieName = url.searchParams.get('name')
    var cookieValue = url.searchParams.get('value')

    response.setHeader('content-type', 'application/json')
    response.end(
      JSON.stringify({
        name: cookieName,
        value: cookieValue
      })
    )
  }

  grunt.initConfig({
    qunit: {
      all: {
        options: {
          urls: [
            'http://127.0.0.1:9998/',
            'http://127.0.0.1:9998/module.html',
            'http://127.0.0.1:9998/encoding.html?integration_baseurl=http://127.0.0.1:9998/'
          ]
        }
      }
    },
    nodeunit: {
      all: 'test/node.js'
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
        'dist/js.cookie.min.mjs',
        'dist/js.cookie.min.js',
        'src/js.cookie.mjs'
      ],
      options: {
        compress: {
          gz: function (fileContents) {
            return require('gzip-js').zip(fileContents, {}).length
          }
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
      rollup: './node_modules/.bin/rollup -c',
      lint: './node_modules/.bin/standard',
      format:
        './node_modules/.bin/prettier -l --write --single-quote --no-semi "**/*.{html,js,json,md,mjs}" && ./node_modules/.bin/eslint "**/*.{html,md}" --fix && ./node_modules/.bin/standard --fix',
      'browserstack-runner': 'node_modules/.bin/browserstack-runner --verbose'
    }
  })

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) {
      grunt.loadNpmTasks(key)
    }
  }

  grunt.registerTask('test', [
    'exec:lint',
    'exec:rollup',
    'connect:build-qunit',
    'qunit',
    'nodeunit'
  ])
  grunt.registerTask('browserstack', [
    'exec:rollup',
    'exec:browserstack-runner'
  ])

  grunt.registerTask('dev', ['exec:format', 'test', 'compare_size'])

  grunt.registerTask('default', 'dev')
}
