module.exports = (fetch, com) => {
  const request = com.filter(x => x.event === 'FETCH_END').map(x => x.args[0])
  const reload = com.filter(x => x.event === 'RELOAD').startWith(null)

  return request
    .combineLatest(reload, a => a)
    .flatMap(x => fetch(x))
    .map(x => ({event: 'FETCH_END', args: [x]}))
}
