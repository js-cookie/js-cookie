/*jshint node:true */
exports.node = {
	should_load_js_cookie: function(test) {
		test.expect(4);
		var Cookies = require('../src/js.cookie');

		test.ok( !!Cookies.get, 'should expose get api' );
		test.ok( !!Cookies.set, 'should expose set api' );
		test.ok( !!Cookies.remove, 'should expose remove api' );
		test.ok( !!Cookies.noConflict, 'should expose noConflict api' );

		test.done();
	}
};
