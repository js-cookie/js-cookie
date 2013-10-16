var lifecycle = {
	teardown: function () {
		$.cookie.defaults = {};
		delete $.cookie.raw;
		delete $.cookie.json;
		$.each($.cookie(), $.removeCookie);
	}
};


module('read', lifecycle);

test('simple value', function () {
	expect(1);
	document.cookie = 'c=v';
	strictEqual($.cookie('c'), 'v', 'should return value');
});

test('empty value', function () {
	expect(1);
	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
	// resulted in a bug while reading such a cookie.
	$.cookie('c', '');
	strictEqual($.cookie('c'), '', 'should return value');
});

test('not existing', function () {
	expect(1);
	strictEqual($.cookie('whatever'), undefined, 'return undefined');
});

test('RFC 2068 quoted string', function () {
	expect(1);
	document.cookie = 'c="v@address.com\\"\\\\\\""';
	strictEqual($.cookie('c'), 'v@address.com"\\"', 'should decode RFC 2068 quoted string');
});

test('decode', function () {
	expect(1);
	document.cookie = encodeURIComponent(' c') + '=' + encodeURIComponent(' v');
	strictEqual($.cookie(' c'), ' v', 'should decode key and value');
});

test('decode pluses to space for server side written cookie', function () {
	expect(1);
	document.cookie = 'c=foo+bar';
	strictEqual($.cookie('c'), 'foo bar', 'should convert pluses back to space');
});

test('raw = true', function () {
	expect(2);
	$.cookie.raw = true;

	document.cookie = 'c=%20v';
	strictEqual($.cookie('c'), '%20v', 'should not decode value');

	// see https://github.com/carhartl/jquery-cookie/issues/50
	$.cookie('c', 'foo=bar');
	strictEqual($.cookie('c'), 'foo=bar', 'should include the entire value');
});

test('json = true', function () {
	expect(1);

	if ('JSON' in window) {
		$.cookie.json = true;
		$.cookie('c', { foo: 'bar' });
		deepEqual($.cookie('c'), { foo: 'bar' }, 'should parse JSON');
	} else {
		ok(true);
	}
});

test('not existing with json = true', function () {
	expect(1);

	if ('JSON' in window) {
		$.cookie.json = true;
		strictEqual($.cookie('whatever'), undefined, "won't throw exception");
	} else {
		ok(true);
	}
});

test('string with json = true', function () {
	expect(1);

	if ('JSON' in window) {
		$.cookie.json = true;
		$.cookie('c', 'v');
		strictEqual($.cookie('c'), 'v', 'should return value');
	} else {
		ok(true);
	}
});

test('invalid JSON string with json = true', function () {
	expect(1);

	if ('JSON' in window) {
		$.cookie('c', 'v');
		$.cookie.json = true;
		strictEqual($.cookie('c'), undefined, "won't throw exception, returns undefined");
	} else {
		ok(true);
	}
});

test('invalid URL encoding', function () {
	expect(1);
	document.cookie = 'bad=foo%';
	strictEqual($.cookie('bad'), undefined, "won't throw exception, returns undefined");
	// Delete manually here because it requires raw === true...
	$.cookie.raw = true;
	$.removeCookie('bad');
});

asyncTest('malformed cookie value in IE (#88, #117)', function () {
	expect(1);
	// Sandbox in an iframe so that we can poke around with document.cookie.
	var iframe = $('<iframe src="malformed_cookie.html"></iframe>')[0];
	$(iframe).on('load', function () {
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
	$.cookie('c', 'v');
	$.cookie('foo', 'bar');
	deepEqual($.cookie(), { c: 'v', foo: 'bar' }, 'returns object containing all cookies');
});

test('Call to read all when there are no cookies at all', function () {
	deepEqual($.cookie(), {}, 'returns empty object');
});

test('Call to read all with json: true', function () {
	$.cookie.json = true;
	$.cookie('c', { foo: 'bar' });
	deepEqual($.cookie(), { c: { foo: 'bar' } }, 'returns JSON parsed cookies');
});

test('Call to read all with a badly encoded cookie', function () {
	expect(1);
	document.cookie = 'bad=foo%';
	document.cookie = 'good=foo';
	deepEqual($.cookie(), { good: 'foo' }, 'returns object containing all decodable cookies');
	// Delete manually here because it requires raw === true...
	$.cookie.raw = true;
	$.removeCookie('bad');
});


module('write', lifecycle);

test('String primitive', function () {
	expect(1);
	$.cookie('c', 'v');
	strictEqual($.cookie('c'), 'v', 'should write value');
});

test('String object', function () {
	expect(1);
	$.cookie('c', new String('v'));
	strictEqual($.cookie('c'), 'v', 'should write value');
});

test('value "[object Object]"', function () {
	expect(1);
	$.cookie('c', '[object Object]');
	strictEqual($.cookie('c'), '[object Object]', 'should write value');
});

test('number', function () {
	expect(1);
	$.cookie('c', 1234);
	strictEqual($.cookie('c'), '1234', 'should write value');
});

test('expires option as days from now', function () {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	strictEqual($.cookie('c', 'v', { expires: 7 }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('expires option as Date instance', function () {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	strictEqual($.cookie('c', 'v', { expires: sevenDaysFromNow }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('return value', function () {
	expect(1);
	strictEqual($.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

test('defaults', function () {
	expect(2);
	$.cookie.defaults.path = '/foo';
	ok($.cookie('c', 'v').match(/path=\/foo/), 'should use options from defaults');
	ok($.cookie('c', 'v', { path: '/bar' }).match(/path=\/bar/), 'options argument has precedence');
});

test('raw = true', function () {
	expect(1);
	$.cookie.raw = true;
	strictEqual($.cookie('c[1]', 'v[1]'), 'c[1]=v[1]', 'should not encode');
	// Delete manually here because it requires raw === true...
	$.removeCookie('c[1]');
});

test('json = true', function () {
	expect(1);
	$.cookie.json = true;

	if ('JSON' in window) {
		$.cookie('c', { foo: 'bar' });
		strictEqual(document.cookie, 'c=' + encodeURIComponent(JSON.stringify({ foo: 'bar' })), 'should stringify JSON');
	} else {
		ok(true);
	}
});


module('removeCookie', lifecycle);

test('deletion', function () {
	expect(1);
	$.cookie('c', 'v');
	$.removeCookie('c');
	strictEqual(document.cookie, '', 'should delete the cookie');
});

test('when sucessfully deleted', function () {
	expect(1);
	$.cookie('c', 'v');
	strictEqual($.removeCookie('c'), true, 'returns true');
});

test('when deletion failed', function () {
	expect(1);
	$.cookie('c', 'v');

	var originalCookie = $.cookie;
	$.cookie = function () {
		// Stub deletion...
		if (arguments.length === 1) {
			return originalCookie.apply(null, arguments);
		}
	};

	strictEqual($.removeCookie('c'), false, 'returns false');

	$.cookie = originalCookie;
});

test('when cookie does not exist', function () {
	expect(1);
	strictEqual($.removeCookie('c'), false, 'returns false');
});

test('with options', function () {
	expect(1);
	var options = { path: '/' };
	$.cookie('c', 'v', options);
	$.removeCookie('c', options);
	strictEqual(document.cookie, '', 'should delete the cookie');
});

test('passing options reference', function () {
	expect(1);
	var options = { path: '/' };
	$.cookie('c', 'v', options);
	$.removeCookie('c', options);
	deepEqual(options, { path: '/' }, "won't alter options object");
});

test('[] used in name', function () {
	expect(1);
	$.cookie.raw = true;
	document.cookie = 'c[1]=foo';
	$.removeCookie('c[1]');
	strictEqual(document.cookie, '', 'delete the cookie');
});


module('conversion', lifecycle);

test('read converter', function() {
	expect(1);
	$.cookie('c', '1');
	strictEqual($.cookie('c', Number), 1, 'converts read value');
});

test('read converter with raw = true', function() {
	expect(1);
	$.cookie.raw = true;
	$.cookie('c', '1');
	strictEqual($.cookie('c', Number), 1, 'does not decode, but converts read value');
});
