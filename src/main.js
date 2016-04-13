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

e.create = _.partial((toObservable, request, fetch) => {
  var refCount = 0
  const fetchO = toObservable(fetch)
  const _request = request.replay(null, 1)
  const responses = _request
    .flatMap(x => fetchO.apply(null, x))
    .replay(null, 1)
  _request.connect()
  return Rx.Observable.create(observer => {
    if (++refCount > 0) {
      var conn = responses.connect()
      responses.subscribe(observer)
    }
    return () => {
      if (--refCount === 0) {
        conn.dispose()
      }
    }
  })
}, e.toObservable)
