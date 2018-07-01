import pkg from './package.json';

const banner = `/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */`;

export default {
	output: [
		{
			file: 'lib/js.cookie.umd.js',
			format: 'umd',
			name: 'Cookies',
			noConflict: true,
			banner
		},
		{
			file: pkg.main,
			format: 'cjs',
			banner
		},
		{
			file: 'lib/js.cookie.esm.js',
			format: 'esm',
			banner
		}
	],
	input: 'src/js.cookie.js'
};
