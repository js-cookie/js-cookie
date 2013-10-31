# jquery.cookie [![Build Status](https://travis-ci.org/carhartl/jquery-cookie.png?branch=master)](https://travis-ci.org/carhartl/jquery-cookie) [![Code Climate](https://codeclimate.com/github/carhartl/jquery-cookie.png)](https://codeclimate.com/github/carhartl/jquery-cookie)

A simple, lightweight jQuery plugin for reading, writing and deleting cookies.

## Build Status Matrix

[![Selenium Test Status](https://saucelabs.com/browser-matrix/jquery-cookie.svg)](https://saucelabs.com/u/jquery-cookie)

## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/jquery.cookie.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

The plugin can also be loaded as AMD module.

## Usage

Create session cookie:

```javascript
$.cookie('the_cookie', 'the_value');
```

Create expiring cookie, 7 days from then:

```javascript
$.cookie('the_cookie', 'the_value', { expires: 7 });
```

Create expiring cookie, valid across entire site:

```javascript
$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
```

Read cookie:

```javascript
$.cookie('the_cookie'); // => "the_value"
$.cookie('not_existing'); // => undefined
```

Read all available cookies:

```javascript
$.cookie(); // => { "the_cookie": "the_value", "...remaining": "cookies" }
```

Delete cookie:

```javascript
// Returns true when cookie was found, false when no cookie was found...
$.removeCookie('the_cookie');

// Same path as when the cookie was written...
$.removeCookie('the_cookie', { path: '/' });
```

*Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie, unless you're relying on the default options that is.*

## Configuration

### raw

By default the cookie value is encoded/decoded when writing/reading, using `encodeURIComponent`/`decodeURIComponent`. Bypass this by setting raw to true:

```javascript
$.cookie.raw = true;
```

### json

Turn on automatic storage of JSON objects passed as the cookie value. Assumes `JSON.stringify` and `JSON.parse`:

```javascript
$.cookie.json = true;
```

## Cookie Options

Cookie attributes can be set globally by setting properties of the `$.cookie.defaults` object or individually for each call to `$.cookie()` by passing a plain object to the options argument. Per-call options override the default options.

### expires

    expires: 365

Define lifetime of the cookie. Value can be a `Number` which will be interpreted as days from time of creation or a `Date` object. If omitted, the cookie becomes a session cookie.

### path

    path: '/'

Define the path where the cookie is valid. *By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior).* If you want to make it available for instance across the entire domain use `path: '/'`. Default: path of page where the cookie was created.

**Note regarding Internet Explorer:**

> Due to an obscure bug in the underlying WinINET InternetGetCookie implementation, IE’s document.cookie will not return a cookie if it was set with a path attribute containing a filename.

(From [Internet Explorer Cookie Internals (FAQ)](http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx))

This means one cannot set a path using `path: window.location.pathname` in case such pathname contains a filename like so: `/check.html` (or at least, such cookie cannot be read correctly).

### domain

    domain: 'example.com'

Define the domain where the cookie is valid. Default: domain of page where the cookie was created.

### secure

    secure: true

If true, the cookie transmission requires a secure protocol (https). Default: `false`.

## Converters

Provide a conversion function as optional last argument for reading, in order to change the cookie's value
to a different representation on the fly.

Example for parsing a value into a number:

```javascript
$.cookie('foo', '42');
$.cookie('foo', Number); // => 42
```

Dealing with cookies that have been encoded using `escape` (3rd party cookies):

```javascript
$.cookie.raw = true;
$.cookie('foo', unescape);
```

You can pass an arbitrary conversion function.

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Authors

[Klaus Hartl](https://github.com/carhartl)
