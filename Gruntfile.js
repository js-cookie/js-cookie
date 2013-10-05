/*jshint node: true */

'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			all: ['test/index.html']
		},
		jshint: {
			files: [
				'Gruntfile.js',
				'jquery.cookie.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
			},
			build: {
				files: {
					'build/jquery.cookie-<%= pkg.version %>.min.js': 'jquery.cookie.js'
				}
			}
		},
		watch: {
			files: [
				'jquery.cookie.js',
				'test/tests.js'
			],
			tasks: 'default'
		},
		compare_size: {
			files: [
				'build/jquery.cookie-<%= pkg.version %>.min.js',
				'jquery.cookie.js'
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
			server: {
				options: {
					base: '.',
					directory: 'test',
					port: 9999
				}
			}
		},
		'saucelabs-qunit': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999/test/index.html'],
					tunnelTimeout: 5,
					build: process.env.TRAVIS_JOB_ID,
					concurrency: 3,
					browsers: [
						{
							browserName: 'safari',
							platform: 'OS X 10.8'
						},
						{
							browserName: 'firefox',
							platform: 'Windows 7'
						},
						{
							browserName: 'firefox',
							platform: 'Windows XP'
						},
						{
							browserName: 'firefox',
							platform: 'Linux'
						},
						{
							browserName: 'chrome',
							platform: 'Windows 7'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 8',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '9'
						}
					],
					testname: 'jquery.cookie qunit tests'
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

	grunt.registerTask('default', ['jshint', 'qunit', 'uglify', 'compare_size']);
	grunt.registerTask('saucelabs', ['connect', 'saucelabs-qunit']);
	grunt.registerTask('ci', ['jshint', 'qunit', 'saucelabs']);
};
