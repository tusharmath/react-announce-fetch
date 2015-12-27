/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const _ = require('lodash')
const createStoreAsStream = require('reactive-storage').createStoreAsStream

// TODO: Remove initial value. Startwith is a good alternative to use
module.exports = function (requestStream, initialValue, fetcher) {
  const response = new Rx.BehaviorSubject(initialValue)
  const reload = new Rx.Subject()
  const state = new Rx.Subject()
  const hydrate = createStoreAsStream(0)
  requestStream
    .filter(Boolean)
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .combineLatest(hydrate.getStream().map(x => x > 0).distinctUntilChanged(), (a, b) => ({a, b}))
    .filter(x => x.b)
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
