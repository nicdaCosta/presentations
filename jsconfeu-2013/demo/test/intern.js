define({

	proxyPort: 9000,
	proxyUrl: 'http://localhost:9000/',

	environments: [
		{ browserName: 'firefox' },
		{ browserName: 'chrome' }
	],

	maxConcurrency: 3,

	// Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
	// used here
	loader: { },

	// Non-functional test suite(s) to run in each browser
	suites: [ 'tests/lib/add' ],

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	functionalSuites: [],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^/
});