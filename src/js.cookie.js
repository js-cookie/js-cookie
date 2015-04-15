/*!
 * Javascript Cookie v1.5.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory();
	} else {
		// Browser globals
		window.Cookies = factory();
	}
}(function () {
	var unallowedChars = {
		';': '%3B',
		',': '%2C',
		'"': '%22'
	};
	var unallowedCharsInName = extend(unallowedChars, {
		'=': '%3D',
		'\t': '%09'
	});
	var unallowedCharsInValue = extend(unallowedChars, {
		' ': '%20'
	});

	function encode (value, charmap) {
		for (var character in charmap) {
			value = value
				.replace(new RegExp(character, 'g'), charmap[character]);
		}
		return value;
	}

	function decode (value, charmap) {
		for (var character in charmap) {
			value = value
				.replace(new RegExp(charmap[character], 'g'), character);
		}
		return value;
	}

	function processWrite (value) {
		var stringified;
		try {
			stringified = JSON.stringify(value);
			if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(stringified)) {
				value = stringified;
			}
		} catch(e) {}
		return encode(String(value), unallowedCharsInValue);
	}

	function processRead (value, converter, json) {
		if (value.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		value = decode(value, unallowedCharsInValue);

		if (json) {
			try {
				value = JSON.parse(value);
			} catch(e) {}
		}

		return isFunction(converter) ? converter(value) : value;
	}

	function extend () {
		var key, options;
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			options = arguments[ i ];
			for (key in options) {
				result[key] = options[key];
			}
		}
		return result;
	}

	function isFunction (obj) {
		return Object.prototype.toString.call(obj) === '[object Function]';
	}

	var api = function (key, value, options) {
		var converter;

		if (isFunction(value)) {
			converter = value;
			value = undefined;
		}

		// Write

		if (arguments.length > 1 && !converter) {
			options = extend(api.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key, unallowedCharsInName), '=', processWrite(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()".
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift(), unallowedCharsInName),
				cookie = parts.join('=');

			if (key === name) {
				result = processRead(cookie, converter, this.json);
				break;
			}

			if (!key) {
				result[name] = processRead(cookie, converter, this.json);
			}
		}

		return result;
	};

	api.get = api.set = api;
	api.getJSON = function() {
		return api.get.apply({
			json: true
		}, [].slice.call(arguments));
	};
	api.defaults = {};

	api.remove = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		api(key, '', extend(options, { expires: -1 }));
		return !api(key);
	};

	return api;
}));
