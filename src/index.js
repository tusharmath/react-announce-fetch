/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')

const e = module.exports = (e, fetch, request) => {
  const observer = new Rx.Subject()
  e.fetchStart(request, observer).subscribe(observer)
  e.fetch(fetch, observer).subscribe(observer)
  return observer
}

e.isHydrated = require('./isHydrated')
e.getHydratedRequests = require('./getHydratedRequests')
e.fetch = require('./fetch')

e.fetchStart = (request, observer) => e
    .getHydratedRequests(request, observer)
    .map(x => ({event: 'FETCH_START', args: [x]}))

e.reload = observer => observer.onNext({event: 'RELOAD'})
