/* global Cookies, QUnit, lifecycle, quoted */

QUnit.module('setup', lifecycle)

QUnit.test('api instance creation', function (assert) {
  assert.expect(4)

  var api

  api = Cookies.withAttributes({ path: '/bar' })
  assert.ok(
    api.set('c', 'v').match(/c=v; path=\/bar/),
    'should set up default cookie attributes'
  )
  api = Cookies.withAttributes({ sameSite: 'Lax' })
  assert.notOk(
    api.set('c', 'v').match(/c=v; path=\/bar/),
    'should set up cookie attributes each time from original'
  )

  api = Cookies.withConverter({
    write: function (value, name) {
      return value.toUpperCase()
    }
  }).withAttributes({ path: '/foo' })
  assert.ok(
    api.set('c', 'v').match(/c=V; path=\/foo/),
    'should allow setting up converters followed by default cookie attributes'
  )

  api = Cookies.withAttributes({ path: '/foo' }).withConverter({
    write: function (value, name) {
      return value.toUpperCase()
    }
  })
  assert.ok(
    api.set('c', 'v').match(/c=V; path=\/foo/),
    'should allow setting up default cookie attributes followed by converter'
  )
})

QUnit.test('api instance with attributes', function (assert) {
  assert.expect(3)

  // Create a new instance so we don't affect remaining tests...
  var api = Cookies.withAttributes({ path: '/' })

  delete api.attributes
  assert.ok(api.attributes, "won't allow to delete property")

  api.attributes = {}
  assert.ok(api.attributes.path, "won't allow to reassign property")

  api.attributes.path = '/foo'
  assert.equal(
    api.attributes.path,
    '/',
    "won't allow to reassign contained properties"
  )
})

QUnit.test('api instance with converter', function (assert) {
  assert.expect(3)

  var readConverter = function (value) {
    return value.toUpperCase()
  }

  // Create a new instance so we don't affect remaining tests...
  var api = Cookies.withConverter({
    read: readConverter
  })

  delete api.converter
  assert.ok(api.converter, "won't allow to delete property")

  api.converter = {}
  assert.ok(api.converter.read, "won't allow to reassign property")

  api.converter.read = function () {}
  assert.equal(
    api.converter.read.toString(),
    readConverter.toString(),
    "won't allow to reassign contained properties"
  )
})

// github.com/js-cookie/js-cookie/pull/171
QUnit.test('missing leading semicolon', function (assert) {
  assert.expect(1)
  var done = assert.async()
  var iframe = document.createElement('iframe')
  iframe.src = 'missing_semicolon.html'
  iframe.addEventListener('load', function () {
    assert.ok(
      iframe.contentWindow.__ok,
      'concatenate with 3rd party script without error'
    )
    done()
  })
  document.body.appendChild(iframe)
})

QUnit.module('read', lifecycle)

QUnit.test('simple value', function (assert) {
  assert.expect(1)
  document.cookie = 'c=v'
  assert.strictEqual(Cookies.get('c'), 'v', 'should return value')
})

QUnit.test('empty value', function (assert) {
  assert.expect(1)
  // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
  // resulted in a bug while reading such a cookie.
  Cookies.set('c', '')
  assert.strictEqual(Cookies.get('c'), '', 'should return value')
})

QUnit.test('not existing', function (assert) {
  assert.expect(1)
  assert.strictEqual(Cookies.get('whatever'), undefined, 'return undefined')
})

// github.com/carhartl/jquery-cookie/issues/50
QUnit.test('equality sign in cookie value', function (assert) {
  assert.expect(1)
  Cookies.set('c', 'foo=bar')
  assert.strictEqual(
    Cookies.get('c'),
    'foo=bar',
    'should include the entire value'
  )
})

// github.com/carhartl/jquery-cookie/issues/215
QUnit.test('percent character in cookie value', function (assert) {
  assert.expect(1)
  document.cookie = 'bad=foo%'
  assert.strictEqual(
    Cookies.get('bad'),
    'foo%',
    'should read the percent character'
  )
})

QUnit.test(
  'unencoded percent character in cookie value mixed with encoded values not permitted',
  function (assert) {
    assert.expect(1)
    document.cookie = 'bad=foo%bar%22baz%qux'
    assert.strictEqual(Cookies.get('bad'), undefined, 'should skip reading')
    document.cookie = 'bad=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
)

QUnit.test('lowercase percent character in cookie value', function (assert) {
  assert.expect(1)
  document.cookie = 'c=%d0%96'
  assert.strictEqual(
    Cookies.get('c'),
    'Ж',
    'should decode percent characters case insensitive'
  )
})

QUnit.test('Call to read all when there are cookies', function (assert) {
  Cookies.set('c', 'v')
  Cookies.set('foo', 'bar')
  assert.deepEqual(
    Cookies.get(),
    { c: 'v', foo: 'bar' },
    'returns object containing all cookies'
  )
})

QUnit.test('Call to read all when there are no cookies at all', function (
  assert
) {
  assert.deepEqual(Cookies.get(), {}, 'returns empty object')
})

QUnit.test('RFC 6265 - reading cookie-octet enclosed in DQUOTE', function (
  assert
) {
  assert.expect(1)
  document.cookie = 'c="v"'
  assert.strictEqual(
    Cookies.get('c'),
    'v',
    'should simply ignore quoted strings'
  )
})

// github.com/js-cookie/js-cookie/issues/196
QUnit.test(
  'Call to read cookie when there is another unrelated cookie with malformed encoding in the name',
  function (assert) {
    assert.expect(2)
    document.cookie = '%A1=foo'
    document.cookie = 'c=v'
    assert.strictEqual(
      Cookies.get('c'),
      'v',
      'should not throw a URI malformed exception when retrieving a single cookie'
    )
    assert.deepEqual(
      Cookies.get(),
      { c: 'v' },
      'should not throw a URI malformed exception when retrieving all cookies'
    )
    document.cookie = '%A1=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
)

// github.com/js-cookie/js-cookie/pull/62
QUnit.test(
  'Call to read cookie when there is another unrelated cookie with malformed encoding in the value',
  function (assert) {
    assert.expect(2)
    document.cookie = 'invalid=%A1'
    document.cookie = 'c=v'
    assert.strictEqual(
      Cookies.get('c'),
      'v',
      'should not throw a URI malformed exception when retrieving a single cookie'
    )
    assert.deepEqual(
      Cookies.get(),
      { c: 'v' },
      'should not throw a URI malformed exception when retrieving all cookies'
    )
    document.cookie = 'invalid=foo; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
)

// github.com/js-cookie/js-cookie/issues/145
QUnit.test(
  'Call to read cookie when passing an Object Literal as the second argument',
  function (assert) {
    assert.expect(1)
    Cookies.get('name', { path: '' })
    assert.strictEqual(document.cookie, '', 'should not create a cookie')
  }
)

QUnit.test('Passing `undefined` first argument', function (assert) {
  assert.expect(1)
  Cookies.set('foo', 'bar')
  assert.strictEqual(
    Cookies.get(undefined),
    undefined,
    'should not attempt to retrieve all cookies'
  )
})

QUnit.test('Passing `null` first argument', function (assert) {
  assert.expect(1)
  Cookies.set('foo', 'bar')
  assert.strictEqual(
    Cookies.get(null),
    undefined,
    'should not attempt to retrieve all cookies'
  )
})

QUnit.module('write', lifecycle)

QUnit.test('String primitive', function (assert) {
  assert.expect(1)
  Cookies.set('c', 'v')
  assert.strictEqual(Cookies.get('c'), 'v', 'should write value')
})

QUnit.test('String object', function (assert) {
  /* eslint-disable no-new-wrappers */
  assert.expect(1)
  Cookies.set('c', new String('v'))
  assert.strictEqual(Cookies.get('c'), 'v', 'should write value')
})

QUnit.test('value "[object Object]"', function (assert) {
  assert.expect(1)
  Cookies.set('c', '[object Object]')
  assert.strictEqual(Cookies.get('c'), '[object Object]', 'should write value')
})

QUnit.test('number', function (assert) {
  assert.expect(1)
  Cookies.set('c', 1234)
  assert.strictEqual(Cookies.get('c'), '1234', 'should write value')
})

QUnit.test('null', function (assert) {
  assert.expect(1)
  Cookies.set('c', null)
  assert.strictEqual(Cookies.get('c'), 'null', 'should write value')
})

QUnit.test('undefined', function (assert) {
  assert.expect(1)
  Cookies.set('c', undefined)
  assert.strictEqual(Cookies.get('c'), 'undefined', 'should write value')
})

QUnit.test('expires option as days from now', function (assert) {
  assert.expect(1)
  var days = 200
  var expires = new Date(new Date().valueOf() + days * 24 * 60 * 60 * 1000)
  var expected = 'expires=' + expires.toUTCString()
  var actual = Cookies.set('c', 'v', { expires: days })
  assert.ok(
    actual.indexOf(expected) !== -1,
    quoted(actual) + ' includes ' + quoted(expected)
  )
})

// github.com/carhartl/jquery-cookie/issues/246
QUnit.test('expires option as fraction of a day', function (assert) {
  assert.expect(1)

  var findValueForAttributeName = function (createdCookie, attributeName) {
    var pairs = createdCookie.split('; ')
    var foundAttributeValue
    pairs.forEach(function (pair) {
      if (pair.split('=')[0] === attributeName) {
        foundAttributeValue = pair.split('=')[1]
      }
    })
    return foundAttributeValue
  }
  var now = new Date()
  var stringifiedDate = findValueForAttributeName(
    Cookies.set('c', 'v', { expires: 0.5 }),
    'expires'
  )
  var expires = new Date(stringifiedDate)

  // When we were using Date.setDate() fractions have been ignored
  // and expires resulted in the current date. Allow 1000 milliseconds
  // difference for execution time because new Date() can be different,
  // even when it's run synchronously.
  // See https://github.com/js-cookie/js-cookie/commit/ecb597b65e4c477baa2b30a2a5a67fdaee9870ea#commitcomment-20146048.
  var assertion = expires.getTime() > now.getTime() + 1000
  var message =
    quoted(expires.getTime()) +
    ' should be greater than ' +
    quoted(now.getTime())
  assert.ok(assertion, message)
})

QUnit.test('expires option as Date instance', function (assert) {
  assert.expect(1)
  var sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  var expected = 'expires=' + sevenDaysFromNow.toUTCString()
  var actual = Cookies.set('c', 'v', { expires: sevenDaysFromNow })
  assert.ok(
    actual.indexOf(expected) !== -1,
    quoted(actual) + ' includes ' + quoted(expected)
  )
})

QUnit.test('return value', function (assert) {
  assert.expect(1)
  var expected = 'c=v'
  var actual = Cookies.set('c', 'v').substring(0, expected.length)
  assert.strictEqual(actual, expected, 'should return written cookie string')
})

QUnit.test('predefined path attribute', function (assert) {
  assert.expect(1)
  assert.ok(
    Cookies.set('c', 'v').match(/path=\/$/),
    'should use root path when not configured otherwise'
  )
})

QUnit.test('API for changing defaults', function (assert) {
  assert.expect(3)

  var api

  api = Cookies.withAttributes({ path: '/foo' })
  assert.ok(
    api.set('c', 'v').match(/path=\/foo/),
    'should use attributes from defaults'
  )
  assert.ok(
    api.set('c', 'v', { path: '/baz' }).match(/path=\/baz/),
    'attributes argument has precedence'
  )

  api = Cookies.withAttributes({ path: undefined })
  assert.notOk(api.set('c', 'v').match(/path=/), 'should not set any path')

  Cookies.remove('c')
})

QUnit.test('true secure value', function (assert) {
  assert.expect(1)
  var expected = 'c=v; path=/; secure'
  var actual = Cookies.set('c', 'v', { secure: true })
  assert.strictEqual(actual, expected, 'should add secure attribute')
})

// github.com/js-cookie/js-cookie/pull/54
QUnit.test('false secure value', function (assert) {
  assert.expect(1)
  var expected = 'c=v; path=/'
  var actual = Cookies.set('c', 'v', { secure: false })
  assert.strictEqual(
    actual,
    expected,
    'false should not modify path in cookie string'
  )
})

// github.com/js-cookie/js-cookie/issues/276
QUnit.test('unofficial attribute', function (assert) {
  assert.expect(1)
  var expected = 'c=v; path=/; unofficial=anything'
  var actual = Cookies.set('c', 'v', {
    unofficial: 'anything'
  })
  assert.strictEqual(
    expected,
    actual,
    'should write the cookie string with unofficial attribute'
  )
})

QUnit.test('undefined attribute value', function (assert) {
  assert.expect(5)
  assert.strictEqual(
    Cookies.set('c', 'v', {
      expires: undefined
    }),
    'c=v; path=/',
    'should not write undefined expires attribute'
  )
  assert.strictEqual(
    Cookies.set('c', 'v', {
      path: undefined
    }),
    'c=v',
    'should not write undefined path attribute'
  )
  assert.strictEqual(
    Cookies.set('c', 'v', {
      domain: undefined
    }),
    'c=v; path=/',
    'should not write undefined domain attribute'
  )
  assert.strictEqual(
    Cookies.set('c', 'v', {
      secure: undefined
    }),
    'c=v; path=/',
    'should not write undefined secure attribute'
  )
  assert.strictEqual(
    Cookies.set('c', 'v', {
      unofficial: undefined
    }),
    'c=v; path=/',
    'should not write undefined unofficial attribute'
  )
})

// github.com/js-cookie/js-cookie/issues/396
QUnit.test(
  'sanitization of attributes to prevent XSS from untrusted input',
  function (assert) {
    assert.expect(1)
    assert.strictEqual(
      Cookies.set('c', 'v', {
        path: '/;domain=sub.domain.com',
        domain: 'site.com;remove_this',
        customAttribute: 'value;;remove_this'
      }),
      'c=v; path=/; domain=site.com; customAttribute=value',
      'should not allow semicolon in a cookie attribute'
    )
  }
)

QUnit.module('remove', lifecycle)

QUnit.test('deletion', function (assert) {
  assert.expect(1)
  Cookies.set('c', 'v')
  Cookies.remove('c')
  assert.strictEqual(document.cookie, '', 'should delete the cookie')
})

QUnit.test('with attributes', function (assert) {
  assert.expect(1)
  var attributes = { path: '/' }
  Cookies.set('c', 'v', attributes)
  Cookies.remove('c', attributes)
  assert.strictEqual(document.cookie, '', 'should delete the cookie')
})

QUnit.test('passing attributes reference', function (assert) {
  assert.expect(1)
  var attributes = { path: '/' }
  Cookies.set('c', 'v', attributes)
  Cookies.remove('c', attributes)
  assert.deepEqual(attributes, { path: '/' }, "won't alter attributes object")
})

QUnit.module('Custom converters', lifecycle)

// github.com/carhartl/jquery-cookie/pull/166
QUnit.test(
  'provide a way for decoding characters encoded by the escape function',
  function (assert) {
    assert.expect(1)
    document.cookie = 'c=%u5317%u4eac'
    assert.strictEqual(
      Cookies.withConverter({ read: unescape }).get('c'),
      '北京',
      'should convert chinese characters correctly'
    )
  }
)

QUnit.test(
  'should decode a malformed char that matches the decodeURIComponent regex',
  function (assert) {
    assert.expect(1)
    document.cookie = 'c=%E3'
    var cookies = Cookies.withConverter({ read: unescape })
    assert.strictEqual(
      cookies.get('c'),
      'ã',
      'should convert the character correctly'
    )
    cookies.remove('c', {
      path: ''
    })
  }
)

QUnit.test(
  'should be able to conditionally decode a single malformed cookie',
  function (assert) {
    assert.expect(2)
    var cookies = Cookies.withConverter({
      read: function (value, name) {
        if (name === 'escaped') {
          return unescape(value)
        }
      }
    })

    document.cookie = 'escaped=%u5317'
    assert.strictEqual(
      cookies.get('escaped'),
      '北',
      'should use custom read converter when retrieving single cookies'
    )

    assert.deepEqual(
      cookies.get(),
      {
        escaped: '北'
      },
      'should use custom read converter when retrieving all cookies'
    )
  }
)

// github.com/js-cookie/js-cookie/issues/70
QUnit.test('should be able to set up a write decoder', function (assert) {
  assert.expect(1)
  Cookies.withConverter({
    write: function (value) {
      return value.replace('+', '%2B')
    }
  }).set('c', '+')
  assert.strictEqual(
    document.cookie,
    'c=%2B',
    'should call the write converter'
  )
})

QUnit.test('should be able to set up a read decoder', function (assert) {
  assert.expect(1)
  document.cookie = 'c=%2B'
  var cookies = Cookies.withConverter({
    read: function (value) {
      return value.replace('%2B', '+')
    }
  })
  assert.strictEqual(cookies.get('c'), '+', 'should call the read converter')
})

QUnit.test('should be able to extend read decoder', function (assert) {
  assert.expect(1)
  document.cookie = 'c=A%23'
  var cookies = Cookies.withConverter({
    read: function (value) {
      var decoded = value.replace('A', 'a')
      return Cookies.converter.read(decoded)
    }
  })
  assert.strictEqual(cookies.get('c'), 'a#', 'should call both read converters')
})

QUnit.test('should be able to extend write decoder', function (assert) {
  assert.expect(1)
  Cookies.withConverter({
    write: function (value) {
      var encoded = value.replace('a', 'A')
      return Cookies.converter.write(encoded)
    }
  }).set('c', 'a%')
  assert.strictEqual(
    document.cookie,
    'c=A%25',
    'should call both write converters'
  )
})

QUnit.test('should be able to convert incoming, non-String values', function (
  assert
) {
  assert.expect(1)
  Cookies.withConverter({
    write: function (value) {
      return JSON.stringify(value)
    }
  }).set('c', { foo: 'bar' })
  assert.strictEqual(
    document.cookie,
    'c={"foo":"bar"}',
    'should convert object as JSON string'
  )
})

QUnit.module('noConflict', lifecycle)

QUnit.test('do not conflict with existent globals', function (assert) {
  assert.expect(2)
  var Cookies = window.Cookies.noConflict()
  Cookies.set('c', 'v')
  assert.strictEqual(Cookies.get('c'), 'v', 'should work correctly')
  assert.strictEqual(
    window.Cookies,
    'existent global',
    'should restore the original global'
  )
  window.Cookies = Cookies
})
