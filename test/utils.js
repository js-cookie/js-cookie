/* global Cookies */

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

  window.quoted = function (input) {
    return '"' + input + '"'
  }
})()
