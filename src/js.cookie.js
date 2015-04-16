/*!
 * Javascript Cookie v2.0.0-pre
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

	function processRead (value, converter, json) {
		if (value.charAt(0) === '"') {
			// This is a quoted cookie as according to RFC2068, unescape...
			value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		value = decode(value, unallowedCharsInValue);

		if (json) {
			try {
				value = JSON.parse(value);
			} catch(e) {}
		}

		return converter ? converter(value) : value;
	}

	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var options = arguments[ i ];
			for (var key in options) {
				result[key] = options[key];
			}
		}
		return result;
	}

	var api = function (key, value, options) {
		var converter, result;
		var args = [].slice.call(arguments);

		if (typeof value === 'function') {
			converter = value;
			args.length = 1;
		}

		// Write

		if (args.length > 1) {
			options = extend(api.defaults, options);

			if (typeof options.expires === 'number') {
				var expires = new Date();
				expires.setMilliseconds(expires.getMilliseconds() + options.expires * 864e+5);
				options.expires = expires;
			}

			try {
				result = JSON.stringify(value);
				if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(result)) {
					value = result;
				}
			} catch(e) {}

			value = encode(String(value), unallowedCharsInValue);

			return (document.cookie = [
				encode(key, unallowedCharsInName), '=', value,
				options.expires && '; expires=' + options.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
				options.path    && '; path=' + options.path,
				options.domain  && '; domain=' + options.domain,
				options.secure  && '; secure'
			].join(''));
		}

		// Read

		if (!key) {
			result = {};
		}

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling "get()"
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		var i = 0;

		for (; i < cookies.length; i++) {
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
		return api.apply({
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
