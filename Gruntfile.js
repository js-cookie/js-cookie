/*jshint node:true, quotmark:single */
'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			all: {
				options: {
					httpBase: 'http://127.0.0.1:9998'
				},
				src: ['test/index.html', 'test/amd.html']
			}
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
			tests: 'test/**/*.js'
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
			},
			build: {
				files: {
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
			saucelabs: {
				options: {
					port: 9999,
					base: ['.', 'test']
				}
			},
			build: {
				options: {
					port: 9998,
					base: ['.', 'test']
				}
			},
			tests: {
				options: {
					port: 9998,
					base: ['.', 'test'],
					open: 'http://127.0.0.1:9998',
					keepalive: true,
					livereload: true
				}
			}
		},
		'saucelabs-qunit': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999'],
					testname: 'Sauce Test for js-cookie',
					build: process.env.TRAVIS_JOB_ID,
					pollInterval: 5000,
					browsers: [
						// iOS
						{
							browserName: 'iphone',
							platform: 'OS X 10.9',
							version: '7.1'
						},
						{
							browserName: 'ipad',
							platform: 'OS X 10.9',
							version: '7.1'
						},
						// Android
						{
							browserName: 'android',
							platform: 'Linux',
							version: '4.3'
						},
						// OS X
						{
							browserName: 'safari',
							platform: 'OS X 10.9',
							version: '7'
						},
						{
							browserName: 'safari',
							platform: 'OS X 10.8',
							version: '6'
						},
						{
							browserName: 'firefox',
							platform: 'OS X 10.9',
							version: '28'
						},
						// Windows
						{
							browserName: 'internet explorer',
							platform: 'Windows 8.1',
							version: '11'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 8',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '11'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '9'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '8'
						},
						{
							browserName: 'firefox',
							platform: 'Windows 7',
							version: '29'
						},
						{
							browserName: 'chrome',
							platform: 'Windows 7',
							version: '34'
						},
						// Linux
						{
							browserName: 'firefox',
							platform: 'Linux',
							version: '29'
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

	grunt.registerTask('saucelabs', ['connect:saucelabs', 'saucelabs-qunit']);
	grunt.registerTask('test', ['jshint', 'connect:build', 'qunit', 'nodeunit']);

	grunt.registerTask('dev', ['test', 'uglify', 'compare_size']);
	grunt.registerTask('ci', ['test', 'saucelabs']);

	grunt.registerTask('default', 'dev');
};
