/* global Cookies */
/* eslint-disable no-var */

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
              try {
                var result = JSON.parse(
                  iframeDocument.documentElement.textContent
                )
                callback(result.value, iframeDocument.cookie)
                done()
              } catch (e) {}
            })
            iframe.src = requestURL
          }
        }
      }
    }
    return {
      setCookie
    }
  }

  window.quoted = function (input) {
    return '"' + input + '"'
  }
})()

/* eslint-enable no-var */
