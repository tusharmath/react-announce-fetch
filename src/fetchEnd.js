module.exports = (fetch, com) => com
    .filter(x => x.event === 'FETCH_BEGIN')
    .flatMap(x => fetch.apply(null, x.args))
    .map(x => ({event: 'FETCH_END', args: [x]}))
