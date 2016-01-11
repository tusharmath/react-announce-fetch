/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const _ = require('lodash')
const createDataStore = require('./src/createDataStore')

var create = _.partial(createDataStore, window.fetch)
module.exports = {
  // TODO: Update documentation
  create,
  // Alias for legacy purposes
  createDataStore
}
