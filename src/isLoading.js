const Rx = require('rx')
module.exports = function () {
  return Rx.Observable.merge(
    Array.prototype.map.call(arguments, store => Rx
      .Observable.merge(
        store.filter(x => x.event === 'REQUEST').map(true),
        store.filter(x => x.event === 'RESPONSE').map(false)
      )
    )
  ).distinctUntilChanged()
}
