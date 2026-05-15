export default function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]
    for (var key in source) {
      if (key === '__proto__') continue
      target[key] = source[key]
    }
  }
  return target
}
