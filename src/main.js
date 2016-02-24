/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const targs = require('argtoob')

const e = module.exports = (e, fetch, request) => {
  const observer = new Rx.Subject()
  e.fetch(fetch, request, observer).subscribe(observer)
  return observer
}

e.isHydrated = events => {
  var hydrationCount = 0
  const mount = events.filter(x => x.event === 'WILL_MOUNT').map(1)
  const unmount = events.filter(x => x.event === 'WILL_UNMOUNT').map(-1)
  return Rx.Observable
    .merge(mount, unmount).startWith(0)
    .tap(x => hydrationCount += x)
    .map(() => hydrationCount > 0)
    .distinctUntilChanged()
}

e.getHydratedRequests = (request, com) => request
    .combineLatest(e.isHydrated(com), targs('request', 'isHydrated'))
    .filter(x => x.isHydrated)
    .pluck('request')

e.fetchEnd = (fetch, com) => {
  const request = com.filter(x => x.event === 'FETCH_END').map(x => x.args[0])
  const reload = com.filter(x => x.event === 'RELOAD').startWith(null)

  return request
    .combineLatest(reload, a => a)
    .flatMap(x => fetch(x))
    .map(x => ({event: 'FETCH_END', args: [x]}))
}

e.fetchBegin = (request, observer) => e
    .getHydratedRequests(request, observer)
    .map(x => ({event: 'FETCH_END', args: [x]}))

e.fetch = (fetch, request, observer) => Rx.Observable.merge(
    e.fetchBegin(request, observer),
    e.fetchEnd(fetch, observer)
)
e.reload = observer => observer.onNext({event: 'RELOAD'})
