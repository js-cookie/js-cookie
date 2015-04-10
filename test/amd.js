require(['qunit'], function (QUnit) {
	QUnit.module('amd');

	QUnit.start();
	QUnit.test('module loading', function (assert) {
		QUnit.expect(1);
		var done = assert.async();
		require(['/src/js.cookie.js'], function (Cookies) {
			assert.ok(!!Cookies.get, 'should load the api');
			done();
		});
	});

});
