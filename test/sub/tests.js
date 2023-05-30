/* global Cookies, QUnit, lifecycle */

QUnit.module('read', lifecycle)

QUnit.test('Read all with shadowed cookie', function (assert) {
  Cookies.set('c', 'v', { path: '/' })
  Cookies.set('c', 'w', { path: '/sub' })
  assert.deepEqual(Cookies.get(), { c: 'w' }, 'returns first found cookie')
})
