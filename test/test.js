var before = {
    setup: function () {
        document.cookie = 'c=; expires=' + new Date(0).toUTCString();
    }
};

module('read', before);

test('Read', function () {
    expect(3);

    equals($.cookie('c'), null);
    document.cookie = 'c=v';
    equals($.cookie('c'), 'v', 'Read cookie value');
    equals($.cookie('whatever'), null, 'Give null if cookie does not exist');
});

module('Write', before);

test('Write', function () {
    expect(3);

    equals($.cookie('c'), null);
    var cookie = $.cookie('c', 'v');
    equals(document.cookie, 'c=v', 'Write cookie value');
    equals(cookie, 'c=v', 'Return cookie');
});

module('Delete', before);

test('Delete', function () {
    expect(1);

    document.cookie = 'c=v';
    $.cookie('c', null);
    equals(document.cookie, '', 'Delete cookie');
});
