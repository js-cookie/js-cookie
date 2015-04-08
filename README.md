# Javascript Cookie [![Build Status](https://travis-ci.org/js-cookie/js-cookie.png?branch=master)](https://travis-ci.org/js-cookie/js-cookie) [![Code Climate](https://codeclimate.com/github/js-cookie/js-cookie.png)](https://codeclimate.com/github/js-cookie/js-cookie)

--

A simple, lightweight javascript API for handling cookies

**If you're viewing this at https://github.com/js-cookie/js-cookie, you're reading the documentation for the master branch.
[View documentation for the latest release (1.4.1).](https://github.com/carhartl/jquery-cookie/tree/v1.4.1)**

## Build Status Matrix

[![Selenium Test Status](https://saucelabs.com/browser-matrix/js-cookie.svg)](https://saucelabs.com/u/js-cookie)

## Installation

Include the script (unless you are packaging scripts somehow else):

```html
<script src="/path/to/js.cookie.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

The plugin can also be loaded as AMD or CommonJS module.

## Usage

Create session cookie:

```javascript
Cookies.set('name', 'value');
```

Create expiring cookie, 7 days from then:

```javascript
Cookies.set('name', 'value', { expires: 7 });
```

Create expiring cookie, valid across entire site:

```javascript
Cookies.set('name', 'value', { expires: 7, path: '/' });
```

Read cookie:

```javascript
Cookies.get('name'); // => "value"
Cookies.get('nothing'); // => undefined
```

Read all available cookies:

```javascript
Cookies.get(); // => { "name": "value" }
```

Delete cookie:

```javascript
// Returns true when cookie was successfully deleted, otherwise false
Cookies.remove('name'); // => true
Cookies.remove('nothing'); // => false

// Need to use the same attributes (path, domain) as what the cookie was written with
Cookies.set('name', 'value', { path: '/' });
// This won't work!
Cookies.remove('name'); // => false
// This will work!
Cookies.remove('name', { path: '/' }); // => true
```

*Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie, unless you're relying on the default options that is.*

## Configuration

### raw

By default the cookie value is encoded/decoded when writing/reading, using `encodeURIComponent`/`decodeURIComponent`. Bypass this by setting raw to true:

```javascript
Cookies.raw = true;
```

### json

Turn on automatic storage of JSON objects passed as the cookie value. Assumes `JSON.stringify` and `JSON.parse`:

```javascript
Cookies.json = true;
```

## Cookie Options

Cookie attributes can be set globally by setting properties of the `Cookies.defaults` object or individually for each call to `Cookies.set()` by passing a plain object to the options argument. Per-call options override the default options.

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
Cookies.set('foo', '42');
Cookies.get('foo', Number); // => 42
```

Dealing with cookies that have been encoded using `escape` (3rd party cookies):

```javascript
Cookies.raw = true;
Cookies.get('foo', unescape);
```

You can pass an arbitrary conversion function.

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Authors

[Klaus Hartl](https://github.com/carhartl)
