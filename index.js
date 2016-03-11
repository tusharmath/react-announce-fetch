/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const e = require('./src/main')

exports.create = (request, fetch) => e(e, fetch || window.fetch, request)
exports.toJSON = require('./src/toJSON')
exports.reload = require('./src/reload')
