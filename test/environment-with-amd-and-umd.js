require(['qunit'], function (QUnit) {
	QUnit.start();

	QUnit.module('Environment with AMD and UMD', {
		beforeEach: function () {
			window.exports = {};
			window.module = {
				exports: window.exports
			};
		},
		afterEach: function () {
			delete window.module;
		}
	});

	QUnit.test('js-cookie need to register itself in AMD and UMD', function (assert) {
		assert.expect(2);
		var done = assert.async();
		require(['/src/js.cookie.js'], function () {
			var actual = typeof window.module.exports;
			var expected = 'function';
			assert.strictEqual(actual, expected, 'should register a function in module.exports');
			assert.notOk(!!window.Cookies, 'should not register globally in AMD/UMD environments');
			done();
		});
	});

});
