const Rx = require('rx')
const targs = require('argtoob')
module.exports = store => {
  const request = store
    .filter(x => x.event === 'REQUEST').pluck('args')

  const response = store
    .filter(x => x.event === 'RESPONSE').map(x => x.args[0])

  const json = response.flatMap(x => x.json())

  return Rx.Observable.zip(
    request,
    response,
    json,
    targs('request', 'response', 'json')
  )
}
