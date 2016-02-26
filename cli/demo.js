'use strict';

/*!
 * Dependencies
 */

var faker = require('faker')
  , varType = require('var-type')

/**
 * Randomize a given object with fake data. Primary purpose is to be able to 
 * show the CLI without exposing sensitive data.
 *
 * @param {Object} sensitive object
 * @return {Object} randomized object
 */

exports.randomize = function(obj) {
  var resp = {}

  Object.keys(obj).forEach(function(prop) {
    var val = obj[prop]
      , type = varType(val)
      , fake = val

    if (type === 'Number') {
      fake = faker.random.number()
    } else if (type === 'Array') {
      // fake = val
    } else if (type === 'String') {

      if (val.indexOf('http://') === 0) {
        fake = faker.internet.url()
      } else {
        fake = faker.lorem.sentence()
      }
    }
    resp[prop] = fake
  })
  return resp
}