function extend () {
  var result = {}
  for (var i = 0; i < arguments.length; i++) {
    var attributes = arguments[i]
    for (var key in attributes) {
      result[key] = attributes[key]
    }
  }
  return result
}

function decode (s) {
  return s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
}

function init (converter) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = extend(api.defaults, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    value = converter.write
      ? converter.write(value, key)
      : encodeURIComponent(String(value)).replace(
        /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
        decodeURIComponent
      )

    key = encodeURIComponent(String(key))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    var stringifiedAttributes = ''
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
    }

    return (document.cookie = key + '=' + value + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : []
    var jar = {}
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=')
      var cookie = parts.slice(1).join('=')

      if (cookie.charAt(0) === '"') {
        cookie = cookie.slice(1, -1)
      }

      try {
        var name = decode(parts[0])
        jar[name] =
          (converter.read || converter)(cookie, name) || decode(cookie)

        if (key === name) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  var api = {
    defaults: {
      path: '/'
    },
    set: set,
    get: get,
    remove: function (key, attributes) {
      set(
        key,
        '',
        extend(attributes, {
          expires: -1
        })
      )
    },
    withConverter: init
  }

  return api
}

export default init(function () {})
