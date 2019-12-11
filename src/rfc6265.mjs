export default {
  read: function (value) {
    return value.replace(/(%[\da-f]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346bf]|3[ac-f]|40|5[bde]|60|7[bcd])/gi,
      decodeURIComponent
    )
  }
}
