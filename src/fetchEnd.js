module.exports = (fetch, com) => {
  const request = com
    .filter(x => x.event === 'FETCH_BEGIN')

  const reload = com
    .filter(x => x.event === 'RELOAD')
    .startWith(null)

  return request
    .combineLatest(reload, a => a)
    .flatMap(x => fetch.apply(null, x.args))
    .map(x => ({event: 'FETCH_END', args: [x]}))
}
