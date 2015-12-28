const _ = require('lodash')
const Rx = require('rx')

module.exports = params => Rx.Observable.fromPromise(fetch(params.url, _.omit(params, 'url')))
