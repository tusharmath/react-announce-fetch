const _ = require('lodash')
const Rx = require('rx')

// TODO: Add unit tests
module.exports = params => {
  const url = params.url
  const options = _.omit(params, 'url')
  const responseParams = ['body', 'bodyUsed', 'headers', 'ok', 'status', 'statusText', 'type', 'url']
  const selectResponseParams = _.partialRight(_.pick, responseParams)
  const parseJSON = x => Rx.Observable.fromPromise(x.json()).map(json => _.assign({json}, selectResponseParams(x)))
  return Rx.Observable.fromPromise(fetch(url, options)).flatMap(parseJSON)
}
