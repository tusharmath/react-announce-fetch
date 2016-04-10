/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const _ = require('funjector')
const e = exports
const slice = (x, i) => Array.prototype.slice.call(x, i)

e.toObservable = fetch => function () {
  const args = slice(arguments)
  return Rx.Observable.fromPromise(fetch.apply(null, args))
}

e.create = _.partial((toObservable, fetch, request) => {
  const fetchO = toObservable(fetch)
  const out = request
    .flatMap(x => fetchO.apply(null, x))
    .replay(1)
  out.connect()
  return out
}, e.toObservable)
