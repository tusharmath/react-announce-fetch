const _ = require('lodash')
const Rx = require('rx')

module.exports = params => {
  const url = params.url
  const options = _.omit(params, 'url')
  const parseJSON = x => Rx.Observable.fromPromise(x.json()).map(json => ({json, response: x}))
  const fetchAsObservable = (url, options) => Rx.Observable.fromPromise(params.fetch(url, options))
  return fetchAsObservable(url, options).flatMap(parseJSON)
}
