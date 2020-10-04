exports.node = {
  shouldLoadApi: function (test) {
    test.expect(1)
    var Cookies = require('../dist/js.cookie.js')
    test.ok(!!Cookies.get, 'should load the Cookies API')
    test.done()
  },
  shouldNotThrowErrorForSetCallInNode: function (test) {
    test.expect(0)
    var Cookies = require('../dist/js.cookie.js')
    Cookies.set('anything')
    Cookies.set('anything', { path: '' })
    test.done()
  },
  shouldNotThrowErrorForGetCallInNode: function (test) {
    test.expect(0)
    var Cookies = require('../dist/js.cookie.js')
    Cookies.get('anything')
    test.done()
  },
  shouldNotThrowErrorForRemoveCallInNode: function (test) {
    test.expect(0)
    var Cookies = require('../dist/js.cookie.js')
    Cookies.remove('anything')
    Cookies.remove('anything', { path: '' })
    test.done()
  }
}
