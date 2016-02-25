const getHydratedRequests = require('./getHydratedRequests')
module.exports = (req, com) => {
  const reload = com
    .filter(x => x.event === 'RELOAD')
    .startWith(null)

  return getHydratedRequests(req, com)
    .map(x => ({event: 'FETCH_BEGIN', args: x}))
    .combineLatest(reload, a => a)
}
