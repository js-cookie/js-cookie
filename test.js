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
    
    // TODO test with ';' use encodeURI?
});

test('raw: true', 1, function () {
    document.cookie = 'c=%20v';
    equals($.cookie('c', { raw: true }), '%20v', 'should not decode');
});


module('write', before);

test('simple value', 2, function () {
    var cookie = $.cookie('c', 'v');
    equals(cookie, 'c=v', 'should return written cookie string');
    equals(document.cookie, 'c=v', 'should write String primitive');
});

test('raw: true', 1, function () {
    equals($.cookie('c', ' v', { raw: true }).split('=')[1],
        ' v', 'should not encode');
});


module('delete', before);

test('delete', 1, function () {
    document.cookie = 'c=v';
    $.cookie('c', null);
    equals(document.cookie, '', 'should delete with null as value');
});
