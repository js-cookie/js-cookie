// https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
(function () {
	"use strict";

	var log = [];

	QUnit.done(function (test_results) {
		var tests = [];
		for (var i = 0, len = log.length; i < len; i++) {
			var details = log[i];
			tests.push({
				name: details.name,
				result: details.result,
				expected: details.expected,
				actual: details.actual,
				source: details.source
			});
		}
		test_results.tests = tests;
		// Required for exposing test results to the Sauce Labs API.
		// Can be removed when the following issue is fixed:
		// https://github.com/axemclion/grunt-saucelabs/issues/84
		window.global_test_results = test_results;
	});

	QUnit.testStart(function (testDetails) {
		QUnit.log(function (details) {
			if (!details.result) {
				details.name = testDetails.name;
				log.push(details);
			}
		});
	});

	window.lifecycle = {
		teardown: function () {
			// Remove the cookies created using js-cookie default attributes
			Object.keys(Cookies.get()).forEach(Cookies.remove);
			// Remove the cookies created using browser default attributes
			Object.keys(Cookies.get()).forEach(function (cookie) {
				Cookies.remove(cookie, {
					path: ''
				});
			});
		}
	};
}());
