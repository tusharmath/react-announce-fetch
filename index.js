/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const _ = require('lodash')
const Rx = require('rx')
const createDataStore = require('./src/createDataStore')

const fetch = x => Rx.Observable.fromPromise(window.fetch(x))
const parseJSON = x => Rx.Observable.fromPromise(x.json())
var create = _.partial(createDataStore, fetch, parseJSON)
module.exports = {
  // TODO: Update documentation
  create,
  // Alias for legacy purposes
  createDataStore
}
