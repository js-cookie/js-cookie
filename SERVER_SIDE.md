# Server-side integration

There are some servers that are not compliant with the [RFC 6265](https://tools.ietf.org/html/rfc6265). For those, some characters that are not encoded by JavaScript Cookie might be treated differently.

Here we document the most important server-side peculiarities and their workarounds. Feel free to send a [Pull Request](https://github.com/js-cookie/js-cookie/blob/master/CONTRIBUTING.md#pull-requests) if you see something that can be improved.

_Disclaimer: This documentation is entirely based on community provided information. The examples below should be used only as a reference._

## PHP

In PHP, `setcookie()` function encodes cookie values using `urlencode()` function, which applies `%`-encoding but also encodes spaces as `+` signs, [for historical reasons](http://php.net/manual/en/function.urlencode.php#function.urlencode). When cookies are read back via `$_COOKIE` or `filter_input(INPUT_COOKIE)`, they would go trough a decoding process which decodes `%`-encoded sequences and also converts `+` signs back to spaces. However, the plus (`+`) sign is valid cookie character by itself, which means that libraries that adhere to standards will interpret `+` signs differently to PHP.

This presents two types of problems:

1. PHP writes a cookie via `setcookie()` and all spaces get converted to `+` signs. JavaScript Cookie read `+` signs and uses them literally, since it is a valid cookie character.
2. JavaScript Cookie writes a cookie with a value that contains `+` signs and stores it as is, since it is a valid cookie character. PHP read a cookie and converts `+` signs to spaces.

To make both PHP and JavaScript Cookie play nicely together?

**In PHP**, use `setrawcookie()` instead of `setcookie()`:

```php
setrawcookie($name, rawurlencode($value));
```

**In JavaScript**, use a custom converter.

**Example**:

```javascript
var PHPCookies = Cookies.withConverter({
  write: Cookies.converter.write,
  read: function (value) {
    // Decode the plus sign to spaces first, otherwise "legit" encoded pluses
    // will be replaced incorrectly
    value = value.replace(/\+/g, ' ')
    // Decode all characters according to the "encodeURIComponent" spec
    return Cookies.converter.read(value)
  }
})
```

Rack seems to have [a similar problem](https://github.com/js-cookie/js-cookie/issues/70#issuecomment-132503017).

## Tomcat

### Version >= 7.x

It seems that there is a situation where Tomcat does not [read the parens correctly](https://github.com/js-cookie/js-cookie/issues/92#issue-107743407). To fix this you need to write a custom write converter.

**Example**:

```javascript
var TomcatCookies = Cookies.withConverter({
  write: function (value) {
    return (
      Cookies.converter
        .write(value)
        // Encode the parens that are interpreted incorrectly by Tomcat
        .replace(/[()]/g, escape)
    )
  },
  read: Cookies.converter.read
})
```

### Version >= 8.0.15

Since Tomcat 8.0.15, it is possible to configure RFC 6265 compliance by changing your `conf/context.xml` file and adding the new [CookieProcessor](https://tomcat.apache.org/tomcat-8.0-doc/config/cookie-processor.html) nested inside the Context element. It would be like this:

```xml
<Context>
  <CookieProcessor className="org.apache.tomcat.util.http.Rfc6265CookieProcessor"/>
</context>
```

And you're all done.

Alternatively, you can check the [Java Cookie](https://github.com/js-cookie/java-cookie) project, which integrates nicely with JavaScript Cookie.

## JBoss 7.1.1

It seems that the servlet implementation of JBoss 7.1.1 [does not read some characters correctly](https://github.com/js-cookie/js-cookie/issues/70#issuecomment-148944674), even though they are allowed as per [RFC 6265](https://tools.ietf.org/html/rfc6265#section-4.1.1). To fix this you need to write a custom converter to send those characters correctly.

**Example**:

```javascript
var JBossCookies = Cookies.withConverter({
  write: function (value) {
    return (
      Cookies.converter
        .write(value)
        // Encode again the characters that are not allowed in JBoss 7.1.1, like "[" and "]":
        .replace(/[[\]]/g, encodeURIComponent)
    )
  },
  read: Cookies.converter.read
})
```

Alternatively, you can check the [Java Cookie](https://github.com/js-cookie/java-cookie) project, which integrates nicely with JavaScript Cookie.

## Express

[Express](https://github.com/expressjs/express) handles cookies with JSON by [prepending](https://github.com/expressjs/express/blob/master/lib/response.js#L827) a `j:` prefix to [verify](https://github.com/expressjs/cookie-parser/blob/master/index.js#L83) if it contains a JSON value later.

An example to solve this:

**Write**

```js
// Client
Cookies.set('name', 'j:' + JSON.stringify({ key: value }))

// Or in Express server to prevent prepending of j: prefix
res.cookie('name', JSON.stringify({ key: value }))
```

**Read**

```js
// Client
JSON.parse(Cookies.get('name').slice(2))

// Express already parses JSON cookies if `cookie-parser` middleware is installed.
// If you used the solution for Express above:
JSON.parse(req.cookies.name)
```

However, it's still quite a handful to do. To avoid that situation, writing a custom converter is recommended.

**Example**:

```js
var ExpressCookies = Cookies.withConverter({
  write: function (value) {
    // Prepend j: prefix if it is JSON object
    try {
      var tmp = JSON.parse(value)
      if (typeof tmp !== 'object') {
        throw new Error()
      }
      value = 'j:' + JSON.stringify(tmp)
    } catch (e) {}

    return Cookies.converter.write(value)
  },
  read: function (value) {
    value = Cookies.converter.read(value)

    // Check if the value contains j: prefix otherwise return as is
    return value.slice(0, 2) === 'j:' ? value.slice(2) : value
  }
})
```
