/*global lifecycle: true*/

QUnit.module('read', lifecycle);

QUnit.test('simple value', function (assert) {
	assert.expect(1);
	document.cookie = 'c=v';
	assert.strictEqual(Cookies.get('c'), 'v', 'should return value');
});

QUnit.test('empty value', function (assert) {
	assert.expect(1);
	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
	// resulted in a bug while reading such a cookie.
	Cookies.set('c', '');
	assert.strictEqual(Cookies.get('c'), '', 'should return value');
});

QUnit.test('not existing', function (assert) {
	assert.expect(1);
	assert.strictEqual(Cookies.get('whatever'), undefined, 'return undefined');
});

// github.com/carhartl/jquery-cookie/issues/50
QUnit.test('equality sign in cookie value', function (assert) {
	assert.expect(1);
	Cookies.set('c', 'foo=bar');
	assert.strictEqual(Cookies.get('c'), 'foo=bar', 'should include the entire value');
});

// github.com/carhartl/jquery-cookie/issues/215
QUnit.test('percent character in cookie value', function (assert) {
	assert.expect(1);
	document.cookie = 'bad=foo%';
	assert.strictEqual(Cookies.get('bad'), 'foo%', 'should read the percent character');
});

QUnit.test('percent character in cookie value mixed with encoded values', function (assert) {
	assert.expect(1);
	document.cookie = 'bad=foo%bar%22baz%bax%3D';
	assert.strictEqual(Cookies.get('bad'), 'foo%bar"baz%bax=', 'should read the percent character');
});

// github.com/carhartl/jquery-cookie/pull/88
// github.com/carhartl/jquery-cookie/pull/117
QUnit.test('malformed cookie value in IE', function (assert) {
	assert.expect(1);
	var done = assert.async();
	// Sandbox in an iframe so that we can poke around with document.cookie.
	var iframe = document.createElement('iframe');
	iframe.src = 'malformed_cookie.html';
	addEvent(iframe, 'load', function () {
		if (iframe.contentWindow.ok) {
			assert.strictEqual(iframe.contentWindow.testValue, 'two', 'reads all cookie values, skipping duplicate occurences of "; "');
		} else {
			// Skip the test where we can't stub document.cookie using
			// Object.defineProperty. Seems to work fine in
			// Chrome, Firefox and IE 8+.
			assert.ok(true, 'N/A');
		}
		done();
	});
	document.body.appendChild(iframe);
});

QUnit.test('Call to read all when there are cookies', function (assert) {
	Cookies.set('c', 'v');
	Cookies.set('foo', 'bar');
	assert.deepEqual(Cookies.get(), { c: 'v', foo: 'bar' }, 'returns object containing all cookies');
});

QUnit.test('Call to read all when there are no cookies at all', function (assert) {
	assert.deepEqual(Cookies.get(), {}, 'returns empty object');
});

QUnit.test('RFC 6265 - reading cookie-octet enclosed in DQUOTE', function (assert) {
	assert.expect(1);
	document.cookie = 'c="v"';
	assert.strictEqual(Cookies.get('c'), 'v', 'should simply ignore quoted strings');
});

// github.com/js-cookie/js-cookie/pull/62
QUnit.test('Call to read cookie when there is another unrelated cookie with malformed encoding in the value', function (assert) {
	assert.expect(2);
	document.cookie = 'invalid=%A1';
	document.cookie = 'c=v';
	assert.strictEqual(Cookies.get('c'), 'v', 'should not throw a URI malformed exception when retrieving a single cookie');
	assert.deepEqual(Cookies.get(), { c: 'v' }, 'should not throw a URI malformed exception when retrieving all cookies');
	Cookies.withConverter(unescape).remove('invalid');
});

QUnit.module('write', lifecycle);

QUnit.test('String primitive', function (assert) {
	assert.expect(1);
	Cookies.set('c', 'v');
	assert.strictEqual(Cookies.get('c'), 'v', 'should write value');
});

QUnit.test('String object', function (assert) {
	assert.expect(1);
	Cookies.set('c', new String('v'));
	assert.strictEqual(Cookies.get('c'), 'v', 'should write value');
});

QUnit.test('value "[object Object]"', function (assert) {
	assert.expect(1);
	Cookies.set('c', '[object Object]');
	assert.strictEqual(Cookies.get('c'), '[object Object]', 'should write value');
});

QUnit.test('number', function (assert) {
	assert.expect(1);
	Cookies.set('c', 1234);
	assert.strictEqual(Cookies.get('c'), '1234', 'should write value');
});

QUnit.test('null', function (assert) {
	assert.expect(1);
	Cookies.set('c', null);
	assert.strictEqual(Cookies.get('c'), 'null', 'should write value');
});

QUnit.test('undefined', function (assert) {
	assert.expect(1);
	Cookies.set('c', undefined);
	assert.strictEqual(Cookies.get('c'), 'undefined', 'should write value');
});

QUnit.test('expires option as days from now', function (assert) {
	assert.expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 21);
	var expected = 'c=v; expires=' + sevenDaysFromNow.toUTCString();
	var actual = Cookies.set('c', 'v', { expires: 21 }).substring(0, expected.length);
	assert.strictEqual(actual, expected, 'should write the cookie string with expires');
});

QUnit.test('expires option as fraction of a day', function (assert) {
	assert.expect(1);

	var now = new Date().getTime();
	var stringifiedDate = Cookies.set('c', 'v', { expires: 0.5 }).split('; ')[1].split('=')[1];
	var expires = Date.parse(stringifiedDate);

	// When we were using Date.setDate() fractions have been ignored
	// and expires resulted in the current date. Allow 1000 milliseconds
	// difference for execution time.
	assert.ok(expires > now + 1000, 'should write expires attribute with the correct date');
});

QUnit.test('expires option as Date instance', function (assert) {
	assert.expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	var expected = 'c=v; expires=' + sevenDaysFromNow.toUTCString();
	var actual = Cookies.set('c', 'v', { expires: sevenDaysFromNow }).substring(0, expected.length);
	assert.strictEqual(actual, expected, 'should write the cookie string with expires');
});

QUnit.test('return value', function (assert) {
	assert.expect(1);
	var expected = 'c=v';
	var actual = Cookies.set('c', 'v').substring(0, expected.length);
	assert.strictEqual(actual, expected, 'should return written cookie string');
});

QUnit.test('default path attribute', function (assert) {
	assert.expect(1);
	assert.ok(Cookies.set('c', 'v').match(/path=\//), 'should read the default path');
});

QUnit.test('API for changing defaults', function (assert) {
	assert.expect(3);

	Cookies.defaults.path = '/foo';
	assert.ok(Cookies.set('c', 'v').match(/path=\/foo/), 'should use attributes from defaults');
	Cookies.remove('c', { path: '/foo' });

	assert.ok(Cookies.set('c', 'v', { path: '/bar' }).match(/path=\/bar/), 'attributes argument has precedence');
	Cookies.remove('c', { path: '/bar' });

	delete Cookies.defaults.path;
	assert.ok(Cookies.set('c', 'v').match(/path=\//), 'should roll back to the default path');
});

// github.com/js-cookie/js-cookie/pull/54
QUnit.test('false secure value', function (assert) {
	assert.expect(1);
	var expected = 'c=v; path=/';
	var actual = Cookies.set('c', 'v', {secure: false});
	assert.strictEqual(actual, expected, 'false should not modify path in cookie string');
});

QUnit.test('undefined attribute value', function (assert) {
	assert.expect(4);
	assert.strictEqual(Cookies.set('c', 'v', {
		expires: undefined
	}), 'c=v; path=/', 'should not write undefined expires attribute');
	assert.strictEqual(Cookies.set('c', 'v', {
		path: undefined
	}), 'c=v', 'should not write undefined path attribute');
	assert.strictEqual(Cookies.set('c', 'v', {
		domain: undefined
	}), 'c=v; path=/', 'should not write undefined domain attribute');
	assert.strictEqual(Cookies.set('c', 'v', {
		secure: undefined
	}), 'c=v; path=/', 'should not write undefined secure attribute');
});

QUnit.module('remove', lifecycle);

QUnit.test('deletion', function (assert) {
	assert.expect(1);
	Cookies.set('c', 'v');
	Cookies.remove('c');
	assert.strictEqual(document.cookie, '', 'should delete the cookie');
});

QUnit.test('with attributes', function (assert) {
	assert.expect(1);
	var attributes = { path: '/' };
	Cookies.set('c', 'v', attributes);
	Cookies.remove('c', attributes);
	assert.strictEqual(document.cookie, '', 'should delete the cookie');
});

QUnit.test('passing attributes reference', function (assert) {
	assert.expect(1);
	var attributes = { path: '/' };
	Cookies.set('c', 'v', attributes);
	Cookies.remove('c', attributes);
	assert.deepEqual(attributes, { path: '/' }, 'won\'t alter attributes object');
});

QUnit.module('converters', lifecycle);

// github.com/carhartl/jquery-cookie/pull/166
QUnit.test('provide a way for decoding characters encoded by the escape function', function (assert) {
	assert.expect(1);
	document.cookie = 'c=%u5317%u4eac';
	assert.strictEqual(Cookies.withConverter(unescape).get('c'), '北京', 'should convert chinese characters correctly');
});

QUnit.test('should decode a malformed char that matches the decodeURIComponent regex', function (assert) {
	assert.expect(1);
	document.cookie = 'c=%E3';
	var cookies = Cookies.withConverter(unescape);
	assert.strictEqual(cookies.get('c'), 'ã', 'should convert the character correctly');
	cookies.remove('c', {
		path: ''
	});
});

QUnit.test('should be able to conditionally decode a single malformed cookie', function (assert) {
	assert.expect(4);
	var cookies = Cookies.withConverter(function (value, name) {
		if (name === 'escaped') {
			return unescape(value);
		}
	});

	document.cookie = 'escaped=%u5317';
	assert.strictEqual(cookies.get('escaped'), '北', 'should use a custom method for escaped cookie');

	document.cookie = 'encoded=%E4%BA%AC';
	assert.strictEqual(cookies.get('encoded'), '京', 'should use the default encoding for the rest');

	assert.deepEqual(cookies.get(), {
		escaped: '北',
		encoded: '京'
	}, 'should retrieve everything');

	Object.keys(cookies.get()).forEach(function (name) {
		cookies.remove(name, {
			path: ''
		});
	});
	assert.strictEqual(document.cookie, '', 'should remove everything');
});

QUnit.module('JSON handling', lifecycle);

QUnit.test('Number', function (assert) {
	assert.expect(2);
	Cookies.set('c', 1);
	assert.strictEqual(Cookies.getJSON('c'), 1, 'should handle a Number');
	assert.strictEqual(Cookies.get('c'), '1', 'should return a String');
});

QUnit.test('Boolean', function (assert) {
	assert.expect(2);
	Cookies.set('c', true);
	assert.strictEqual(Cookies.getJSON('c'), true, 'should handle a Boolean');
	assert.strictEqual(Cookies.get('c'), 'true', 'should return a Boolean');
});

QUnit.test('Array Literal', function (assert) {
	assert.expect(2);
	Cookies.set('c', ['v']);
	assert.deepEqual(Cookies.getJSON('c'), ['v'], 'should handle Array Literal');
	assert.strictEqual(Cookies.get('c'), '["v"]', 'should return a String');
});

QUnit.test('Array Constructor', function (assert) {
	/*jshint -W009 */
	assert.expect(2);
	var value = new Array();
	value[0] = 'v';
	Cookies.set('c', value);
	assert.deepEqual(Cookies.getJSON('c'), ['v'], 'should handle Array Constructor');
	assert.strictEqual(Cookies.get('c'), '["v"]', 'should return a String');
});

QUnit.test('Object Literal', function (assert) {
	assert.expect(2);
	Cookies.set('c', {k: 'v'});
	assert.deepEqual(Cookies.getJSON('c'), {k: 'v'}, 'should handle Object Literal');
	assert.strictEqual(Cookies.get('c'), '{"k":"v"}', 'should return a String');
});

QUnit.test('Object Constructor', function (assert) {
	/*jshint -W010 */
	assert.expect(2);
	var value = new Object();
	value.k = 'v';
	Cookies.set('c', value);
	assert.deepEqual(Cookies.getJSON('c'), {k: 'v'}, 'should handle Object Constructor');
	assert.strictEqual(Cookies.get('c'), '{"k":"v"}', 'should return a String');
});

QUnit.test('Use String(value) for unsupported objects that do not stringify into JSON', function (assert) {
	assert.expect(2);
	Cookies.set('date', new Date(2015, 04, 13, 0, 0, 0, 0));
	assert.strictEqual(Cookies.get('date').indexOf('"'), -1, 'should not quote the stringified Date object');
	assert.strictEqual(Cookies.getJSON('date').indexOf('"'), -1, 'should not quote the stringified Date object');
});

QUnit.test('Call to read all cookies with mixed json', function (assert) {
	Cookies.set('c', { foo: 'bar' });
	Cookies.set('c2', 'v');
	assert.deepEqual(Cookies.getJSON(), { c: { foo: 'bar' }, c2: 'v' }, 'returns JSON parsed cookies');
	assert.deepEqual(Cookies.get(), { c: '{"foo":"bar"}', c2: 'v' }, 'returns unparsed cookies');
});

QUnit.module('noConflict', lifecycle);

QUnit.test('do not conflict with existent globals', function (assert) {
	assert.expect(2);
	var Cookies = window.Cookies.noConflict();
	Cookies.set('c', 'v');
	assert.strictEqual(Cookies.get('c'), 'v', 'should work correctly');
	assert.strictEqual(window.Cookies, 'existent global', 'should restore the original global');
	window.Cookies = Cookies;
});
