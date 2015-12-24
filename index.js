/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const _ = require('lodash')
const createDataStore = require('./src/createDataStore')
const fetchStream = require('./src/fetchStream')
const hydrate = require('./src/hydrate')

module.exports = {
  createDataStore: _.partialRight(createDataStore, fetchStream),
  hydrate
}
