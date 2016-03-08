/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')

const e = module.exports = (e, fetch, request) => {
  const observer = new Rx.Subject()
  e.fetch(fetch, request, observer).subscribe(observer)
  return observer
}

e.isHydrated = require('./isHydrated')
e.getHydratedRequests = require('./getHydratedRequests')
e.fetchEnd = require('./fetchEnd')
e.fetchBegin = require('./fetchBegin')
e.fetch = (fetch, request, observer) => Rx.Observable.merge(
    e.fetchBegin(request, observer),
    e.fetchEnd(fetch, observer)
)
