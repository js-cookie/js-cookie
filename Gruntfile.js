/*jshint node:true */
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
		jshint: {
			options: {
				jshintrc: true
			},
			grunt: 'Gruntfile.js',
			source: 'src/**/*.js',
			tests: ['test/**/*.js', '!test/polyfill.js']
		},
		jscs: {
			options: {
				requireCommaBeforeLineBreak: true,
				requireLineFeedAtFileEnd: true,
				requireSemicolons: true,
				requireSpaceBeforeKeywords: ['else', 'while', 'catch'],
				requireSpaceAfterKeywords: true,
				requireSpaceAfterLineComment: true,
				requireSpaceBeforeBlockStatements: true,
				requireSpaceBeforeObjectValues: true,
				validateIndentation: '\t',
				validateLineBreaks: 'LF',
				validateQuoteMarks: true,
				disallowSpacesInsideArrayBrackets: 'all',
				disallowSpacesInsideParentheses: true,
				disallowTrailingWhitespace: true
			},
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
					pollInterval: 10000,
					statusCheckAttempts: 90,
					throttled: 3,
					browsers: (function () {
						var browsers = {
							'iOS': [{
								browserName: 'iphone',
								platform: 'OS X 10.10',
								version: '8.2',
								deviceName: 'iPhone Simulator'
							}, {
								browserName: 'iphone',
								platform: 'OS X 10.10',
								version: '8.2',
								deviceName: 'iPad Simulator'
							}],
							'android': [{
								browserName: 'android',
								platform: 'Linux',
								version: '5.1',
								deviceName: 'Android Emulator'
							}],
							'mac': [{
								browserName: 'safari',
								platform: 'OS X 10.10',
								version: '8.0'
							}, {
								browserName: 'safari',
								platform: 'OS X 10.11',
								version: '9.0'
							}, {
								browserName: 'safari',
								platform: 'OS X 10.11',
								version: '10.0'
							}, {
								browserName: 'safari',
								platform: 'OS X 10.12',
								version: '11.0'
							}, {
								browserName: 'firefox',
								platform: 'OS X 10.11',
								version: '56.0'
							}, {
								browserName: 'chrome',
								platform: 'OS X 10.10',
								version: '61.0'
							}],
							'windows7': [{
								browserName: 'internet explorer',
								platform: 'Windows 7',
								version: '11.0'
							}, {
								browserName: 'internet explorer',
								platform: 'Windows 7',
								version: '10.0'
							}, {
								browserName: 'internet explorer',
								platform: 'Windows 7',
								version: '9.0'
							}, {
								browserName: 'internet explorer',
								platform: 'Windows 7',
								version: '8.0'
							}],
							'linux': [{
								browserName: 'firefox',
								platform: 'Linux',
								version: '45.0'
							}, {
								browserName: 'chrome',
								platform: 'Linux',
								version: '48.0'
							}]
						};

						var matrix = [];
						for (var os in browsers) {
							matrix = matrix.concat(browsers[os]);
						}
						return matrix;
					}())
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

	grunt.registerTask('saucelabs', ['connect:build-sauce', 'saucelabs-qunit']);
	grunt.registerTask('test', ['uglify', 'jshint', 'jscs', 'connect:build-qunit', 'qunit', 'nodeunit']);

	grunt.registerTask('dev', ['test', 'compare_size']);
	grunt.registerTask('ci', ['test', 'saucelabs']);

	grunt.registerTask('default', 'dev');
};
