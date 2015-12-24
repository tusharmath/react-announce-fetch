/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Immutable = require('seamless-immutable')
const Rx = require('rx')
const _ = require('lodash')
const Subject = Rx.Subject
const createStoreAsStream = require('reactive-storage').createStoreAsStream

module.exports = function (stream, fetcher) {
  var componentMounted = 0
  const response = new Subject()
  const reload = new Subject()
  const hydrate = new Subject()
  const store = createStoreAsStream(new Immutable({}))
  stream
    .filter(Boolean)
    .subscribe(x => store.update(y => y.merge(x)))
  store
    .getStream()
    .combineLatest(hydrate, (a, b) => ({a, b}))
    .filter(x => x.b > 0)
    .map(x => x.a)
    .combineLatest(reload.startWith(null), _.identity)
    .flatMap(fetcher)
    .subscribe(response)
  return {
    getStream: () => response,
    hydrate: x => {
      componentMounted += x
      hydrate.onNext(componentMounted)
    },
    reload: () => reload.onNext(null)
  }
}
