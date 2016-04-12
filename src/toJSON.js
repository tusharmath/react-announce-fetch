'use strict'

const Rx = require('rx')
const targ = require('argtoob')

module.exports = response => {
  const json = response.flatMap(x => x.json())
  return Rx.Observable.zip(json, response, targ('json', 'response'))
}
