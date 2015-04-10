require(['qunit'], function (QUnit) {
	QUnit.module('amd');

	QUnit.start();
	QUnit.test('with jquery dependency', function (assert) {
		QUnit.expect(3);
		var done = assert.async();
		require(['jquery', '/src/js.cookie.js'], function ($, Cookies) {
			assert.ok(!!$.cookie, 'Loaded $.cookie');
			assert.ok(!!$.removeCookie, 'Loaded $.removeCookie');
			assert.ok(!!Cookies.get, 'Loaded Cookies api');
			done();
		});
	});

});
