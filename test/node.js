/* eslint-env node */
exports.node = {
	should_load_js_cookie: function (test) {
		test.expect(1);
		var Cookies = require('../src/js.cookie');
		test.ok(!!Cookies.get, 'should load the Cookies API');
		test.done();
	},
	should_not_throw_error_for_set_call_in_node: function (test) {
		test.expect(0);
		var Cookies = require('../src/js.cookie');
		Cookies.set('anything');
		Cookies.set('anything', { path: '' });
		test.done();
	},
	should_not_throw_error_for_get_call_in_node: function (test) {
		test.expect(0);
		var Cookies = require('../src/js.cookie');
		Cookies.get('anything');
		test.done();
	},
	should_not_throw_error_for_remove_call_in_node: function (test) {
		test.expect(0);
		var Cookies = require('../src/js.cookie');
		Cookies.remove('anything');
		Cookies.remove('anything', { path: '' });
		test.done();
	}
};
