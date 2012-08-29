# jquery.cookie

A simple, lightweight jQuery plugin for reading, writing and deleting cookies.

## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

    <script src="/path/to/jquery.cookie.js"></script>

## Usage

Create session cookie:

    $.cookie('the_cookie', 'the_value');

Create expiring cookie, 7 days from then:

    $.cookie('the_cookie', 'the_value', { expires: 7 });

Create expiring cookie, valid across entire site:

    $.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });

Read cookie:

    $.cookie('the_cookie'); // => "the_value"
    $.cookie('the_cookie', { raw: true }); // => "the_value" not URL decoded
    $.cookie('not_existing'); // => null

Delete cookie:

    // returns false => No cookie found
    // returns true  => A cookie was found
    $.removeCookie('the_cookie'[, options]);

*Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie, unless you're relying on the default options that is.*

## Configuration

    raw: true
    
By default the cookie value is encoded/decoded when creating/reading, using `encodeURIComponent`/`decodeURIComponent`. Turn off by setting `raw: true`. Default: `false`.
    
    json: true
    
Automatically store JSON objects passed as the cookie value. Assumes `JSON.stringify`and `JSON.parse`.

## Cookie Options

Options can be set globally by setting properties of the `$.cookie.defaults` object or individually for each call to `$.cookie()` by passing a plain object to the options argument. Per-call options override the ones set by `$.cookie.defaults`.

    expires: 365

Define lifetime of the cookie. Value can be a `Number` which will be interpreted as days from time of creation or a `Date` object. If omitted, the cookie becomes a session cookie.

    path: '/'

Define the path where the cookie is valid. *By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior).* If you want to make it available for instance across the entire domain use `path: '/'`. Default: path of page where the cookie was created.

    domain: 'example.com'

Define the domain where the cookie is valid. Default: domain of page where the cookie was created.

    secure: true

If true, the cookie transmission requires a secure protocol (https). Default: `false`.

## Development

- Source hosted at [GitHub](https://github.com/carhartl/jquery-cookie)
- Report issues, questions, feature requests on [GitHub Issues](https://github.com/carhartl/jquery-cookie/issues)

Pull requests are very welcome! Make sure your patches are well tested. Please create a topic branch for every separate change you make.

## Authors

[Klaus Hartl](https://github.com/carhartl)
