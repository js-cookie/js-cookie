# Server-side integration

There are some servers that are not compliant with the [RFC 6265](http://tools.ietf.org/html/rfc6265). For those, some characters that are not encoded by js-cookie might be treated differently.

Here we document the most important server-side peculiarities and their workarounds. Feel free to send a [Pull Request](https://github.com/js-cookie/js-cookie/blob/master/CONTRIBUTING.md#pull-requests) if you see something that can be improved.

*Disclaimer: This was built based on community provided information.*

## PHP

In PHP, `setcookie()` function encodes cookie values using `urlencode()` function, which applies `%`-encoding but also encodes spaces as `+` signs, [for historical reasons](http://php.net/manual/en/function.urlencode.php#function.urlencode). When cookies are read back via `$_COOKIE` or `filter_input(INPUT_COOKIE)`, they would go trough a decoding process which decodes `%`-encoded sequences and also converts `+` signs back to spaces. However, the plus (`+`) sign is valid cookie character by itself, which means that libraries that adhere to standards will interpret `+` signs differently to PHP.

This presents two types of problems:

1. PHP writes a cookie via `setcookie()` and all spaces get converted to `+` signs. js-cookie read `+` signs and uses them literally, since it is a valid cookie character.
2. js-cookie writes a cookie with a value that contains `+` signs and stores it as is, since it is a valid cookie character. PHP read a cookie and converts `+` signs to spaces.

To make both PHP and js-cookie play nicely together you need to write custom converters:

```javascript
var Cookies = Cookies.withConverter({
    write: function (value) {
        // Encode all characters according to the "encodeURIComponent" spec
        return encodeURIComponent(value)
            // Revert the characters that are unnecessarly encoded but are
            // allowed in a cookie value, except for the plus sign (%2B)
            .replace(/%(23|24|26|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
    },
    write: function (value) {
        return value
            // Decode all characters according to the "encodeURIComponent" spec
            .replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
            // Decode the plus sign to spaces
            .replace(/\+/g, ' ')
    }
});
```

Rack seems to have [a similar problem](https://github.com/js-cookie/js-cookie/issues/70#issuecomment-132503017).