// https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
(function () {
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

window.submitToServer = function () {
	stop();
	return {
		then: function (afterLoading) {
			var iframe = document.getElementById('post_iframe');
			var form = document.getElementById('post_form');
			iframe.onload = function () {
				start();
				afterLoading.call(null, iframe.contentWindow.Cookies);
			};
			form.action = 'post_iframe.html?bust='.concat(+new Date());
			form.submit();
		}
	};
};

var lifecycle = {
	teardown: function () {
		Cookies.defaults = {};
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

// github.com/carhartl/jquery-cookie/issues/50
test('equality sign in cookie value', function () {
	expect(1);
	Cookies.set('c', 'foo=bar');
	strictEqual(Cookies.get('c'), 'foo=bar', 'should include the entire value');
});

test('percent character in cookie value', function () {
	expect(1);
	document.cookie = 'bad=foo%';
	strictEqual(Cookies.get('bad'), 'foo%', 'should read the percent character');
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

//github.com/carhartl/jquery-cookie/pull/62
test('provide a way for decoding PHP whitespace encoding', function () {
	expect(1);
	document.cookie = 'c=foo+bar';
	var actual = Cookies.get('c', function (value) {
		return value.replace(/\+/g, ' ');
	});
	strictEqual(actual, 'foo bar', 'should convert pluses back to space');
});

// github.com/carhartl/jquery-cookie/pull/166
test('provide a way for decoding chinese characters', function () {
	expect(1);
	document.cookie = 'c=%u5317%u4eac';
	var actual = Cookies.get('c', function (value) {
		return unescape(value);
	});
	strictEqual(actual, '北京', 'should convert chinese characters correctly');
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

module('encoding', lifecycle);

test('Handling quotes in the cookie value for read and write', function () {
	expect(3);

	Cookies.set('quote', '"');
	strictEqual(Cookies.get('quote'), '"', 'should print the quote character');

	Cookies.set('without-last', '"content');
	strictEqual(Cookies.get('without-last'), '"content', 'should print the quote character');

	Cookies.set('without-first', 'content"');
	strictEqual(Cookies.get('without-first'), 'content"', 'should print the quote character');
});

test('RFC 6265 - cookie-octet enclosed in DQUOTE', function () {
	expect(1);
	document.cookie = 'c="v"';
	strictEqual(Cookies.get('c'), 'v', 'should decode the quotes');
});

test('RFC 6265 - disallowed characters in cookie-octet', function () {
	expect(5);

	Cookies.set('whitespace', ' ');
	strictEqual(Cookies.get('whitespace'), ' ', 'should handle the whitespace character');

	Cookies.set('comma', ',');
	strictEqual(Cookies.get('comma'), ',', 'should handle the comma character');

	Cookies.set('semicolon', ';');
	strictEqual(Cookies.get('semicolon'), ';', 'should handle the semicolon character');

	Cookies.set('backslash', '\\');
	strictEqual(Cookies.get('backslash'), '\\', 'should handle the backslash character');

	Cookies.set('multiple', '" ,;\\" ,;\\');
	strictEqual(Cookies.get('multiple'), '" ,;\\" ,;\\', 'should handle multiple special characters');
});

test('RFC 6265 - disallowed characters in cookie-name', function () {
	expect(18);

	Cookies.set('(', 'v');
	strictEqual(Cookies.get('('), 'v', 'should handle the opening parens character');

	Cookies.set(')', 'v');
	strictEqual(Cookies.get(')'), 'v', 'should handle the closing parens character');

	Cookies.set('<', 'v');
	strictEqual(Cookies.get('<'), 'v', 'should handle the less-than character');

	Cookies.set('>', 'v');
	strictEqual(Cookies.get('>'), 'v', 'should handle the greater-than character');

	Cookies.set('@', 'v');
	strictEqual(Cookies.get('@'), 'v', 'should handle the at character');

	Cookies.set(',', 'v');
	strictEqual(Cookies.get(','), 'v', 'should handle the comma character');

	Cookies.set(';', 'v');
	strictEqual(Cookies.get(';'), 'v', 'should handle the semicolon character');

	Cookies.set(':', 'v');
	strictEqual(Cookies.get(':'), 'v', 'should handle the colon character');

	Cookies.set('\\', 'v');
	strictEqual(Cookies.get('\\'), 'v', 'should handle the backslash character');

	Cookies.set('"', 'v');
	strictEqual(Cookies.get('"'), 'v', 'should handle the double quote character');

	Cookies.set('/', 'v');
	strictEqual(Cookies.get('/'), 'v', 'should handle the slash character');

	Cookies.set('[', 'v');
	strictEqual(Cookies.get('['), 'v', 'should handle the opening square brackets character');

	Cookies.set(']', 'v');
	strictEqual(Cookies.get(']'), 'v', 'should handle the closing square brackets character');

	Cookies.set('?', 'v');
	strictEqual(Cookies.get('?'), 'v', 'should handle the question mark character');

	Cookies.set('=', 'v');
	strictEqual(Cookies.get('='), 'v', 'should handle the equal sign character');

	Cookies.set('{', 'v');
	strictEqual(Cookies.get('{'), 'v', 'should handle the opening curly brackets character');

	Cookies.set('}', 'v');
	strictEqual(Cookies.get('}'), 'v', 'should handle the closing curly brackets character');

	Cookies.set('	', 'v');
	strictEqual(Cookies.get('	'), 'v', 'should handle the horizontal tab character');
});

test('server processing for 2 bytes characters', function () {
	expect(1);
	Cookies.set('ã', 'ã');
	window.submitToServer().then(function (Cookies) {
		strictEqual(Cookies.get('ã'), 'ã', 'should handle ã character');
	});
});

test('server processing for 3 bytes characters', function () {
	expect(1);
	Cookies.set('₯', '₯');
	window.submitToServer().then(function (Cookies) {
		strictEqual(Cookies.get('₯'), '₯', 'should handle ₯ character');
	});
});

test('server processing for 4 bytes characters', function () {
	expect(1);
	Cookies.set('𩸽', '𩸽');
	window.submitToServer().then(function (Cookies) {
		strictEqual(Cookies.get('𩸽'), '𩸽', 'should handle 𩸽 character');
	});
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
	document.cookie = 'c[1]=foo';
	Cookies.remove('c[1]');
	strictEqual(document.cookie, '', 'delete the cookie');
});

module('converters', lifecycle);

test('read converter', function () {
	expect(1);
	Cookies.set('c', '1');
	strictEqual(Cookies.get('c', Number), 1, 'converts read value');
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

test('Use String(value) for unsupported objects that do not stringify into JSON', function() {
	expect(4);

	Cookies.set('date', new Date(2015, 04, 13, 0, 0, 0, 0));
	strictEqual(Cookies.get('date').indexOf('"'), -1, 'should not quote the stringified Date object');
	strictEqual(Cookies.getJSON('date').indexOf('"'), -1, 'should not quote the stringified Date object');

	Cookies.set('function', function (){});
	strictEqual(Cookies.get('function'), undefined, 'should return undefined for function object');
	strictEqual(Cookies.getJSON('function'), undefined, 'should return undefined for function object');
});

test('Call to read all cookies with mixed json', function () {
	Cookies.set('c', { foo: 'bar' });
	Cookies.set('c2', 'v');
	deepEqual(Cookies.getJSON(), { c: { foo: 'bar' }, c2: 'v' }, 'returns JSON parsed cookies');
	deepEqual(Cookies.get(), { c: '{"foo":"bar"}', c2: 'v' }, 'returns unparsed cookies');
});
