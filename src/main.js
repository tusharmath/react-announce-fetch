/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const targs = require('argtoob')
const _ = require('funjector')
const e = exports

e.xhr = (fetch, request, observer) => Rx.Observable.merge(
  e.fetchBegin(request, observer),
  e.fetchEnd(fetch, observer)
)

e.create = _.partial((xhr, fetch, request) => {
  const observer = new Rx.Subject()
  xhr(fetch, request, observer).subscribe(observer)
  return observer
}, e.xhr)

e.isHydrated = events => {
  const mount = events.filter(x => x.event === 'WILL_MOUNT').map(1)
  const unmount = events.filter(x => x.event === 'WILL_UNMOUNT').map(-1)
  return Rx.Observable
    .merge(mount, unmount).startWith(0)
    .scan((m, x) => x + m, 0)
    .map(x => x > 0)
    .distinctUntilChanged()
}

e.getHydratedRequests = _.partial((isHydrated, request, com) => request
  .combineLatest(isHydrated(com), targs('request', 'isHydrated'))
  .filter(x => x.isHydrated)
  .pluck('request'),
  e.isHydrated
)

e.fetchBegin = _.partial((getHydratedRequests, req, com) => {
  const reload = com
    .filter(x => x.event === 'RELOAD')
    .startWith(null)

  return getHydratedRequests(req, com)
    .map(x => ({event: 'REQUEST', args: x}))
    .combineLatest(reload, a => a)
}, e.getHydratedRequests)

e.fetchEnd = (fetch, com) => com
  .filter(x => x.event === 'REQUEST')
  .flatMap(x => fetch.apply(null, x.args))
  .map(x => ({event: 'RESPONSE', args: [x]}))
