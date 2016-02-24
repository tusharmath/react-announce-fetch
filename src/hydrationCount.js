const Rx = require('rx')

module.exports = events => {
  var hydrationCount = 0
  const mount = events.filter(x => x.event === 'WILL_MOUNT').map(1)
  const unmount = events.filter(x => x.event === 'WILL_UNMOUNT').map(-1)
  return Rx.Observable
    .merge(mount, unmount).startWith(0)
    .tap(x => hydrationCount += x)
    .map(() => hydrationCount)
}
