var before = {
    setup: function () {
        document.cookie = 'c=; expires=' + new Date(0).toUTCString();
        document.cookie = encodeURIComponent(' foo ') + '=; expires=' + new Date(0).toUTCString();
        document.cookie = 'raw=; expires=' + new Date(0).toUTCString();
    }
};

module('read', before);

test('Read', function () {
    expect(5);

    equals($.cookie('c'), null);
    document.cookie = 'c=v';
    equals($.cookie('c'), 'v', 'Read cookie value');

    document.cookie = encodeURIComponent(' foo ') + '=' + encodeURIComponent(' bar ');
    equals($.cookie(' foo '), ' bar ', 'Decode key/value');

    document.cookie = 'raw=%20whatever';
    equals($.cookie('raw', { raw: true }), '%20whatever', 'Do not decode with raw set true');

    equals($.cookie('whatever'), null, 'Give null if cookie does not exist');
});

module('Write', before);

test('Write', function () {
    expect(4);

    equals($.cookie('c'), null);
    var cookie = $.cookie('c', 'v');
    equals(document.cookie, 'c=v', 'Write cookie value');
    equals(cookie, 'c=v', 'Return cookie string');
    equals($.cookie('raw', ' whatever', { raw: true }).split('=')[1], ' whatever', 'Do not encode with raw set true');
});

module('Delete', before);

test('Delete', function () {
    expect(1);

    document.cookie = 'c=v';
    $.cookie('c', null);
    equals(document.cookie, '', 'Delete cookie');
});
