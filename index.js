/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const create = require('./src/main').create

exports.create = (request, fetch) => create(
  request,
  fetch || window.fetch.bind(window)
)

exports.toJSON = require('./src/toJSON')
