1.3 (wip)
---
- Configuration options: `raw`, `json`. Replaces raw option, becomes config:

```javascript
$.cookie.raw = true; // bypass encoding/decoding the cookie value
$.cookie.json = true; // automatically JSON stringify/parse value
```
Thus the default options now cleanly contain cookie attributes only.

1.2
---
- Adding `$.removeCookie('foo')` for deleting a cookie, using `$.cookie('foo', null)` is now deprecated.

1.1
---
- Default options.
