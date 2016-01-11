/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const _ = require('lodash')
const createStoreStream = require('reactive-storage').createStoreStream

// TODO: Remove initial value. Startwith is a good alternative to use
module.exports = function (fetcher, requestStream, initialValue) {
  const lifeCycleObserver = new Rx.Subject()
  const response = new Rx.BehaviorSubject(initialValue)
  const reload = new Rx.Subject()
  const state = new Rx.Subject()
  const hydrate = createStoreStream(0)
  Rx.Observable.merge(
    lifeCycleObserver.filter(x => x.event === 'WILL_MOUNT').map(1),
    lifeCycleObserver.filter(x => x.event === 'WILL_UNMOUNT').map(-1)
  ).subscribe(x => hydrate.set(store => store + x))

  requestStream
    .filter(Boolean)
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .combineLatest(hydrate.getStream(), (a, b) => ({a, b}))
    .filter(x => x.b)
    .map(x => x.a)
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .combineLatest(reload.startWith(null), _.identity)
    .tap(x => state.onNext({state: 'BEGIN', meta: x}))
    .flatMap(fetcher)
    .tap(x => state.onNext({state: 'END', meta: x}))
    .subscribe(response)
  return {
    // TODO: expose getJSONStream
    // TODO: Add dispose functionality
    getDataStream: () => response,
    getStateStream: () => state,
    hydrate: x => hydrate.set(v => v + _.isFinite(x) ? x : 1),
    reload: () => reload.onNext(null),
    sync: () => lifeCycleObserver
  }
}
