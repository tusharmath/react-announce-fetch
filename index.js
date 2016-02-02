/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const createDataStore = require('./src/createDataStore')

const fetch = (url, options) => Rx.Observable.fromPromise(window.fetch(url, options))
const parseJSON = x => Rx.Observable.fromPromise(x.json())
const create = (requestStream, _options) => createDataStore(
  fetch, parseJSON, requestStream, _options
)
module.exports = {
  create,
  // Alias for legacy purposes
  createDataStore: create,
  createFetchStore: create
}
