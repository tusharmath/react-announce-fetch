/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const _ = require('lodash')
const createStoreAsStream = require('reactive-storage').createStoreAsStream

module.exports = function (requestStream, fetcher) {
  const response = new Rx.Subject()
  const reload = new Rx.Subject()
  const state = new Rx.Subject()
  const hydrate = createStoreAsStream(0)
  requestStream
    .filter(Boolean)
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .combineLatest(hydrate.getStream(), (a, b) => ({a, b}))
    .filter(x => x.b > 0)
    .map(x => x.a)
    .combineLatest(reload.startWith(null), _.identity)
    .tap(x => state.onNext({state: 'BEGIN', meta: x}))
    .flatMap(fetcher)
    .tap(x => state.onNext({state: 'END', meta: x}))
    .subscribe(response)
  return {
    getDataStream: () => response,
    getStateStream: () => state,
    hydrate: x => hydrate.update(v => v + x),
    reload: () => reload.onNext(null)
  }
}
