// https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
(function() {
	"use strict";

	var log = [];

	QUnit.done(function (test_results) {
		var tests = [];
		for (var i = 0, len = log.length; i < len; i++) {
			var details = log[i];
			tests.push({
				name: details.name,
				result: details.result,
				expected: details.expected,
				actual: details.actual,
				source: details.source
			});
		}
		test_results.tests = tests;
		// Required for exposing test results to the Sauce Labs API.
		// Can be removed when the following issue is fixed:
		// https://github.com/axemclion/grunt-saucelabs/issues/84
		window.global_test_results = test_results;
	});

	QUnit.testStart(function (testDetails) {
		QUnit.log(function (details) {
			if (!details.result) {
				details.name = testDetails.name;
				log.push(details);
			}
		});
	});
}());

var lifecycle = {
	teardown: function () {
		Cookies.defaults = {};
		delete Cookies.raw;
		delete Cookies.json;
		Object.keys(Cookies.get()).forEach(Cookies.remove);
	}
};


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

test('RFC 2068 quoted string', function () {
	expect(1);
	document.cookie = 'c="v@address.com\\"\\\\\\""';
	strictEqual(Cookies.get('c'), 'v@address.com"\\"', 'should decode RFC 2068 quoted string');
});

test('decode', function () {
	expect(1);
	document.cookie = encodeURIComponent(' c') + '=' + encodeURIComponent(' v');
	strictEqual(Cookies.get(' c'), ' v', 'should decode key and value');
});

test('decode pluses to space for server side written cookie', function () {
	expect(1);
	document.cookie = 'c=foo+bar';
	strictEqual(Cookies.get('c'), 'foo bar', 'should convert pluses back to space');
});

test('raw = true', function () {
	expect(2);
	Cookies.raw = true;

	document.cookie = 'c=%20v';
	strictEqual(Cookies.get('c'), '%20v', 'should not decode value');

	// see https://github.com/carhartl/jquery-cookie/issues/50
	Cookies.set('c', 'foo=bar');
	strictEqual(Cookies.get('c'), 'foo=bar', 'should include the entire value');
});

test('json = true', function () {
	expect(1);

	if ('JSON' in window) {
		Cookies.json = true;
		Cookies.set('c', { foo: 'bar' });
		deepEqual(Cookies.get('c'), { foo: 'bar' }, 'should parse JSON');
	} else {
		ok(true);
	}
});

test('not existing with json = true', function () {
	expect(1);

	if ('JSON' in window) {
		Cookies.json = true;
		strictEqual(Cookies.get('whatever'), undefined, "won't throw exception");
	} else {
		ok(true);
	}
});

test('string with json = true', function () {
	expect(1);

	if ('JSON' in window) {
		Cookies.json = true;
		Cookies.set('c', 'v');
		strictEqual(Cookies.get('c'), 'v', 'should return value');
	} else {
		ok(true);
	}
});

test('invalid JSON string with json = true', function () {
	expect(1);

	if ('JSON' in window) {
		Cookies.set('c', 'v');
		Cookies.json = true;
		strictEqual(Cookies.get('c'), undefined, "won't throw exception, returns undefined");
	} else {
		ok(true);
	}
});

test('invalid URL encoding', function () {
	expect(1);
	document.cookie = 'bad=foo%';
	strictEqual(Cookies.get('bad'), undefined, "won't throw exception, returns undefined");
	// Delete manually here because it requires raw === true...
	Cookies.raw = true;
	Cookies.remove('bad');
});

asyncTest('malformed cookie value in IE (#88, #117)', function () {
	expect(1);
	// Sandbox in an iframe so that we can poke around with document.cookie.
	var iframe = document.createElement('iframe');
	var addEvent = function (element, eventName, fn) {
		var method = "addEventListener";
		if (element.attachEvent) {
			eventName = 'on' + eventName;
			method = "attachEvent";
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

test('Call to read all with json: true', function () {
	Cookies.json = true;
	Cookies.set('c', { foo: 'bar' });
	deepEqual(Cookies.get(), { c: { foo: 'bar' } }, 'returns JSON parsed cookies');
});

test('Call to read all with a badly encoded cookie', function () {
	expect(1);
	document.cookie = 'bad=foo%';
	document.cookie = 'good=foo';
	deepEqual(Cookies.get(), { good: 'foo' }, 'returns object containing all decodable cookies');
	// Delete manually here because it requires raw === true...
	Cookies.raw = true;
	Cookies.remove('bad');
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
	strictEqual(Cookies.set('c', 'v', { expires: 21 }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('expires option as fraction of a day', function () {
	expect(1);

	var now = new Date().getTime();
	var expires = Date.parse(Cookies.set('c', 'v', { expires: 0.5 }).replace(/.+expires=/, ''));

	// When we were using Date.setDate() fractions have been ignored
	// and expires resulted in the current date. Allow 1000 milliseconds
	// difference for execution time.
	ok(expires > now + 1000, 'should write expires attribute with the correct date');
});

test('expires option as Date instance', function () {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	strictEqual(Cookies.set('c', 'v', { expires: sevenDaysFromNow }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('return value', function () {
	expect(1);
	strictEqual(Cookies.set('c', 'v'), 'c=v', 'should return written cookie string');
});

test('defaults', function () {
	expect(2);
	Cookies.defaults.path = '/foo';
	ok(Cookies.set('c', 'v').match(/path=\/foo/), 'should use options from defaults');
	ok(Cookies.set('c', 'v', { path: '/bar' }).match(/path=\/bar/), 'options argument has precedence');
});

test('raw = true', function () {
	expect(1);
	Cookies.raw = true;
	strictEqual(Cookies.set('c[1]', 'v[1]'), 'c[1]=v[1]', 'should not encode');
	// Delete manually here because it requires raw === true...
	Cookies.remove('c[1]');
});

test('json = true', function () {
	expect(1);
	Cookies.json = true;

	if ('JSON' in window) {
		Cookies.set('c', { foo: 'bar' });
		strictEqual(document.cookie, 'c=' + encodeURIComponent(JSON.stringify({ foo: 'bar' })), 'should stringify JSON');
	} else {
		ok(true);
	}
});


module('removeCookie', lifecycle);

test('deletion', function () {
	expect(1);
	Cookies.set('c', 'v');
	Cookies.remove('c');
	strictEqual(document.cookie, '', 'should delete the cookie');
});

test('when sucessfully deleted', function () {
	expect(1);
	Cookies.set('c', 'v');
	strictEqual(Cookies.remove('c'), true, 'returns true');
});

test('when cookie does not exist', function () {
	expect(1);
	strictEqual(Cookies.remove('c'), true, 'returns true');
});

test('with options', function () {
	expect(1);
	var options = { path: '/' };
	Cookies.set('c', 'v', options);
	Cookies.remove('c', options);
	strictEqual(document.cookie, '', 'should delete the cookie');
});

test('passing options reference', function () {
	expect(1);
	var options = { path: '/' };
	Cookies.set('c', 'v', options);
	Cookies.remove('c', options);
	deepEqual(options, { path: '/' }, "won't alter options object");
});

test('[] used in name', function () {
	expect(1);
	Cookies.raw = true;
	document.cookie = 'c[1]=foo';
	Cookies.remove('c[1]');
	strictEqual(document.cookie, '', 'delete the cookie');
});


module('conversion', lifecycle);

test('read converter', function() {
	expect(1);
	Cookies.set('c', '1');
	strictEqual(Cookies.get('c', Number), 1, 'converts read value');
});

test('read converter with raw = true', function() {
	expect(1);
	Cookies.raw = true;
	Cookies.set('c', '1');
	strictEqual(Cookies.get('c', Number), 1, 'does not decode, but converts read value');
});

module('noConflict', lifecycle);

test('do not conflict with existent globals', function() {
	expect(2);
	var Cookies = window.Cookies.noConflict();
	Cookies.set('c', 'v');
	strictEqual(Cookies.get('c'), 'v', 'should work correctly');
	strictEqual(window.Cookies, 'existent global', 'should restore the original global');
	window.Cookies = Cookies;
});

