/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const targs = require('argtoob')
const e = module.exports = (e, fetch, request) => {
  const com = new Rx.Subject()
  const isHydrated = e.isHydrated(request)
  const hydratedRequests = e.getHydratedRequests(request, isHydrated)
  e.fetchStart(request).subscribe(com)
  e.fetch(fetch, com).subscribe(com)
  return com
}

e.isHydrated = require('./isHydrated')
e.getHydratedRequests = require('./getHydratedRequests')
e.fetch = require('./fetch')

e.fetchStart = (req) => req
    .map(x => ({event: 'FETCH_START', args: [x]}))

e.reload = observer => observer.onNext({event: 'RELOAD'})
