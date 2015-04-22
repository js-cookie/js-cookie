/*global lifecycle: true*/

module('cookie-value encoding', lifecycle);

test('cookie-value with double quotes', function () {
	expect(1);
	Cookies.set('c', '"');
	strictEqual(Cookies.get('c'), '"', 'should print the quote character');
});

test('cookie-value with double quotes in the left', function () {
	expect(1);
	Cookies.set('c', '"content');
	strictEqual(Cookies.get('c'), '"content', 'should print the quote character');
});

test('cookie-value with double quotes in the right', function () {
	expect(1);
	Cookies.set('c', 'content"');
	strictEqual(Cookies.get('c'), 'content"', 'should print the quote character');
});

test('RFC 6265 - character not allowed in the cookie-value " "', function () {
	expect(2);
	Cookies.set('c', ' ');
	strictEqual(Cookies.get('c'), ' ', 'should handle the whitespace character');
	strictEqual(document.cookie, 'c=%20', 'whitespace is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-value ","', function () {
	expect(2);
	Cookies.set('c', ',');
	strictEqual(Cookies.get('c'), ',', 'should handle the comma character');
	strictEqual(document.cookie, 'c=%2C', 'comma is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-value ";"', function () {
	expect(2);
	Cookies.set('c', ';');
	strictEqual(Cookies.get('c'), ';', 'should handle the semicolon character');
	strictEqual(document.cookie, 'c=%3B', 'semicolon is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-value "\\"', function () {
	expect(2);
	Cookies.set('c', '\\');
	strictEqual(Cookies.get('c'), '\\', 'should handle the backslash character');
	strictEqual(document.cookie, 'c=%5C', 'backslash is not allowed, need to encode');
});

test('RFC 6265 - characters not allowed in the cookie-value should be replaced globally', function () {
	expect(2);
	Cookies.set('c', ';;');
	strictEqual(Cookies.get('c'), ';;', 'should handle multiple not allowed characters');
	strictEqual(document.cookie, 'c=%3B%3B', 'should replace multiple not allowed characters');
});

test('RFC 6265 - character allowed in the cookie-value "#"', function () {
	expect(2);
	Cookies.set('c', '#');
	strictEqual(Cookies.get('c'), '#', 'should handle the sharp character');
	strictEqual(document.cookie, 'c=#', 'sharp is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "$"', function () {
	expect(2);
	Cookies.set('c', '$');
	strictEqual(Cookies.get('c'), '$', 'should handle the dollar sign character');
	strictEqual(document.cookie, 'c=$', 'dollar sign is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "%"', function () {
	expect(2);
	Cookies.set('c', '%');
	strictEqual(Cookies.get('c'), '%', 'should handle the percent character');
	strictEqual(document.cookie, 'c=%25', 'percent is allowed, but need to be escaped');
});

test('RFC 6265 - character allowed in the cookie-value "&"', function () {
	expect(2);
	Cookies.set('c', '&');
	strictEqual(Cookies.get('c'), '&', 'should handle the ampersand character');
	strictEqual(document.cookie, 'c=&', 'ampersand is allowed, should not encode');
});

// github.com/carhartl/jquery-cookie/pull/62
test('RFC 6265 - character allowed in the cookie-value "+"', function () {
	expect(2);
	Cookies.set('c', '+');
	strictEqual(Cookies.get('c'), '+', 'should handle the plus character');
	strictEqual(document.cookie, 'c=+', 'plus is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value ":"', function () {
	expect(2);
	Cookies.set('c', ':');
	strictEqual(Cookies.get('c'), ':', 'should handle the colon character');
	strictEqual(document.cookie, 'c=:', 'colon is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "<"', function () {
	expect(2);
	Cookies.set('c', '<');
	strictEqual(Cookies.get('c'), '<', 'should handle the less-than character');
	strictEqual(document.cookie, 'c=<', 'less-than is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value ">"', function () {
	expect(2);
	Cookies.set('c', '>');
	strictEqual(Cookies.get('c'), '>', 'should handle the greater-than character');
	strictEqual(document.cookie, 'c=>', 'greater-than is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "="', function () {
	expect(2);
	Cookies.set('c', '=');
	strictEqual(Cookies.get('c'), '=', 'should handle the equal sign character');
	strictEqual(document.cookie, 'c==', 'equal sign is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "/"', function () {
	expect(2);
	Cookies.set('c', '/');
	strictEqual(Cookies.get('c'), '/', 'should handle the slash character');
	strictEqual(document.cookie, 'c=/', 'slash is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "?"', function () {
	expect(2);
	Cookies.set('c', '?');
	strictEqual(Cookies.get('c'), '?', 'should handle the question mark character');
	strictEqual(document.cookie, 'c=?', 'question mark is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "@"', function () {
	expect(2);
	Cookies.set('c', '@');
	strictEqual(Cookies.get('c'), '@', 'should handle the at character');
	strictEqual(document.cookie, 'c=@', 'at is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "["', function () {
	expect(2);
	Cookies.set('c', '[');
	strictEqual(Cookies.get('c'), '[', 'should handle the opening square bracket character');
	strictEqual(document.cookie, 'c=[', 'opening square bracket is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "]"', function () {
	expect(2);
	Cookies.set('c', ']');
	strictEqual(Cookies.get('c'), ']', 'should handle the closing square bracket character');
	strictEqual(document.cookie, 'c=]', 'closing square bracket is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "^"', function () {
	expect(2);
	Cookies.set('c', '^');
	strictEqual(Cookies.get('c'), '^', 'should handle the caret character');
	strictEqual(document.cookie, 'c=^', 'caret is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "`"', function () {
	expect(2);
	Cookies.set('c', '`');
	strictEqual(Cookies.get('c'), '`', 'should handle the grave accent character');
	strictEqual(document.cookie, 'c=`', 'grave accent is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "{"', function () {
	expect(2);
	Cookies.set('c', '{');
	strictEqual(Cookies.get('c'), '{', 'should handle the opening curly bracket character');
	strictEqual(document.cookie, 'c={', 'opening curly bracket is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "}"', function () {
	expect(2);
	Cookies.set('c', '}');
	strictEqual(Cookies.get('c'), '}', 'should handle the closing curly bracket character');
	strictEqual(document.cookie, 'c=}', 'closing curly bracket is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-value "|"', function () {
	expect(2);
	Cookies.set('c', '|');
	strictEqual(Cookies.get('c'), '|', 'should handle the pipe character');
	strictEqual(document.cookie, 'c=|', 'pipe is allowed, should not encode');
});

test('RFC 6265 - characters allowed in the cookie-value should globally not be encoded', function () {
	expect(1);
	Cookies.set('c', '{{');
	strictEqual(document.cookie, 'c={{', 'should not encode all the character occurrences');
});

test('cookie-value - 2 bytes character (ã)', function () {
	expect(2);

	Cookies.set('c', 'ã');
	strictEqual(Cookies.get('c'), 'ã', 'should handle the ã character');
	strictEqual(document.cookie, 'c=%C3%A3', 'should encode the ã character');
});

test('cookie-value - 3 bytes character (₯)', function () {
	expect(2);

	Cookies.set('c', '₯');
	strictEqual(Cookies.get('c'), '₯', 'should handle the ₯ character');
	strictEqual(document.cookie, 'c=%E2%82%AF', 'should encode the ₯ character');
});

test('cookie-value - 4 bytes character (𩸽)', function () {
	expect(2);

	Cookies.set('c', '𩸽');
	strictEqual(Cookies.get('c'), '𩸽', 'should handle the 𩸽 character');
	strictEqual(document.cookie, 'c=%F0%A9%B8%BD', 'should encode the 𩸽 character');
});

module('cookie-name encoding', lifecycle);

test('RFC 6265 - character not allowed in the cookie-name "("', function () {
	expect(2);
	Cookies.set('(', 'v');
	strictEqual(Cookies.get('('), 'v', 'should handle the opening parens character');
	strictEqual(document.cookie, '%28=v', 'opening parens is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name ")"', function () {
	expect(2);
	Cookies.set(')', 'v');
	strictEqual(Cookies.get(')'), 'v', 'should handle the closing parens character');
	strictEqual(document.cookie, '%29=v', 'closing parens is not allowed, need to encode');
});

test('RFC 6265 - should replace parens globally', function () {
	expect(1);
	Cookies.set('(())', 'v');
	strictEqual(document.cookie, '%28%28%29%29=v', 'encode with global replace');
});

test('RFC 6265 - character not allowed in the cookie-name "<"', function () {
	expect(2);
	Cookies.set('<', 'v');
	strictEqual(Cookies.get('<'), 'v', 'should handle the less-than character');
	strictEqual(document.cookie, '%3C=v', 'less-than is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name ">"', function () {
	expect(2);
	Cookies.set('>', 'v');
	strictEqual(Cookies.get('>'), 'v', 'should handle the greater-than character');
	strictEqual(document.cookie, '%3E=v', 'greater-than is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "@"', function () {
	expect(2);
	Cookies.set('@', 'v');
	strictEqual(Cookies.get('@'), 'v', 'should handle the at character');
	strictEqual(document.cookie, '%40=v', 'at is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name ","', function () {
	expect(2);
	Cookies.set(',', 'v');
	strictEqual(Cookies.get(','), 'v', 'should handle the comma character');
	strictEqual(document.cookie, '%2C=v', 'comma is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name ";"', function () {
	expect(2);
	Cookies.set(';', 'v');
	strictEqual(Cookies.get(';'), 'v', 'should handle the semicolon character');
	strictEqual(document.cookie, '%3B=v', 'semicolon is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name ":"', function () {
	expect(2);
	Cookies.set(':', 'v');
	strictEqual(Cookies.get(':'), 'v', 'should handle the colon character');
	strictEqual(document.cookie, '%3A=v', 'colon is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "\\"', function () {
	expect(2);
	Cookies.set('\\', 'v');
	strictEqual(Cookies.get('\\'), 'v', 'should handle the backslash character');
	strictEqual(document.cookie, '%5C=v', 'backslash is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "\""', function () {
	expect(2);
	Cookies.set('"', 'v');
	strictEqual(Cookies.get('"'), 'v', 'should handle the double quote character');
	strictEqual(document.cookie, '%22=v', 'double quote is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "/"', function () {
	expect(2);
	Cookies.set('/', 'v');
	strictEqual(Cookies.get('/'), 'v', 'should handle the slash character');
	strictEqual(document.cookie, '%2F=v', 'slash is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "["', function () {
	expect(2);
	Cookies.set('[', 'v');
	strictEqual(Cookies.get('['), 'v', 'should handle the opening square brackets character');
	strictEqual(document.cookie, '%5B=v', 'opening square brackets is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "]"', function () {
	expect(2);
	Cookies.set(']', 'v');
	strictEqual(Cookies.get(']'), 'v', 'should handle the closing square brackets character');
	strictEqual(document.cookie, '%5D=v', 'closing square brackets is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "?"', function () {
	expect(2);
	Cookies.set('?', 'v');
	strictEqual(Cookies.get('?'), 'v', 'should handle the question mark character');
	strictEqual(document.cookie, '%3F=v', 'question mark is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "="', function () {
	expect(2);
	Cookies.set('=', 'v');
	strictEqual(Cookies.get('='), 'v', 'should handle the equal sign character');
	strictEqual(document.cookie, '%3D=v', 'equal sign is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "{"', function () {
	expect(2);
	Cookies.set('{', 'v');
	strictEqual(Cookies.get('{'), 'v', 'should handle the opening curly brackets character');
	strictEqual(document.cookie, '%7B=v', 'opening curly brackets is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "}"', function () {
	expect(2);
	Cookies.set('}', 'v');
	strictEqual(Cookies.get('}'), 'v', 'should handle the closing curly brackets character');
	strictEqual(document.cookie, '%7D=v', 'closing curly brackets is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name "\\t"', function () {
	expect(2);
	Cookies.set('	', 'v');
	strictEqual(Cookies.get('	'), 'v', 'should handle the horizontal tab character');
	strictEqual(document.cookie, '%09=v', 'horizontal tab is not allowed, need to encode');
});

test('RFC 6265 - character not allowed in the cookie-name " "', function () {
	expect(2);
	Cookies.set(' ', 'v');
	strictEqual(Cookies.get(' '), 'v', 'should handle the whitespace character');
	strictEqual(document.cookie, '%20=v', 'whitespace is not allowed, need to encode');
});

test('RFC 6265 - character allowed in the cookie-name "#"', function () {
	expect(2);
	Cookies.set('#', 'v');
	strictEqual(Cookies.get('#'), 'v', 'should handle the sharp character');
	strictEqual(document.cookie, '#=v', 'sharp is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-name "$"', function () {
	expect(2);
	Cookies.set('$', 'v');
	strictEqual(Cookies.get('$'), 'v', 'should handle the dollar sign character');
	strictEqual(document.cookie, '$=v', 'dollar sign is allowed, should not encode');
});

test('RFC 6265 - character allowed in cookie-name "%"', function () {
	expect(2);
	Cookies.set('%', 'v');
	strictEqual(Cookies.get('%'), 'v', 'should handle the percent character');
	strictEqual(document.cookie, '%25=v', 'percent is allowed, but need to be escaped');
});

test('RFC 6265 - character allowed in the cookie-name "&"', function () {
	expect(2);
	Cookies.set('&', 'v');
	strictEqual(Cookies.get('&'), 'v', 'should handle the ampersand character');
	strictEqual(document.cookie, '&=v', 'ampersand is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-name "+"', function () {
	expect(2);
	Cookies.set('+', 'v');
	strictEqual(Cookies.get('+'), 'v', 'should handle the plus character');
	strictEqual(document.cookie, '+=v', 'plus is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-name "^"', function () {
	expect(2);
	Cookies.set('^', 'v');
	strictEqual(Cookies.get('^'), 'v', 'should handle the caret character');
	strictEqual(document.cookie, '^=v', 'caret is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-name "`"', function () {
	expect(2);
	Cookies.set('`', 'v');
	strictEqual(Cookies.get('`'), 'v', 'should handle the grave accent character');
	strictEqual(document.cookie, '`=v', 'grave accent is allowed, should not encode');
});

test('RFC 6265 - character allowed in the cookie-name "|"', function () {
	expect(2);
	Cookies.set('|', 'v');
	strictEqual(Cookies.get('|'), 'v', 'should handle the pipe character');
	strictEqual(document.cookie, '|=v', 'pipe is allowed, should not encode');
});

test('RFC 6265 - characters allowed in the cookie-name should globally not be encoded', function () {
	expect(1);
	Cookies.set('||', 'v');
	strictEqual(document.cookie, '||=v', 'should not encode all character occurrences');
});

test('cookie-name - 2 bytes characters', function () {
	expect(2);

	Cookies.set('ã', 'v');
	strictEqual(Cookies.get('ã'), 'v', 'should handle the ã character');
	strictEqual(document.cookie, '%C3%A3=v', 'should encode the ã character');
	Cookies.remove('ã');
});

test('cookie-name - 3 bytes characters', function () {
	expect(2);

	Cookies.set('₯', 'v');
	strictEqual(Cookies.get('₯'), 'v', 'should handle the ₯ character');
	strictEqual(document.cookie, '%E2%82%AF=v', 'should encode the ₯ character');
	Cookies.remove('₯');
});

test('cookie-name - 4 bytes characters', function () {
	expect(2);

	Cookies.set('𩸽', 'v');
	strictEqual(Cookies.get('𩸽'), 'v', 'should_handle the 𩸽 character');
	strictEqual(document.cookie, '%F0%A9%B8%BD=v', 'should encode the 𩸽 character');
	Cookies.remove('𩸽');
});
