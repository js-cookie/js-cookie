/*global module */
module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        qunit: {
            files: ['test.html']
        },
        jshint: {
            options: {
                boss: true,
                browser: true,
                curly: false,
                devel: true,
                eqeqeq: false,
                eqnull: true,
                expr: true,
                evil: true,
                immed: false,
                laxcomma: true,
                newcap: false,
                noarg: true,
                smarttabs: true,
                sub: true,
                undef: true
            }
        }
    });

    // Travis CI task.
    grunt.registerTask('ci', 'qunit');
};
