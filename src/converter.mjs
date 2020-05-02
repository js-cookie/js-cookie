export default {
  read: function (value) {
    return value.replace(/%3B/g, ';')
  },
  write: function (value) {
    return String(value).replace(/;/g, '%3B')
  }
}
