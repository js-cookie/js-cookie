const { Builder } = require('selenium-webdriver')
const { BrowserStackSdk } = require('browserstack-node-sdk')

const TEST_URL = 'http://localhost:9998/test'
const TEST_TIMEOUT_MS = 5 * 60 * 1000

function getSummary(report) {
  const counts = report.testCounts || {}
  const tests = Array.isArray(report.tests) ? report.tests : []

  if (tests.length > 0) {
    const failed = tests.filter((test) => test.status === 'failed').length
    const passed = tests.filter((test) => test.status === 'passed').length

    return {
      failed,
      passed,
      total: tests.length
    }
  }

  return {
    failed: Number(counts.failed || 0),
    passed: Number(counts.passed || 0),
    total: Number(counts.total || 0)
  }
}

function getFailedTests(tests) {
  return tests
    .filter((test) => test.status === 'failed')
    .map((test) => {
      const message =
        (test.errors[0] && test.errors[0].message) || 'Assertion failed'
      return `${test.fullName.join(' > ')}: ${message}`
    })
}

async function setSessionStatus(driver, status, reason) {
  const command = {
    action: 'setSessionStatus',
    arguments: { status, reason }
  }

  try {
    await driver.executeScript(
      `browserstack_executor: ${JSON.stringify(command)}`
    )
  } catch {
    // No-op when executor is unavailable.
  }
}

async function run() {
  let driver

  try {
    driver = await new Builder().build()
    await driver.get(TEST_URL)

    await driver.wait(async () => {
      return driver.executeScript(
        'return Boolean(window.__qunitJsReporter && window.__qunitJsReporter.suite)'
      )
    }, TEST_TIMEOUT_MS)

    const report = await driver.executeScript(`
      return (function () {
        if (!window.__qunitJsReporter || !window.__qunitJsReporter.suite) {
          return null
        }

        var suite = window.__qunitJsReporter.suite
        var tests = (window.__qunitJsReporter.tests || []).map(function (test) {
          return {
            fullName: test.fullName || [test.name || 'Unnamed test'],
            status: test.status,
            errors: (test.errors || []).map(function (error) {
              return {
                message: error && error.message ? error.message : ''
              }
            })
          }
        })

        return {
          status: suite.status,
          testCounts: suite.testCounts || {},
          tests: tests
        }
      })()
    `)

    if (!report) {
      throw new Error(
        'QUnit js-reporters results were not found on the test page'
      )
    }

    const summary = getSummary(report)
    if (summary.failed > 0 || report.status !== 'passed') {
      const failedTests = getFailedTests(report.tests).join('\n')
      const reason = `${summary.failed}/${summary.total} tests failed`

      await setSessionStatus(driver, 'failed', reason)
      throw new Error([reason, failedTests].filter(Boolean).join('\n'))
    }

    const platform = BrowserStackSdk.getCurrentPlatform()
    const testInstance = platform.os
      ? `${platform.browserName} ${platform.browserVersion}, ${platform.os} ${platform.osVersion}`
      : `${platform.browserName.charAt(0).toUpperCase()}${platform.browserName.slice(1)}, ${platform.deviceName}`
    const reason = `${testInstance} => ${summary.passed}/${summary.total} tests passed`
    await setSessionStatus(driver, 'passed', reason)
    console.log(reason)
  } catch (error) {
    if (driver) {
      await setSessionStatus(
        driver,
        'failed',
        error && error.message
          ? error.message.slice(0, 250)
          : 'Test execution failed'
      )
    }

    console.error(error && error.stack ? error.stack : error)
    globalThis.process.exitCode = 1
  } finally {
    if (driver) {
      await driver.quit()
    }
  }
}

run()
