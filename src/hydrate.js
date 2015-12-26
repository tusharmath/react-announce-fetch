/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'

const createDeclarative = require('react-announce').createDeclarative
const _ = require('lodash')
const Rx = require('rx')

module.exports = createDeclarative(function (stream, dispose, params) {
  const mount = stream.filter(x => x.event === 'WILL_MOUNT').map(1)
  const unmount = stream.filter(x => x.event === 'WILL_UNMOUNT').map(-1)
  dispose(
    Rx
      .Observable
      .merge(mount, unmount)
      .subscribe(x => _.each(params.stores, s => s.hydrate(x)))
  )
})
