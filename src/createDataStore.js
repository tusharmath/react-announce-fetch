/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')

const e = exports

e.create = function (e, request) {
  const subject = new Rx.Subject()
  request

    .tap(x => subject.onNext({event: 'FETCH_START', args: [x]}))
    .flatMap(x => e.fetch(x))
    .map(response => ({event: 'FETCH_END', args: [response]}))
    .subscribe(subject)
  return subject
}
