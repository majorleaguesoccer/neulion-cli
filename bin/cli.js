#!/usr/bin/env node
'use strict';

/*!
 * Dependencies
 */

var chalk = require('chalk')

/*!
 * Header
 * 
 * Generator: http://patorjk.com/software/taag
 * Font: Stampate
 */

console.log(chalk.gray.bold(`
            .                        
,-. ,-. . . |  . ,-. ,-.   ,-. ,-. . 
| | |-' | | |  | | | | |   ,-| | | | 
' ' \`-' \`-' \`' ' \`-' ' '   \`-^ |-' ' 
                               |
`))

/*!
 * Start em up
 */

var cli = require('../cli')
  , vorpal = cli.vorpal

vorpal
  .delimiter(`${chalk.magenta(`${chalk.white.bold(`neulion`)} >`)}`)
  .show()