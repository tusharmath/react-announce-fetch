/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')

const e = module.exports = (e, fetch, request) => {
  const observer = new Rx.Subject()
  e.fetchStart(request, observer).subscribe(observer)
  e.fetchEnd(fetch, observer).subscribe(observer)
  return observer
}

e.isHydrated = require('./isHydrated')
e.getHydratedRequests = require('./getHydratedRequests')
e.fetchEnd = require('./fetchEnd')
e.fetchBegin = require('./fetchBegin')

e.reload = observer => observer.onNext({event: 'RELOAD'})
