/*global lifecycle: true*/

module('read', lifecycle);

test('simple value', function () {
	expect(1);
	document.cookie = 'c=v';
	strictEqual(Cookies.get('c'), 'v', 'should return value');
});

test('empty value', function () {
	expect(1);
	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
	// resulted in a bug while reading such a cookie.
	Cookies.set('c', '');
	strictEqual(Cookies.get('c'), '', 'should return value');
});

test('not existing', function () {
	expect(1);
	strictEqual(Cookies.get('whatever'), undefined, 'return undefined');
});

// github.com/carhartl/jquery-cookie/issues/50
test('equality sign in cookie value', function () {
	expect(1);
	Cookies.set('c', 'foo=bar');
	strictEqual(Cookies.get('c'), 'foo=bar', 'should include the entire value');
});

// github.com/carhartl/jquery-cookie/issues/215
test('percent character in cookie value', function () {
	expect(1);
	document.cookie = 'bad=foo%';
	strictEqual(Cookies.get('bad'), 'foo%', 'should read the percent character');
});

test('percent character in cookie value mixed with encoded values', function () {
	expect(1);
	document.cookie = 'bad=foo%bar%22baz%bax%3D';
	strictEqual(Cookies.get('bad'), 'foo%bar"baz%bax=', 'should read the percent character');
});

// github.com/carhartl/jquery-cookie/pull/88
// github.com/carhartl/jquery-cookie/pull/117
asyncTest('malformed cookie value in IE', function () {
	expect(1);
	// Sandbox in an iframe so that we can poke around with document.cookie.
	var iframe = document.createElement('iframe');
	var addEvent = function (element, eventName, fn) {
		var method = 'addEventListener';
		if (element.attachEvent) {
			eventName = 'on' + eventName;
			method = 'attachEvent';
		}
		element[ method ](eventName, fn);
	};
	iframe.src = 'malformed_cookie.html';
	addEvent(iframe, 'load', function () {
		start();
		if (iframe.contentWindow.ok) {
			strictEqual(iframe.contentWindow.testValue, 'two', 'reads all cookie values, skipping duplicate occurences of "; "');
		} else {
			// Skip the test where we can't stub document.cookie using
			// Object.defineProperty. Seems to work fine in
			// Chrome, Firefox and IE 8+.
			ok(true, 'N/A');
		}
	});
	document.body.appendChild(iframe);
});

test('Call to read all when there are cookies', function () {
	Cookies.set('c', 'v');
	Cookies.set('foo', 'bar');
	deepEqual(Cookies.get(), { c: 'v', foo: 'bar' }, 'returns object containing all cookies');
});

test('Call to read all when there are no cookies at all', function () {
	deepEqual(Cookies.get(), {}, 'returns empty object');
});

test('RFC 6265 - reading cookie-octet enclosed in DQUOTE', function () {
	expect(1);
	document.cookie = 'c="v"';
	strictEqual(Cookies.get('c'), 'v', 'should simply ignore quoted strings');
});

module('write', lifecycle);

test('String primitive', function () {
	expect(1);
	Cookies.set('c', 'v');
	strictEqual(Cookies.get('c'), 'v', 'should write value');
});

test('String object', function () {
	expect(1);
	Cookies.set('c', new String('v'));
	strictEqual(Cookies.get('c'), 'v', 'should write value');
});

test('value "[object Object]"', function () {
	expect(1);
	Cookies.set('c', '[object Object]');
	strictEqual(Cookies.get('c'), '[object Object]', 'should write value');
});

test('number', function () {
	expect(1);
	Cookies.set('c', 1234);
	strictEqual(Cookies.get('c'), '1234', 'should write value');
});

test('null', function () {
	expect(1);
	Cookies.set('c', null);
	strictEqual(Cookies.get('c'), 'null', 'should write value');
});

test('undefined', function () {
	expect(1);
	Cookies.set('c', undefined);
	strictEqual(Cookies.get('c'), 'undefined', 'should write value');
});

test('expires option as days from now', function () {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 21);
	var expected = 'c=v; expires=' + sevenDaysFromNow.toUTCString();
	var actual = Cookies.set('c', 'v', { expires: 21 }).substring(0, expected.length);
	strictEqual(actual, expected, 'should write the cookie string with expires');
});

test('expires option as fraction of a day', function () {
	expect(1);

	var now = new Date().getTime();
	var stringifiedDate = Cookies.set('c', 'v', { expires: 0.5 }).split('; ')[1].split('=')[1];
	var expires = Date.parse(stringifiedDate);

	// When we were using Date.setDate() fractions have been ignored
	// and expires resulted in the current date. Allow 1000 milliseconds
	// difference for execution time.
	ok(expires > now + 1000, 'should write expires attribute with the correct date');
});

test('expires option as Date instance', function () {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	var expected = 'c=v; expires=' + sevenDaysFromNow.toUTCString();
	var actual = Cookies.set('c', 'v', { expires: sevenDaysFromNow }).substring(0, expected.length);
	strictEqual(actual, expected, 'should write the cookie string with expires');
});

test('return value', function () {
	expect(1);
	var expected = 'c=v';
	var actual = Cookies.set('c', 'v').substring(0, expected.length);
	strictEqual(actual, expected, 'should return written cookie string');
});

test('default path attribute', function () {
	expect(1);
	ok(Cookies.set('c', 'v').match(/path=\//), 'should read the default path');
});

test('API for changing defaults', function () {
	expect(3);

	Cookies.defaults.path = '/foo';
	ok(Cookies.set('c', 'v').match(/path=\/foo/), 'should use attributes from defaults');
	Cookies.remove( 'c', { path: '/foo' });

	ok(Cookies.set('c', 'v', { path: '/bar' }).match(/path=\/bar/), 'attributes argument has precedence');
	Cookies.remove( 'c', { path: '/bar' });

	delete Cookies.defaults.path;
	ok(Cookies.set('c', 'v').match(/path=\//), 'should roll back to the default path');
});

module('remove', lifecycle);

test('deletion', function () {
	expect(1);
	Cookies.set('c', 'v');
	Cookies.remove('c');
	strictEqual(document.cookie, '', 'should delete the cookie');
});

test('with attributes', function () {
	expect(1);
	var attributes = { path: '/' };
	Cookies.set('c', 'v', attributes);
	Cookies.remove('c', attributes);
	strictEqual(document.cookie, '', 'should delete the cookie');
});

test('passing attributes reference', function () {
	expect(1);
	var attributes = { path: '/' };
	Cookies.set('c', 'v', attributes);
	Cookies.remove('c', attributes);
	deepEqual(attributes, { path: '/' }, 'won\'t alter attributes object');
});

module('converters', lifecycle);

// github.com/carhartl/jquery-cookie/pull/166
test('provide a way for decoding characters encoded by the escape function', function () {
	expect(1);
	document.cookie = 'c=%u5317%u4eac';
	strictEqual(Cookies.withConverter(unescape).get('c'), '北京', 'should convert chinese characters correctly');
});

test('should decode a malformed char that matches the decodeURIComponent regex', function () {
	expect(1);
	document.cookie = 'c=%E3';
	var cookies = Cookies.withConverter(unescape);
	strictEqual(cookies.get('c'), 'ã', 'should convert the character correctly');
	cookies.remove('c', {
		path: ''
	});
});

test('should be able to conditionally decode a single malformed cookie', function () {
	expect(4);
	var cookies = Cookies.withConverter(function (value, name) {
		if (name === 'escaped') {
			return unescape(value);
		}
	});

	document.cookie = 'escaped=%u5317';
	strictEqual(cookies.get('escaped'), '北', 'should use a custom method for escaped cookie');

	document.cookie = 'encoded=%E4%BA%AC';
	strictEqual(cookies.get('encoded'), '京', 'should use the default encoding for the rest');

	deepEqual(cookies.get(), {
		escaped: '北',
		encoded: '京'
	}, 'should retrieve everything');

	Object.keys(cookies.get()).forEach(function (name) {
		cookies.remove(name, {
			path: ''
		});
	});
	strictEqual(document.cookie, '', 'should remove everything');
});

module('JSON handling', lifecycle);

test('Number', function () {
	expect(2);
	Cookies.set('c', 1);
	strictEqual(Cookies.getJSON('c'), 1, 'should handle a Number');
	strictEqual(Cookies.get('c'), '1', 'should return a String');
});

test('Boolean', function () {
	expect(2);
	Cookies.set('c', true);
	strictEqual(Cookies.getJSON('c'), true, 'should handle a Boolean');
	strictEqual(Cookies.get('c'), 'true', 'should return a Boolean');
});

test('Array Literal', function () {
	expect(2);
	Cookies.set('c', ['v']);
	deepEqual(Cookies.getJSON('c'), ['v'], 'should handle Array Literal');
	strictEqual(Cookies.get('c'), '["v"]', 'should return a String');
});

test('Array Constructor', function () {
	/*jshint -W009 */
	expect(2);
	var value = new Array();
	value[0] = 'v';
	Cookies.set('c', value);
	deepEqual(Cookies.getJSON('c'), ['v'], 'should handle Array Constructor');
	strictEqual(Cookies.get('c'), '["v"]', 'should return a String');
});

test('Object Literal', function () {
	expect(2);
	Cookies.set('c', {k: 'v'});
	deepEqual(Cookies.getJSON('c'), {k: 'v'}, 'should handle Object Literal');
	strictEqual(Cookies.get('c'), '{"k":"v"}', 'should return a String');
});

test('Object Constructor', function () {
	/*jshint -W010 */
	expect(2);
	var value = new Object();
	value.k = 'v';
	Cookies.set('c', value);
	deepEqual(Cookies.getJSON('c'), {k: 'v'}, 'should handle Object Constructor');
	strictEqual(Cookies.get('c'), '{"k":"v"}', 'should return a String');
});

test('Use String(value) for unsupported objects that do not stringify into JSON', function () {
	expect(2);

	Cookies.set('date', new Date(2015, 04, 13, 0, 0, 0, 0));
	strictEqual(Cookies.get('date').indexOf('"'), -1, 'should not quote the stringified Date object');
	strictEqual(Cookies.getJSON('date').indexOf('"'), -1, 'should not quote the stringified Date object');
});

test('Call to read all cookies with mixed json', function () {
	Cookies.set('c', { foo: 'bar' });
	Cookies.set('c2', 'v');
	deepEqual(Cookies.getJSON(), { c: { foo: 'bar' }, c2: 'v' }, 'returns JSON parsed cookies');
	deepEqual(Cookies.get(), { c: '{"foo":"bar"}', c2: 'v' }, 'returns unparsed cookies');
});

module('noConflict', lifecycle);

test('do not conflict with existent globals', function () {
	expect(2);
	var Cookies = window.Cookies.noConflict();
	Cookies.set('c', 'v');
	strictEqual(Cookies.get('c'), 'v', 'should work correctly');
	strictEqual(window.Cookies, 'existent global', 'should restore the original global');
	window.Cookies = Cookies;
});
