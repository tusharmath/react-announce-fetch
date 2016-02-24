/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const e = require('./src/index')

exports.create = request => e(e, window.fetch, request)
