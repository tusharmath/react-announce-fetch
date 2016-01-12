/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const _ = require('lodash')
const Rx = require('rx')
const createDataStore = require('./src/createDataStore')

var create = _.partial(createDataStore, x => Rx.Observable.fromPromise(fetch(x)))
module.exports = {
  // TODO: Update documentation
  create,
  // Alias for legacy purposes
  createDataStore
}
