/**
 * @jest-environment browserstack
 */

/* global beforeAll, afterAll, describe, it, expect */

import Cookies from '../src/api.mjs'

let driver

describe('write', () => {
  beforeAll(async () => {
    driver = await global.__driver__()

    await driver.get('http://localhost:8080')
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  it('String primitive', async () => {
    await driver.executeScript("Cookies.set('c', 'v')")
    expect(await driver.manage().getCookie('c')).toBe('v')
  })

  // TODO: test this in browserstack via jest...
  it('empty value', async () => {
    // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
    // resulted in a bug while reading such a cookie.
    await driver.executeScript("Cookies.set('c', '')")
    expect(await driver.manage().getCookie('c')).toBe('')
  })
})
