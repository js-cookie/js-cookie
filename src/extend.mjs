export default function () {
  var result = {}
  for (var i = 0; i < arguments.length; i++) {
    var attributes = arguments[i]
    for (var key in attributes) {
      result[key] = attributes[key]
    }
  }
  return result
}
