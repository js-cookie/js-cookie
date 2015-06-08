QUnit.module('cookie-value', lifecycle);

QUnit.test('cookie-value with double quotes', function (assert) {
	assert.expect(1);
	using(assert)
	.setCookie('c', '"')
	.then(function (decodedValue) {
		assert.strictEqual(decodedValue, '"', 'should print the quote character');
	});
});

QUnit.test('cookie-value with double quotes in the left', function (assert) {
	assert.expect(1);
	using(assert)
	.setCookie('c', '"content')
	.then(function (decodedValue) {
		assert.strictEqual(decodedValue, '"content', 'should print the quote character');
	});
});

QUnit.test('cookie-value with double quotes in the right', function (assert) {
	assert.expect(1);
	using(assert)
	.setCookie('c', 'content"')
	.then(function (decodedValue) {
		assert.strictEqual(decodedValue, 'content"', 'should print the quote character');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-value " "', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', ' ')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, ' ', 'should handle the whitespace character');
		assert.strictEqual(plainValue, 'c=%20', 'whitespace is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-value ","', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', ',')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, ',', 'should handle the comma character');
		assert.strictEqual(plainValue, 'c=%2C', 'comma is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-value ";"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', ';')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, ';', 'should handle the semicolon character');
		assert.strictEqual(plainValue, 'c=%3B', 'semicolon is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-value "\\"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '\\')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '\\', 'should handle the backslash character');
		assert.strictEqual(plainValue, 'c=%5C', 'backslash is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - characters not allowed in the cookie-value should be replaced globally', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', ';;')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, ';;', 'should handle multiple not allowed characters');
		assert.strictEqual(plainValue, 'c=%3B%3B', 'should replace multiple not allowed characters');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "#"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '#')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '#', 'should handle the sharp character');
		assert.strictEqual(plainValue, 'c=#', 'sharp is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "$"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '$')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '$', 'should handle the dollar sign character');
		assert.strictEqual(plainValue, 'c=$', 'dollar sign is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "%"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '%')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '%', 'should handle the percent character');
		assert.strictEqual(plainValue, 'c=%25', 'percent is allowed, but need to be escaped');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "&"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '&')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '&', 'should handle the ampersand character');
		assert.strictEqual(plainValue, 'c=&', 'ampersand is allowed, should not encode');
	});
});

// github.com/carhartl/jquery-cookie/pull/62
QUnit.test('RFC 6265 - character allowed in the cookie-value "+"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '+')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '+', 'should handle the plus character');
		assert.strictEqual(plainValue, 'c=+', 'plus is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value ":"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', ':')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, ':', 'should handle the colon character');
		assert.strictEqual(plainValue, 'c=:', 'colon is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "<"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '<')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '<', 'should handle the less-than character');
		assert.strictEqual(plainValue, 'c=<', 'less-than is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value ">"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '>')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '>', 'should handle the greater-than character');
		assert.strictEqual(plainValue, 'c=>', 'greater-than is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "="', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '=')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '=', 'should handle the equal sign character');
		assert.strictEqual(plainValue, 'c==', 'equal sign is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "/"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '/')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '/', 'should handle the slash character');
		assert.strictEqual(plainValue, 'c=/', 'slash is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "?"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '?')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '?', 'should handle the question mark character');
		assert.strictEqual(plainValue, 'c=?', 'question mark is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "@"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '@')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '@', 'should handle the at character');
		assert.strictEqual(plainValue, 'c=@', 'at is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "["', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '[')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '[', 'should handle the opening square bracket character');
		assert.strictEqual(plainValue, 'c=[', 'opening square bracket is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "]"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', ']')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, ']', 'should handle the closing square bracket character');
		assert.strictEqual(plainValue, 'c=]', 'closing square bracket is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "^"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '^')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '^', 'should handle the caret character');
		assert.strictEqual(plainValue, 'c=^', 'caret is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "`"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '`')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '`', 'should handle the grave accent character');
		assert.strictEqual(plainValue, 'c=`', 'grave accent is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "{"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '{')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '{', 'should handle the opening curly bracket character');
		assert.strictEqual(plainValue, 'c={', 'opening curly bracket is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "}"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '}')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '}', 'should handle the closing curly bracket character');
		assert.strictEqual(plainValue, 'c=}', 'closing curly bracket is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-value "|"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '|')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '|', 'should handle the pipe character');
		assert.strictEqual(plainValue, 'c=|', 'pipe is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - characters allowed in the cookie-value should globally not be encoded', function (assert) {
	assert.expect(1);
	using(assert)
	.setCookie('c', '{{')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(plainValue, 'c={{', 'should not encode all the character occurrences');
	});
});

QUnit.test('cookie-value - 2 bytes character (ã)', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', 'ã')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'ã', 'should handle the ã character');
		assert.strictEqual(plainValue, 'c=%C3%A3', 'should encode the ã character');
	});
});

QUnit.test('cookie-value - 3 bytes character (₯)', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '₯')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '₯', 'should handle the ₯ character');
		assert.strictEqual(plainValue, 'c=%E2%82%AF', 'should encode the ₯ character');
	});
});

QUnit.test('cookie-value - 4 bytes character (𩸽)', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('c', '𩸽')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, '𩸽', 'should handle the 𩸽 character');
		assert.strictEqual(plainValue, 'c=%F0%A9%B8%BD', 'should encode the 𩸽 character');
	});
});

QUnit.module('cookie-name', lifecycle);

QUnit.test('RFC 6265 - character not allowed in the cookie-name "("', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('(', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the opening parens character');
		assert.strictEqual(plainValue, '%28=v', 'opening parens is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name ")"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie(')', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the closing parens character');
		assert.strictEqual(plainValue, '%29=v', 'closing parens is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - should replace parens globally', function (assert) {
	assert.expect(1);
	using(assert)
	.setCookie('(())', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(plainValue, '%28%28%29%29=v', 'encode with global replace');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "<"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('<', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the less-than character');
		assert.strictEqual(plainValue, '%3C=v', 'less-than is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name ">"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('>', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the greater-than character');
		assert.strictEqual(plainValue, '%3E=v', 'greater-than is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "@"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('@', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the at character');
		assert.strictEqual(plainValue, '%40=v', 'at is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name ","', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie(',', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the comma character');
		assert.strictEqual(plainValue, '%2C=v', 'comma is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name ";"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie(';', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the semicolon character');
		assert.strictEqual(plainValue, '%3B=v', 'semicolon is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name ":"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie(':', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the colon character');
		assert.strictEqual(plainValue, '%3A=v', 'colon is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "\\"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('\\', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the backslash character');
		assert.strictEqual(plainValue, '%5C=v', 'backslash is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "\""', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('"', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the double quote character');
		assert.strictEqual(plainValue, '%22=v', 'double quote is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "/"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('/', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the slash character');
		assert.strictEqual(plainValue, '%2F=v', 'slash is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "["', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('[', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the opening square brackets character');
		assert.strictEqual(plainValue, '%5B=v', 'opening square brackets is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "]"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie(']', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the closing square brackets character');
		assert.strictEqual(plainValue, '%5D=v', 'closing square brackets is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "?"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('?', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the question mark character');
		assert.strictEqual(plainValue, '%3F=v', 'question mark is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "="', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('=', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the equal sign character');
		assert.strictEqual(plainValue, '%3D=v', 'equal sign is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "{"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('{', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the opening curly brackets character');
		assert.strictEqual(plainValue, '%7B=v', 'opening curly brackets is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "}"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('}', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the closing curly brackets character');
		assert.strictEqual(plainValue, '%7D=v', 'closing curly brackets is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name "\\t"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('	', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the horizontal tab character');
		assert.strictEqual(plainValue, '%09=v', 'horizontal tab is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character not allowed in the cookie-name " "', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie(' ', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the whitespace character');
		assert.strictEqual(plainValue, '%20=v', 'whitespace is not allowed, need to encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "#"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('#', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the sharp character');
		assert.strictEqual(plainValue, '#=v', 'sharp is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "$"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('$', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the dollar sign character');
		assert.strictEqual(plainValue, '$=v', 'dollar sign is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in cookie-name "%"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('%', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the percent character');
		assert.strictEqual(plainValue, '%25=v', 'percent is allowed, but need to be escaped');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "&"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('&', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the ampersand character');
		assert.strictEqual(plainValue, '&=v', 'ampersand is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "+"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('+', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the plus character');
		assert.strictEqual(plainValue, '+=v', 'plus is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "^"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('^', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the caret character');
		assert.strictEqual(plainValue, '^=v', 'caret is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "`"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('`', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the grave accent character');
		assert.strictEqual(plainValue, '`=v', 'grave accent is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - character allowed in the cookie-name "|"', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('|', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the pipe character');
		assert.strictEqual(plainValue, '|=v', 'pipe is allowed, should not encode');
	});
});

QUnit.test('RFC 6265 - characters allowed in the cookie-name should globally not be encoded', function (assert) {
	assert.expect(1);
	using(assert)
	.setCookie('||', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(plainValue, '||=v', 'should not encode all character occurrences');
	});
});

QUnit.test('cookie-name - 2 bytes characters', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('ã', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the ã character');
		assert.strictEqual(plainValue, '%C3%A3=v', 'should encode the ã character');
	});
});

QUnit.test('cookie-name - 3 bytes characters', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('₯', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should handle the ₯ character');
		assert.strictEqual(plainValue, '%E2%82%AF=v', 'should encode the ₯ character');
	});
});

QUnit.test('cookie-name - 4 bytes characters', function (assert) {
	assert.expect(2);
	using(assert)
	.setCookie('𩸽', 'v')
	.then(function (decodedValue, plainValue) {
		assert.strictEqual(decodedValue, 'v', 'should_handle the 𩸽 character');
		assert.strictEqual(plainValue, '%F0%A9%B8%BD=v', 'should encode the 𩸽 character');
	});
});
