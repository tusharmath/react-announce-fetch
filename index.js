/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const createDataStore = require('./src/createDataStore')
const fetchStream = require('./src/fetchStream')

module.exports = {
  createDataStore: (requestStream, initialValue) => createDataStore(fetchStream, requestStream, initialValue)
}
