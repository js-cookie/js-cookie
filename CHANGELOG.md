HEAD
-----

1.4.0
-----
- Support for AMD.

- Removed deprecated method `$.cookie('name', null)` for deleting a cookie,
  use `$.removeCookie('name')`.

- `$.cookie('name')` now returns `undefined` in case such cookie does not exist
  (was `null`). Because the return value is still falsy, testing for existence
  of a cookie like `if ( $.cookie('foo') )` keeps working without change.

- Renamed bower package definition (component.json -> bower.json) for usage
  with up-to-date bower.

- Badly encoded cookies no longer throw exception upon reading but do return
  undefined (similar to how we handle JSON parse errors with json = true).

- Added conversion function as optional last argument for reading,
  so that values can be changed to a different representation easily on the fly.
  Useful for parsing numbers for instance:

  ```javascript
  $.cookie('foo', '42');
  $.cookie('foo', Number); // => 42
  ```

1.3.1
-----
- Fixed issue where it was no longer possible to check for an arbitrary cookie,
  while json is set to true, there was a SyntaxError thrown from JSON.parse.

- Fixed issue where RFC 2068 decoded cookies were not properly read.

1.3.0
-----
- Configuration options: `raw`, `json`. Replaces raw option, becomes config:

  ```javascript
  $.cookie.raw = true; // bypass encoding/decoding the cookie value
  $.cookie.json = true; // automatically JSON stringify/parse value
  ```

  Thus the default options now cleanly contain cookie attributes only.

- Removing licensing under GPL Version 2, the plugin is now released under MIT License only
(keeping it simple and following the jQuery library itself here).

- Bugfix: Properly handle RFC 2068 quoted cookie values.

- Added component.json for bower.

- Added jQuery plugin package manifest.

- `$.cookie()` returns all available cookies.

1.2.0
-----
- Adding `$.removeCookie('foo')` for deleting a cookie, using `$.cookie('foo', null)` is now deprecated.

1.1
---
- Adding default options.
