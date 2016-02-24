const targs = require('argtoob')
const isHydrated = require('./isHydrated')

module.exports = (request, com) => request
    .combineLatest(isHydrated(com), targs('request', 'isHydrated'))
    .filter(x => x.isHydrated)
    .pluck('request')
