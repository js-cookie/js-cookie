# JavaScript Cookie [![Build Status](https://travis-ci.org/js-cookie/js-cookie.svg?branch=master)](https://travis-ci.org/js-cookie/js-cookie) [![Code Climate](https://codeclimate.com/github/js-cookie/js-cookie.svg)](https://codeclimate.com/github/js-cookie/js-cookie)

A simple, lightweight JavaScript API for handling cookies

* Works in [all](https://saucelabs.com/u/js-cookie) browsers
* Accepts any character
* [Heavily](test) tested
* No dependency
* [Unobtrusive](#json) JSON support
* Supports AMD/CommonJS
* [RFC 6265](https://tools.ietf.org/html/rfc6265) compliant
* Enable [custom decoding](#converter)
* **~800 bytes** gzipped!

**If you're viewing this at https://github.com/js-cookie/js-cookie, you're reading the documentation for the master branch.
[View documentation for the latest release (2.0.3).](https://github.com/js-cookie/js-cookie/tree/v2.0.3#readme)**

## Build Status Matrix

[![Selenium Test Status](https://saucelabs.com/browser-matrix/js-cookie.svg)](https://saucelabs.com/u/js-cookie)

## Installation

Include the script (unless you are packaging scripts somehow else):

```html
<script src="/path/to/js.cookie.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

js-cookie supports [npm](https://www.npmjs.com/package/js-cookie) and [Bower](http://bower.io/search/?q=js-cookie) under the name `js-cookie`

It can also be loaded as an AMD or CommonJS module.

## Basic Usage

Create a cookie, valid across the entire site:

```javascript
Cookies.set('name', 'value');
```

Create a cookie that expires 7 days from now, valid across the entire site:

```javascript
Cookies.set('name', 'value', { expires: 7 });
```

Create an expiring cookie, valid to the path of the current page:

```javascript
Cookies.set('name', 'value', { expires: 7, path: '' });
```

Read cookie:

```javascript
Cookies.get('name'); // => 'value'
Cookies.get('nothing'); // => undefined
```

Read all visible cookies:

```javascript
Cookies.get(); // => { name: 'value' }
```

Delete cookie:

```javascript
Cookies.remove('name');
```

Delete a cookie valid to the path of the current page:

```javascript
Cookies.set('name', 'value', { path: '' });
Cookies.remove('name'); // fail!
Cookies.remove('name', { path: '' }); // removed!
```

*IMPORTANT! when deleting a cookie, you must pass the exact same path, domain and secure attributes that were used to set the cookie, unless you're relying on the [default attributes](#cookie-attributes).*

## Namespace conflicts

If there is any danger of a conflict with the namespace `Cookies`, the `noConflict` method will allow you to define a new namespace and preserve the original one. This is especially useful when running the script on third party sites e.g. as part of a widget or SDK.

```javascript
// Assign the js-cookie api to a different variable and restore the original "window.Cookies"
var Cookies2 = Cookies.noConflict();
Cookies2.set('name', 'value');
```

*Note: The `.noConflict` method is not necessary when using AMD or CommonJS, thus it is not exposed in those environments.*

## JSON

js-cookie provides unobstrusive JSON storage for cookies.

When creating a cookie you can pass an Array or Object Literal instead of a string in the value. If you do so, js-cookie will store the string representation of the object according to `JSON.stringify`:

```javascript
Cookies.set('name', { foo: 'bar' });
```

When reading a cookie with the default `Cookies.get` api, you receive the string representation stored in the cookie:

```javascript
Cookies.get('name'); // => '{"foo":"bar"}'
```

```javascript
Cookies.get(); // => { name: '{"foo":"bar"}' }
```

When reading a cookie with the `Cookies.getJSON` api, you receive the parsed representation of the string stored in the cookie according to `JSON.parse`:

```javascript
Cookies.getJSON('name'); // => { foo: 'bar' }
```

```javascript
Cookies.getJSON(); // => { name: { foo: 'bar' } }
```

*Note: To support IE6-7 ([and IE 8 compatibility mode](http://stackoverflow.com/questions/4715373/json-object-undefined-in-internet-explorer-8)) you need to include the JSON-js polyfill: https://github.com/douglascrockford/JSON-js*

## Encoding

This project is [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.1) compliant. All special characters that are not allowed in the cookie-name or cookie-value are encoded with each one's UTF-8 Hex equivalent using [percent-encoding](http://en.wikipedia.org/wiki/Percent-encoding).  
The only character in cookie-name or cookie-value that is allowed and still encoded is the percent `%` character, it is escaped in order to interpret percent input as literal.  
To override the default cookie decoding you need to use a [converter](#converter).

## Cookie Attributes

Cookie attributes defaults can be set globally by setting properties of the `Cookies.defaults` object or individually for each call to `Cookies.set(...)` by passing a plain object in the last argument. Per-call attributes override the default attributes.

### expires

Define when the cookie will be removed. Value can be a [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) which will be interpreted as days from time of creation or a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance. If omitted, the cookie becomes a session cookie.

**Default:** Cookie is removed when the user closes the browser.

**Examples:**

```javascript
Cookies.set('name', 'value', { expires: 365 });
Cookies.get('name'); // => 'value'
Cookies.remove('name');
```

### path

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) indicating the path where the cookie is visible.

**Default:** `/`

**Examples:**

```javascript
Cookies.set('name', 'value', { path: '' });
Cookies.get('name'); // => 'value'
Cookies.remove('name', { path: '' });
```

**Note regarding Internet Explorer:**

> Due to an obscure bug in the underlying WinINET InternetGetCookie implementation, IE’s document.cookie will not return a cookie if it was set with a path attribute containing a filename.

(From [Internet Explorer Cookie Internals (FAQ)](http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx))

This means one cannot set a path using `path: window.location.pathname` in case such pathname contains a filename like so: `/check.html` (or at least, such cookie cannot be read correctly).

### domain

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) indicating a valid domain where the cookie should be visible. The cookie will also be visible to all subdomains.

**Default:** Cookie is visible only to the domain or subdomain of the page where the cookie was created, except for Internet Explorer (see below).

**Examples:**

Assuming a cookie that is being created on `site.com`:

```javascript
Cookies.set('name', 'value', { domain: 'subdomain.site.com' });
Cookies.get('name'); // => undefined (need to read at 'subdomain.site.com')
```

**Note regarding Internet Explorer default behavior:**

> Q3: If I don’t specify a DOMAIN attribute (for) a cookie, IE sends it to all nested subdomains anyway?  
> A: Yes, a cookie set on example.com will be sent to sub2.sub1.example.com.  
> Internet Explorer differs from other browsers in this regard.

(From [Internet Explorer Cookie Internals (FAQ)](http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx))

This means that if you omit the `domain` attribute, it will be visible for a subdomain in IE.

### secure

Either `true` or `false`, indicating if the cookie transmission requires a secure protocol (https).

**Default:** No secure protocol requirement.

**Examples:**

```javascript
Cookies.set('name', 'value', { secure: true });
Cookies.get('name'); // => 'value'
Cookies.remove('name', { secure: true });
```

## Converter

Create a new instance of the api that overrides the default decoding implementation.  
All get methods that rely in a proper decoding to work, such as `Cookies.get()` and `Cookies.get('name')`, will run the converter first for each cookie.  
The returning String will be used as the cookie value.

Example from reading one of the cookies that can only be decoded using the `escape` function:

```javascript
document.cookie = 'escaped=%u5317';
document.cookie = 'default=%E5%8C%97';
var cookies = Cookies.withConverter(function (value, name) {
    if ( name === 'escaped' ) {
        return unescape(value);
    }
});
cookies.get('escaped'); // 北
cookies.get('default'); // 北
cookies.get(); // { escaped: '北', default: '北' }
```

Example for parsing the value from a cookie generated with PHP's `setcookie()` method:

```javascript
// 'cookie+with+space' => 'cookie with space'
Cookies.withConverter(function (value) {
    return value.replace(/\+/g, ' ');
}).get('foo');
```

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Manual release steps

* Increment the "version" attribute of `package.json`
* Increment the version number in the `src/js.cookie.js` file
* Commit with the message "Release version x.x.x"
* Create version tag in git
* Create a github release and upload the minified file
* Link the documentation of the latest release tag in the `README.md`
* Commit with the message "Prepare for the next development iteration"
* Release on npm

## Authors

* [Klaus Hartl](https://github.com/carhartl)
* [Fagner Brack](https://github.com/FagnerMartinsBrack)
* And awesome [contributors](https://github.com/js-cookie/js-cookie/graphs/contributors)
