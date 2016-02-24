/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')
const targs = require('argtoob')
const e = module.exports = (e, request) => {
  const hydration = e.hydrationCount(request)
  return e.create(e, request, hydration)
}

e.hydrationCount = require('./hydrationCount')

e.create = function (e, request, isHydrated) {
  const subject = new Rx.Subject()
  request.combineLatest(isHydrated, targs('request', 'isHydrated'))
    .filter(x => x.isHydrated)
    .pluck('request')
    .tap(x => subject.onNext({event: 'FETCH_START', args: [x]}))
    .flatMap(x => e.fetch(x))
    .map(response => ({event: 'FETCH_END', args: [response]}))
    .subscribe(subject)
  return subject
}
