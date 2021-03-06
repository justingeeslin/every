// Karma configuration
// Generated on Tue Feb 02 2016 00:54:15 GMT-0600 (CST)
var istanbul = require('browserify-istanbul');
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],


    // list of files / patterns to load in the browser
    files: [
      'https://code.jquery.com/jquery-3.1.1.min.js',
      'index.js',
  		'tests/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'index.js': ['browserify'],
    },

    browserify: {
        debug: true,
        transform: [
          istanbul({})
        ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'dots',
      'coverage'
    ],

    coverageReporter: {
      reporters: [
        { type : 'lcov', dir : 'coverage/' },
        { type : 'lcovonly', subdir : '.', file: 'lcov.info' }
      ]
    },


    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    browserConsoleLogOptions: {level: "error", format: "%b %T: %m", terminal: false},

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
		],

    customLaunchers: {
  		Chrome_travis_ci: {
  				base: 'Chrome',
  				flags: ['--no-sandbox ']
  		}
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })

	if(process.env.TRAVIS){
		config.browsers = ['Chrome_travis_ci'];
	}
}
