/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const create = require('./src/main').create

exports.create = (request, fetch) => create(
  fetch || window.fetch.bind(window),
  request
)

exports.toJSON = require('./src/toJSON')
