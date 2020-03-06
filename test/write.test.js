/* global test, expect */

import Cookies from '../src/api.mjs'

test('String primitive', () => {
  Cookies.set('c', 'v')
  expect(document.cookie).toBe('c=v')
})
