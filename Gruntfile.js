/* eslint-env node */
'use strict';

module.exports = function (grunt) {

	function encodingMiddleware(request, response, next) {
		var url = require('url').parse(request.url, true, true);
		var query = url.query;
		var pathname = url.pathname;

		if (pathname !== '/encoding') {
			next();
			return;
		}

		var cookieName = query.name;
		var cookieValue = query.value;

		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify({
			name: cookieName,
			value: cookieValue
		}));
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			all: {
				options: {
					urls: [
						'http://127.0.0.1:9998/',
						'http://127.0.0.1:9998/amd.html',
						'http://127.0.0.1:9998/environment-with-amd-and-umd.html',
						'http://127.0.0.1:9998/encoding.html?integration_baseurl=http://127.0.0.1:9998/'
					]
				}
			},
		},
		nodeunit: {
			all: 'test/node.js'
		},
		eslint: {
			grunt: 'Gruntfile.js',
			source: 'src/**/*.js',
			tests: ['test/**/*.js', '!test/polyfill.js']
		},
		uglify: {
			options: {
				compress: {
					unsafe: true
				},
				screwIE8: false,
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
			},
			build: {
				files: {
					'build/js.cookie.min.js': 'src/js.cookie.js',
					'build/js.cookie-<%= pkg.version %>.min.js': 'src/js.cookie.js'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			files: '{src,test}/**/*.js',
			tasks: 'default'
		},
		compare_size: {
			files: [
				'build/js.cookie-<%= pkg.version %>.min.js',
				'src/js.cookie.js'
			],
			options: {
				compress: {
					gz: function (fileContents) {
						return require('gzip-js').zip(fileContents, {}).length;
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
						middlewares.unshift(encodingMiddleware);
						return middlewares;
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
						middlewares.unshift(encodingMiddleware);
						return middlewares;
					}
				}
			}
		},
		exec: {
			'browserstack-runner': 'node_modules/.bin/browserstack-runner --verbose'
		}
	});

	// Loading dependencies
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) {
			grunt.loadNpmTasks(key);
		}
	}

	grunt.registerTask('test', ['uglify', 'eslint', 'connect:build-qunit', 'qunit', 'nodeunit']);
	grunt.registerTask('browserstack', ['uglify', 'exec:browserstack-runner']);

	grunt.registerTask('dev', ['test', 'compare_size']);

	grunt.registerTask('default', 'dev');
};
