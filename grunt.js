/*global module */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: '<json:cookie.jquery.json>',
		meta: {
			banner: '/*! <%= pkg.title %> v<%= pkg.version %> | <%= pkg.licenses[0].type %> */'
		},
		qunit: {
			files: ['test/index.html']
		},
		lint: {
			files: [
				'grunt.js',
				'jquery.cookie.js'
			]
		},
		jshint: {
			options: {
				boss: true,
				browser: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				expr: true,
				evil: true,
				newcap: true,
				noarg: true,
				undef: true
			},
			globals: {
				define: true,
				jQuery: true
			}
		},
		min: {
			dist: {
				src: ['<banner>', 'jquery.cookie.js'],
				dest: 'jquery.cookie-<%= pkg.version %>.min.js'
			}
		}
	});

	grunt.registerTask('default', 'lint qunit');

	// Travis CI task.
	grunt.registerTask('ci', 'default');
};
