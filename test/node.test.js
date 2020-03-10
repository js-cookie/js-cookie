/**
 * @jest-environment node
 */

/* global test, expect */

import Cookies from '../src/api.mjs'

test('set noop', () => {
  expect(() => Cookies.set('anything', 'something')).not.toThrow()
})

test('get noop', () => {
  expect(() => Cookies.get('anything')).not.toThrow()
})

test('remove noop', () => {
  expect(() => Cookies.remove('anything')).not.toThrow()
})
