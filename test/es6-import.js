import jsdomify from 'jsdomify';
import {assert} from 'chai';
import Cookies from '../src/js.cookie';

it('should function properly when jsdom is used', () => {
	const key = 'test-key';
	const val = 'test-val';
	jsdomify.create();
	Cookies.set(key, val);
	const result = Cookies.get(key);
	assert.equal(val, result);
});
