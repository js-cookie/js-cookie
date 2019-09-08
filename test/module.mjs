/* global QUnit */

import Cookies from '../dist/js.cookie.min.mjs'

QUnit.test('default export', function (test) {
  test.expect(1)
  test.ok(!!Cookies.get, 'should provide API')
})
