const targs = require('argtoob')

module.exports = (request, isHydrated) => request
    .combineLatest(isHydrated, targs('request', 'isHydrated'))
    .filter(x => x.isHydrated)
    .pluck('request')
