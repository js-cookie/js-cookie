import rfc6265Converter from './rfc6265'
import extend from './extend'

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = extend(defaultAttributes, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    value = converter.write(value, key)

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
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
        var name = rfc6265Converter.read(parts[0])
        jar[name] = converter.read(cookie, name)

        if (key === name) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  // Create an instance of the api while ensuring it cannot be
  // tampered with...
  return Object.freeze({
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
    withAttributes: function (attributes) {
      return init(this.converter, extend(this.attributes, attributes))
    },
    withConverter: function (converter) {
      return init(extend(this.converter, converter), this.attributes)
    },
    attributes: Object.freeze(defaultAttributes),
    converter: Object.freeze(converter)
  })
}

export default init(rfc6265Converter, { path: '/' })
