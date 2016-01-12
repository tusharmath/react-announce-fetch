/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const _ = require('lodash')
const createStoreStream = require('reactive-storage').createStoreStream

module.exports = function (fetch, parseJSON, requestStream) {
  const lifeCycleObserver = new Rx.Subject()
  const response = new Rx.Subject()
  const reload = new Rx.Subject()
  const state = new Rx.Subject()
  const hydrate = createStoreStream(0)
  Rx.Observable.merge(
    lifeCycleObserver.filter(x => x.event === 'WILL_MOUNT').map(1),
    lifeCycleObserver.filter(x => x.event === 'WILL_UNMOUNT').map(-1)
  ).subscribe(x => hydrate.set(store => store + x))

  const disposable = requestStream
    .doOnCompleted(() => {
      response.onCompleted()
      state.onCompleted()
    })
    .filter(Boolean)
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .combineLatest(hydrate.getStream(), (a, b) => ({a, b}))
    .filter(x => x.b)
    .map(x => x.a)
    .distinctUntilChanged(x => x, (a, b) => a === b)
    .combineLatest(reload.startWith(null), _.identity)
    .tap(x => state.onNext('BEGIN'))
    .flatMap(x => fetch(x.url, _.omit(x, 'url')))
    .tap(x => state.onNext('END'))
    .subscribe(response)
  return {
    getDataStream: () => response,
    getResponseStream: () => response,
    // TODO: expose getJSONStream (TEST)
    getJSONStream: () => response.flatMap(parseJSON),
    getStateStream: () => state,
    hydrate: x => hydrate.set(v => v + _.isFinite(x) ? x : 1),
    reload: () => reload.onNext(null),
    sync: () => lifeCycleObserver,
    // TODO: Add dispose functionality (TEST)
    dispose: () => disposable.dispose()
  }
}
