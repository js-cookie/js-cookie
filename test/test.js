var before = {
    setup: function () {
        document.cookie = 'c=; expires=' + new Date(0).toUTCString();
    }
};

module('read', before);

test('Read', function () {
    expect(2);

    equals($.cookie('c'), null);
    document.cookie = 'c=v';
    equals($.cookie('c'), 'v', 'Should read cookie value');
});

module('Write', before);

test('Write', function () {
    expect(2);

    equals($.cookie('c'), null);
    $.cookie('c', 'v');
    equals(document.cookie, 'c=v', 'Should write cookie value');
});

module('Delete', before);

test('Delete', function () {
    expect(1);

    document.cookie = "c=v";
    $.cookie('c', null);
    equals(document.cookie, '', 'Should delete cookie');
});
