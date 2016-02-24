/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const e = require('./src/main')

exports.create = request => e(e, window.fetch, request)
exports.toJSON = require('./src/toJSON')
