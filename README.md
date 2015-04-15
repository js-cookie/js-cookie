# JavaScript Cookie [![Build Status](https://travis-ci.org/js-cookie/js-cookie.svg?branch=master)](https://travis-ci.org/js-cookie/js-cookie) [![Code Climate](https://codeclimate.com/github/js-cookie/js-cookie.svg)](https://codeclimate.com/github/js-cookie/js-cookie)

A simple, lightweight JavaScript API for handling cookies

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
Cookies.get('name'); // => 'value'
Cookies.get('nothing'); // => undefined
```

Read all available cookies:

```javascript
Cookies.get(); // => { name: 'value' }
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

## JSON

js-cookie provides automatic JSON storage for cookies.

When creating a cookie you can pass an Array or Object Literal instead of a string in the value. If you do so, js-cookie store the string representation of the object according to the `JSON.stringify` api (if available):

```javascript
Cookies.set('name', { foo: 'bar' });
```

When reading a cookie with the default `Cookies.get()` api, you receive the stringified representation stored in the cookie:

```javascript
Cookies.get('name'); // => '{"foo":"bar"}'
```

When reading a cookie with the `Cookies.getJSON()` api, you receive the parsed representation of the string stored in the cookie according to the `JSON.stringify` api (if available):

```javascript
Cookies.getJSON('name'); // => { foo: 'bar' }
```

## RFC 6265

This project assumes [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.1) as a reference for everything. That said, some custom rules are applied in order to provide robustness and cross-browser compatibility.

### Encoding
All special characters that are not allowed in the cookie-value or cookie-name in at least one supported browser are encoded/decoded with each UTF-8 Hex equivalent. Special characters that consistently work among all supported browsers are not encoded/decoded this way.

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

Example for parsing the value from a cookie generated with PHP's `setcookie()` method:

```javascript
// 'cookie+with+space' => 'cookie with space'
Cookies.get('foo', function (value) {
    return value.replace(/\+/g, ' ');
});
```

Dealing with cookies that have been encoded using `escape` (3rd party cookies):

```javascript
Cookies.get('foo', unescape);
```

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Manual release steps

* Remove the "-pre" suffix of the "version" attribute of `bower.json`, `package.json` and `component.json`
* Remove the "-pre" suffix of the version number in the `CHANGELOG.md` and `src/js.cookie.js` files
* Commit with the message "Release version x.x.x"
* Create version tag in git
* Create a github release and upload the minified file
* Release on npm
* Increment and add the "-pre" suffix to the "version" attribute of `bower.json`, `package.json` and `component.json`
* Increment and add the "-pre" suffix to the version number in the `CHANGELOG.md` and `src/js.cookie.js` files
* Commit with the message "Prepare for the next development iteration"

## Authors

[Klaus Hartl](https://github.com/carhartl)
