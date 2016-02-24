/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const Rx = require('rx')

const e = exports

e.create = function (e, request) {
  const subject = new Rx.Subject()
  request
    .flatMap(x => e.fetch(x))
    .subscribe(subject)
  return subject
}
