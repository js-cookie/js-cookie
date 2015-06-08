/*jshint node:true */
exports.commonjs = {
	should_load_js_cookie: function (test) {
		test.expect(1);
		var Cookies = require('../src/js.cookie');
		test.ok(!!Cookies.get, 'should load the Cookies API');
		test.done();
	}
};
