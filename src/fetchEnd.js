module.exports = (fetch, com) => com
    .filter(x => x.event === 'REQUEST')
    .flatMap(x => fetch.apply(null, x.args))
    .map(x => ({event: 'RESPONSE', args: [x]}))
