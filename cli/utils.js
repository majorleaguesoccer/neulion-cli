'use strict';

/*!
 * Dependencies
 */

var prettyjson = require('prettyjson')
  , chalk = require('chalk')
  , stdout = process.stdout


/**
 * Pretty print helper
 */

var printOptions = {
  numberColor: 'green'
, keysColor: 'gray'
, dashColor: 'gray'
, stringColor: 'white'
}
exports.print = function(obj) {
  // Function call modifies `printOptions` by reference...
  return prettyjson.render(obj, printOptions) + '\n'
}

/**
 * Common error handler
 *
 */

exports.onError = function(callback) {
  return function(err) {
    exports.dotStop()
    console.log(chalk.red(err))
    exports.print(err)
    // vorpal.log(chalk.red(err))
    callback()
  }
}


/*!
 * UI Helpers
 */

var _waiting

/**
 * Write `.` to stdout to show progression
 */

exports.dotStart = function() {
  clearInterval(_waiting)
  _waiting = setInterval(function() {
    stdout.write('.')
  }, 400)
}

/**
 * Stop writing
 */

exports.dotStop = function() {
  clearInterval(_waiting)
  stdout.write('\n')
}