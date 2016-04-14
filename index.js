/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const create = require('./src/main').create

exports.create = (request, fetch) => create(fetch || window.fetch, request)
exports.toJSON = require('./src/toJSON')
exports.reload = require('./src/reload')
exports.isLoading = require('./src/isLoading')
