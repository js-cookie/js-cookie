/* global Cookies, QUnit */

;(function () {
  window.lifecycle = {
    afterEach: function () {
      // Remove the cookies created using js-cookie default attributes
      Object.keys(Cookies.get()).forEach(function (cookie) {
        Cookies.remove(cookie)
      })
      // Remove the cookies created using browser default attributes
      Object.keys(Cookies.get()).forEach(function (cookie) {
        Cookies.remove(cookie, {
          path: ''
        })
      })
    }
  }

  window.using = function (assert) {
    function getQuery (key) {
      var queries = window.location.href.split('?')[1]
      if (!queries) {
        return
      }
      var pairs = queries.split(/&|=/)
      var indexBaseURL = pairs.indexOf(key)
      var result = pairs[indexBaseURL + 1]
      if (result) {
        return decodeURIComponent(result)
      }
    }
    function setCookie (name, value) {
      return {
        then: function (callback) {
          var iframe = document.getElementById('request_target')
          var serverURL = getQuery('integration_baseurl')
          Cookies.set(name, value)
          if (!serverURL) {
            callback(Cookies.get(name), document.cookie)
          } else {
            var requestURL = [
              serverURL,
              'encoding?',
              'name=' + encodeURIComponent(name),
              '&value=' + encodeURIComponent(value)
            ].join('')
            var done = assert.async()
            iframe.addEventListener('load', function () {
              var iframeDocument = iframe.contentWindow.document
              var root = iframeDocument.documentElement
              var content = root.textContent
              if (!content) {
                QUnit.ok(
                  false,
                  ['"' + requestURL + '"', 'content should not be empty'].join(
                    ' '
                  )
                )
                done()
                return
              }
              try {
                var result = JSON.parse(content)
                callback(result.value, iframeDocument.cookie)
              } finally {
                done()
              }
            })
            iframe.src = requestURL
          }
        }
      }
    }
    return {
      setCookie: setCookie
    }
  }

  window.quoted = function (input) {
    return '"' + input + '"'
  }
})()
