require(['qunit'], function (QUnit) {
	QUnit.module('amd');

	QUnit.start();
	QUnit.test('module loading', function (assert) {
		assert.expect(1);
		var done = assert.async();
		require(['/lib/js.cookie.umd.js'], function (Cookies) {
			assert.ok(!!Cookies.get, 'should load the api');
			done();
		});
	});

});
