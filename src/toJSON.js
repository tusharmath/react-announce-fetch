'use strict'

const Rx = require('rx')
const targ = require('argtoob')

module.exports = response => {
  const json = response.flatMap(x => x.json()).publish()
  json.connect()
  const zip = Rx.Observable.zip(json, response, targ('json', 'response'))
  return zip
}
