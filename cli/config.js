'use strict';

/*!
 * Dependencies
 */

var fs = require('fs')
  , path = require('path')
  , chalk = require('chalk')
  , home = process.env.HOME || process.env.USERPROFILE

/** 
 * Check for and load config file
 *
 * @param {String} filepath
 * @return {Object|Null} config if found
 */

function getConfig(fpath) {
  var obj = null

  if (fs.existsSync(fpath)) {
    var str = fs.readFileSync(fpath, 'utf8')

    try {
      obj = JSON.parse(str)
      console.log(chalk.gray.bold('Config found at: ') + chalk.green(fpath) + '\n')
    } catch(e) {
      console.error('Invalid JSON: fpath=`%s`', fpath)
    }
  }
  return obj
}

/**
 * Find and load config
 */

module.exports = function() {
  return (
    // Local config (dev mode)
    getConfig(path.join(__dirname, '/../config.json'))

    // Home directory (npm installed)
    || getConfig(path.join(home, '/.neulionrc'))
    || {}
  )
}