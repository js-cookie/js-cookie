HEAD
----
- Configuration options: `raw`, `json`. Replaces raw option, becomes config:

  ```javascript
  $.cookie.raw = true; // bypass encoding/decoding the cookie value
  $.cookie.json = true; // automatically JSON stringify/parse value
  ```
  
  Thus the default options now cleanly contain cookie attributes only.

- Removing licensing under GPL Version 2, the plugin is now released under MIT License only
(following the jQuery library itself here).

- Properly handle RFC 2068 quoted cookie values.

1.2.0
-----
- Adding `$.removeCookie('foo')` for deleting a cookie, using `$.cookie('foo', null)` is now deprecated.

1.1
---
- Adding default options.
