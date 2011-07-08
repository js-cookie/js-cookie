var before = {
    setup: function () {
        cookies = document.cookie.split('; ')
        for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
        }
    }
};


module('read', before);

test('simple value', 1, function () {
    document.cookie = 'c=v';
    equals($.cookie('c'), 'v', 'should return value');
});

test('not existing', 1, function () {
    equals($.cookie('whatever'), null, 'should return null');
});

test('decode', 1, function () {
    document.cookie = encodeURIComponent(' c') + '=' + encodeURIComponent(' v');
    equals($.cookie(' c'), ' v', 'should decode key and value');
});

test('raw: true', 1, function () {
    document.cookie = 'c=%20v';
    equals($.cookie('c', { raw: true }), '%20v', 'should not decode');
});


module('write', before);

test('String primitive', 1, function () {
    $.cookie('c', 'v');
    equals(document.cookie, 'c=v', 'should write value');
});

test('String object', 1, function () {
    $.cookie('c', new String('v'));
    equals(document.cookie, 'c=v', 'should write value');
});

test('return', 1, function () {
    equals($.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

test('raw: true', 1, function () {
    equals($.cookie('c', ' v', { raw: true }).split('=')[1],
        ' v', 'should not encode');
});


module('delete', before);

test('delete', 2, function () {
    document.cookie = 'c=v';
    $.cookie('c', null);
    equals(document.cookie, '', 'should delete with null as value');

    document.cookie = 'c=v';
    $.cookie('c', undefined);
    equals(document.cookie, '', 'should delete with undefined as value');
});
