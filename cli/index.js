'use strict';

/*!
 * Dependencies
 */

var vorpal = require('vorpal')()
  , Promise = require('bluebird')
  , Neulion = require('neulion')
  , _ = require('underscore')
  , config = require('./config')()
  , utils = require('./utils')

/*!
 * Misc
 */

var DAY = 24 * 60 * 60 * 1000
  , DEMO = ~process.argv.indexOf('demo') ? require('./demo') : null
  , neulion = new Neulion(config)

/*!
 * Connect
 */

vorpal
  .command('connect [endpoint] [username] [password]', 'Connect to Neulion')
  .action(function(args, next) {
    var self = this
    
    utils.dotStart()

    neulion
      .connect(args.endpoint)
      .then(function() {
        return neulion.auth(args.username, args.password)
      })
      .then(function() {
        utils.dotStop()
        self.log(utils.print({
          status: 'connected'
        }))
        next()
      })
      .catch(utils.onError(next))
  })

/*!
 * Video details
 */

vorpal
  .command('details <id>', 'Lookup by `ID`')
  .alias('get')
  .alias('lookup')
  .action(function(args, next) {
    var self = this
    utils.dotStart()

    neulion
      .details(+args.id)
      .then(function(video) {
        utils.dotStop()

        // Demonstration mode, don't show real data
        if (DEMO) {
          video = DEMO.randomize(video)
        }

        self.log(utils.print(video))
        next()
      })
      .catch(utils.onError(next))
  })

/*!
 * Video search
 */

vorpal
  .command('list', 'Search videos')
  .alias('search')
  .option('--date [progDate]', 'Search date (by day)')
  .option('--name [name]', 'Video name')
  .option('--desc [description]', 'Video description')
  .option('--updated [updateTime]', 'Video last updated')
  .option('--limit [limit]', 'Lookup limit (default `10`)')
  .option('--format [format]', 'Display format', [
    'short'
  , 'full'
  ])
  .option('--preset [preset]', 'Search for recent videos', [
    'recent'
  , 'yesterday'
  , 'today'
  , 'tomorrow'
  ])
  .action(function(args, next) {
    var self = this
      , opts = args.options
      , today = Date.now()
      , format = opts.format
      , params = {}
      , limit = opts.limit || 10
      , preset = opts.preset
      , prom

    if (opts.date) params.progDate = new Date(opts.date)
    if (opts.name) params.name = opts.name
    if (opts.desc) params.description = opts.desc
    if (opts.updated) params.updateTime = opts.updated
    
    // Default params
    if (!Object.keys(params).length) {
      params.progDate = new Date()
    }

    this.log('Searching')
    utils.dotStart()

    // Search for recent videos (-1/+1 days)
    if (preset === 'recent') {
      var start = new Date(today - DAY)
        , end = new Date(today + DAY)

      this.log(utils.print({
        range: {
          start: start
        , end: end
        }
      }))
      prom = neulion.range(start, end)

    // Run preset search filters
    } else if (preset) {
      var p = {}
      if (preset === 'yesterday') p.progDate = new Date(today - DAY)
      else if (preset === 'today') p.progDate = new Date(today)
      else if (preset === 'tomorrow') p.progDate = new Date(today + DAY)

      prom = neulion.list(p)

    // Build search based on options
    } else {
      this.log(utils.print(params))

      prom = neulion.list(params)
    }

    prom
      .then(function(ids) {
        utils.dotStop()

        self.log('Found `%d`', ids.length)

        ids = ids.slice(0, limit)

        if (!format) {
          self.log(utils.print({
            ids: ids.join(', ')
          }))
          return []
        }
        self.log('Fetching details\n')

        return Promise
          .mapSeries(ids, function(id) {
            process.stdout.write('.')
            return neulion.details(id)
          })
      })
      .then(function(videos) {
        videos = videos.map(function(x) {
          if (format === 'short') {
            return _.pick(x, [
              'programId'
            , 'name'
            , 'desc'
            , 'gameId'
            , 'eventId'
            ])
          }
          return x
        })

        // Demonstration mode, don't show real data
        if (DEMO) {
          videos = videos.map(DEMO.randomize)
        }

        if (videos.length) {
          self.log(utils.print(videos))
        }
        next()
      })
      .catch(utils.onError(next))
  })

/*!
 * Exports
 */

exports.vorpal = vorpal
