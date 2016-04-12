/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const ReactiveStore = require('reactive-storage')
const Rx = require('rx')
const _ = require('funjector')
const targ = require('argtoob')
const e = exports
const slice = (x, i) => Array.prototype.slice.call(x, i)

e.toObservable = fetch => function () {
  const args = slice(arguments)
  return Rx.Observable.fromPromise(fetch.apply(null, args))
}

e.create = _.partial((toObservable, request, fetch) => {
  const fetchO = toObservable(fetch)
  const refCount = ReactiveStore.create(0)
  const responses = request
    .map(x => x.slice(0))
    .combineLatest(refCount.stream, targ('request', 'refCount'))
    .filter(x => x.refCount > 0)
    .pluck('request')
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .flatMap(x => fetchO.apply(null, x))
    .publish()
  responses.connect()
  const replay = responses.replay(0, 1)
  replay.connect()
  return Rx.Observable.create(observer => {
    refCount.set(x => x + 1)
    replay.subscribe(observer)
    return () => refCount.set(x => x - 1)
  })
}, e.toObservable)
