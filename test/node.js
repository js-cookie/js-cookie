/* global QUnit */
/* eslint-env node */
const Cookies = require('../dist/js.cookie.min.js')

QUnit.test('api', (assert) => {
  assert.ok(Cookies.get, 'get() expected to be defined')
  assert.ok(Cookies.set, 'set() expected to be defined')
  assert.ok(Cookies.remove, 'remove() expected to be defined')
})

QUnit.test('noop get', (assert) => {
  assert.expect(0)
  Cookies.get('anything')
})

QUnit.test('noop set', (assert) => {
  assert.expect(0)
  Cookies.set('anything')
})

QUnit.test('noop remove', (assert) => {
  assert.expect(0)
  Cookies.remove('anything')
})
