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
			'build-sauce': {
				options: {
					port: 9999,
					base: ['.', 'test']
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
		'saucelabs-qunit': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999'],
					testname: 'Sauce Test for js-cookie',
					build: process.env.TRAVIS_JOB_ID,
					statusCheckAttempts: -1,
					throttled: 3,
					browsers: [
						{
							browserName: 'safari',
							platform: 'macOS 10.13',
							version: '12.0'
						},
						{
							browserName: 'safari',
							platform: 'macOS 10.13',
							version: '11.1'
						},
						{
							browserName: 'firefox',
							platform: 'macOS 10.13',
							version: '65.0'
						},
						{
							browserName: 'chrome',
							platform: 'macOS 10.13',
							version: '72.0'
						},
						{
							browserName: 'safari',
							platform: 'macOS 10.12',
							version: '11.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 10',
							version: '11.285'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '11.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '10.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '9.0'
						},
						{
							browserName: 'firefox',
							platform: 'Linux',
							version: '45.0'
						},
						{
							browserName: 'chrome',
							platform: 'Linux',
							version: '48.0'
						}
					]
				}
			}
		}
	});

	// Loading dependencies
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) {
			grunt.loadNpmTasks(key);
		}
	}

	grunt.registerTask('test', ['uglify', 'eslint', 'connect:build-qunit', 'qunit', 'nodeunit']);
	grunt.registerTask('saucelabs', ['uglify', 'connect:build-sauce', 'saucelabs-qunit']);

	grunt.registerTask('dev', ['test', 'compare_size']);

	grunt.registerTask('default', 'dev');
};
