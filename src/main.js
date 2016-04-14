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

// TODO: Move out of this module
e.replayLatestAsyncMap = (source, asyncMapper) => {
  var refCount = 0
  const replaySource = source.replay(null, 1)
  const responses = replaySource
    .flatMap(asyncMapper)
    .replay(null, 1)
  replaySource.connect()
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
}

e.create = _.partial((toObservable, request, fetch) => {
  const fetchO = toObservable(fetch)
  return e.replayLatestAsyncMap(request, x => fetchO.apply(null, x))
}, e.toObservable)
